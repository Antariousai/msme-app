import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../auth/AuthContext';
import { T, Btn, Card, Row, Chip } from '../../components/atoms';
import { Spacing, Radius, TierConfig, Gradients } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { TIER_ONBOARDING } from '../../data/tierOnboardingContent';
import {
  CustomerOnboardingStepId,
  resolveCustomerSteps,
} from '../../data/customerOnboardingFlows';
import { LOAN_LENDERS, LoanLenderId } from '../../data/loanLenders';
import { isUpgradeOnboarding, userHasLoan } from '../../auth/onboarding';
import { computeBusinessCreditScore, creditScoreColor } from '../../utils/creditScore';
import { useTransactions } from '../../context/TransactionsContext';
import { toBn } from '../../utils/helpers';
import { CheckIcon } from '../../icons';

interface CustomerOnboardingScreenProps {
  onComplete: () => void;
}

/** Phase 1 — customer setup (not app tutorial) */
export const CustomerOnboardingScreen = ({ onComplete }: CustomerOnboardingScreenProps) => {
  const { user, completeTierOnboarding } = useAuth();
  const { colors } = useTheme();
  const { transactions } = useTransactions();
  const tier = user?.tier ?? 0;
  const content = TIER_ONBOARDING[tier];
  const cfg = TierConfig[tier];
  const loanAlreadySet = user?.loanProfile !== undefined;
  const isUpgrade = isUpgradeOnboarding(user, tier);

  const [stepIndex, setStepIndex] = useState(0);
  const [hasLoanChoice, setHasLoanChoice] = useState<boolean | null>(null);
  const [lenderId, setLenderId] = useState<LoanLenderId | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const includeCredit = loanAlreadySet ? userHasLoan(user) : hasLoanChoice === true;
  const steps = useMemo(
    () => resolveCustomerSteps(tier, isUpgrade, loanAlreadySet, includeCredit),
    [tier, isUpgrade, loanAlreadySet, includeCredit],
  );
  const stepId = steps[stepIndex] ?? 'ready';
  const progress = steps.length > 0 ? ((stepIndex + 1) / steps.length) * 100 : 100;

  const profile = useMemo(() => computeBusinessCreditScore(transactions), [transactions]);
  const scoreColor = creditScoreColor(profile.score);

  const goNext = () => {
    if (stepId === 'loan') {
      if (hasLoanChoice === true && lenderId) {
        const idx = steps.indexOf('credit');
        setStepIndex(idx >= 0 ? idx : stepIndex + 1);
        return;
      }
      const readyIdx = steps.indexOf('ready');
      setStepIndex(readyIdx >= 0 ? readyIdx : stepIndex + 1);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  const finish = async () => {
    setSubmitting(true);
    try {
      if (!loanAlreadySet && hasLoanChoice !== null) {
        await completeTierOnboarding(tier, {
          hasLoan: hasLoanChoice,
          lenderId: hasLoanChoice ? lenderId ?? undefined : undefined,
        });
      } else {
        await completeTierOnboarding(tier);
      }
      onComplete();
    } finally {
      setSubmitting(false);
    }
  };

  const renderBody = () => {
    switch (stepId as CustomerOnboardingStepId) {
      case 'welcome':
        return (
          <>
            <View style={[styles.badge, { backgroundColor: cfg.color }]}>
              <T size="xs" color="#fff" weight="bold">গ্রাহক অনবোর্ডিং</T>
            </View>
            <T size="4xl" style={{ marginTop: Spacing.md, marginBottom: Spacing.sm }}>{content.emoji}</T>
            <T size="2xl" weight="bold">{isUpgrade ? content.upgradeTitle : content.title}</T>
            <T size="sm" color={colors.textSecondary} style={{ marginTop: Spacing.xs, marginBottom: Spacing.lg }}>
              {isUpgrade ? content.upgradeSubtitle : content.subtitle}
            </T>
            <Card style={{ backgroundColor: cfg.color + '14' }}>
              <T size="xs" color={colors.textTertiary}>আপনি</T>
              <T size="sm" weight="semibold">{user?.businessName}</T>
              <T size="xs" color={colors.textSecondary}>{content.persona}</T>
            </Card>
          </>
        );
      case 'tierValue':
        return (
          <>
            <T size="xl" weight="bold" style={{ marginBottom: Spacing.sm }}>আপনার প্যাকেজ</T>
            <T size="sm" color={colors.textSecondary} style={{ marginBottom: Spacing.lg }}>
              টায়ার {tier} · {cfg.name} — {cfg.tagline}
            </T>
            {content.highlights.map((h) => (
              <Row key={h} gap={Spacing.sm} style={{ marginBottom: Spacing.md }}>
                <CheckIcon size={18} color={cfg.color} />
                <T size="sm" style={{ flex: 1 }}>{h}</T>
              </Row>
            ))}
            <Card style={{ marginTop: Spacing.sm, backgroundColor: colors.aiBg }}>
              <T size="xs" color={colors.textSecondary}>
                পরবর্তী ধাপে অ্যাপ ব্যবহারের সংক্ষিপ্ত টিউটোরিয়াল দেখানো হবে।
              </T>
            </Card>
          </>
        );
      case 'whatsNew':
        return (
          <>
            <T size="xl" weight="bold" style={{ marginBottom: Spacing.lg }}>নতুন সুবিধা</T>
            {content.whatsNew.map((h) => (
              <Row key={h} gap={Spacing.sm} style={{ marginBottom: Spacing.md }}>
                <T color={cfg.color}>✦</T>
                <T size="sm" style={{ flex: 1 }}>{h}</T>
              </Row>
            ))}
          </>
        );
      case 'loan':
        return (
          <>
            <T size="xl" weight="bold" style={{ marginBottom: Spacing.sm }}>ব্যবসায়িক ঋণ</T>
            <T size="sm" color={colors.textSecondary} style={{ marginBottom: Spacing.lg }}>
              {content.creditHint}
            </T>
            <Row gap={Spacing.sm} style={{ marginBottom: Spacing.lg }}>
              <Pressable
                style={[styles.choiceCard, { borderColor: hasLoanChoice === true ? cfg.color : colors.border, backgroundColor: colors.surface }, hasLoanChoice === true && styles.choiceActive]}
                onPress={() => setHasLoanChoice(true)}
              >
                <T size="lg">✅</T>
                <T size="sm" weight="semibold" style={{ marginTop: Spacing.xs }}>ঋণ আছে</T>
              </Pressable>
              <Pressable
                style={[styles.choiceCard, { borderColor: hasLoanChoice === false ? cfg.color : colors.border, backgroundColor: colors.surface }, hasLoanChoice === false && styles.choiceActive]}
                onPress={() => { setHasLoanChoice(false); setLenderId(null); }}
              >
                <T size="lg">🚫</T>
                <T size="sm" weight="semibold" style={{ marginTop: Spacing.xs }}>ঋণ নেই</T>
              </Pressable>
            </Row>
            {hasLoanChoice === true && (
              <View style={styles.lenderGrid}>
                {LOAN_LENDERS.map((l) => (
                  <Chip key={l.id} label={`${l.emoji} ${l.label}`} active={lenderId === l.id} onPress={() => setLenderId(l.id)} />
                ))}
              </View>
            )}
          </>
        );
      case 'credit':
        return (
          <>
            <T size="xl" weight="bold" style={{ marginBottom: Spacing.sm }}>ক্রেডিট স্কোর</T>
            <T size="sm" color={colors.textSecondary} style={{ marginBottom: Spacing.lg }}>
              ঋণ থাকলে হোমে স্কোর কার্ড দেখা যাবে।
            </T>
            <LinearGradient colors={[...Gradients.hero]} style={styles.creditPreview}>
              <T size="sm" weight="semibold" color="#fff">{toBn(profile.score)} / ১০০</T>
              <T size="xs" color="#fff">{profile.gradeEmoji} {profile.gradeLabel}</T>
              <View style={[styles.previewBar, { backgroundColor: '#ffffff33' }]}>
                <View style={{ width: `${profile.score}%`, height: 8, borderRadius: 4, backgroundColor: scoreColor }} />
              </View>
            </LinearGradient>
          </>
        );
      case 'ready':
        return (
          <>
            <T size="4xl" style={{ marginBottom: Spacing.sm }}>✅</T>
            <T size="xl" weight="bold">সেটআপ সম্পন্ন</T>
            <T size="sm" color={colors.textSecondary} style={{ marginTop: Spacing.sm, marginBottom: Spacing.lg }}>
              এখন অ্যাপ টিউটোরিয়াল শুরু হবে — প্রতিটি পেজে কী পাবেন তা দেখানো হবে।
            </T>
            <Card style={{ backgroundColor: colors.primary + '12' }}>
              <T size="sm" weight="bold">📱 অ্যাপ টিউটোরিয়াল</T>
              <T size="xs" color={colors.textSecondary} style={{ marginTop: 4 }}>
                নিচ থেকে কোচ কার্ড — আসল স্ক্রিনের উপর গাইড
              </T>
            </Card>
          </>
        );
      default:
        return null;
    }
  };

  const isLoan = stepId === 'loan';
  const isReady = stepId === 'ready';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <View style={[styles.progressTrack, { backgroundColor: colors.bgDark }]}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: cfg.color }]} />
      </View>
      <T size="xs" color={colors.textTertiary} style={styles.stepLabel}>
        গ্রাহক সেটআপ · {toBn(stepIndex + 1)}/{toBn(steps.length)}
      </T>
      <ScrollView contentContainerStyle={styles.scroll}>{renderBody()}</ScrollView>
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        {isReady ? (
          <Btn label="টিউটোরিয়াল শুরু করুন" onPress={finish} fullWidth loading={submitting} />
        ) : isLoan ? (
          <Row gap={Spacing.sm}>
            {stepIndex > 0 ? <Btn label="পিছনে" onPress={goBack} variant="outline" flex /> : null}
            <Btn label="এগিয়ে যান" onPress={goNext} flex disabled={hasLoanChoice === null || (hasLoanChoice === true && !lenderId)} />
          </Row>
        ) : (
          <Row gap={Spacing.sm}>
            {stepIndex > 0 ? <Btn label="পিছনে" onPress={goBack} variant="outline" flex /> : null}
            <Btn label="এগিয়ে যান" onPress={goNext} flex />
          </Row>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  progressTrack: { height: 4 },
  progressFill: { height: 4 },
  stepLabel: { textAlign: 'center', paddingTop: Spacing.sm },
  scroll: { padding: Spacing.xl, flexGrow: 1 },
  footer: { padding: Spacing.base, borderTopWidth: 1 },
  choiceCard: { flex: 1, borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, alignItems: 'center' },
  choiceActive: { borderWidth: 2 },
  lenderGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  creditPreview: { borderRadius: Radius.lg, padding: Spacing.xl, alignItems: 'center' },
  previewBar: { width: '100%', height: 8, borderRadius: 4, marginTop: Spacing.md, overflow: 'hidden' },
});
