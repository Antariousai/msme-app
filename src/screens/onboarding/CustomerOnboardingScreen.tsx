import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../auth/AuthContext';
import { T, Card, Row, Chip } from '../../components/atoms';
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
import {
  GuidanceShell,
  GuidanceContentCard,
  guidanceContentStyles,
  guidanceCenterText,
} from '../../components/guidance/GuidanceShell';

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

  const isLoan = stepId === 'loan';
  const isReady = stepId === 'ready';
  const loanNextBlocked = hasLoanChoice === null || (hasLoanChoice === true && !lenderId);

  const handleNext = () => {
    if (isReady) {
      void finish();
      return;
    }
    goNext();
  };

  const renderBody = () => {
    const center = guidanceContentStyles.centerBlock;
    const textCenter = guidanceCenterText;

    switch (stepId as CustomerOnboardingStepId) {
      case 'welcome':
        return (
          <View style={center}>
            <View style={[styles.badge, { backgroundColor: cfg.color }]}>
              <T size="xs" color="#fff" weight="bold">গ্রাহক অনবোর্ডিং</T>
            </View>
            <T size="4xl" style={{ marginTop: Spacing.lg, marginBottom: Spacing.sm }}>{content.emoji}</T>
            <T size="2xl" weight="bold" style={textCenter}>{isUpgrade ? content.upgradeTitle : content.title}</T>
            <T size="sm" color={colors.textSecondary} style={{ ...textCenter, marginTop: Spacing.sm, marginBottom: Spacing.lg }}>
              {isUpgrade ? content.upgradeSubtitle : content.subtitle}
            </T>
            <Card style={{ backgroundColor: cfg.color + '14', width: '100%' }}>
              <T size="xs" color={colors.textTertiary} style={textCenter}>আপনি</T>
              <T size="md" weight="semibold" style={{ ...textCenter, marginTop: 4 }}>{user?.businessName}</T>
              <T size="sm" color={colors.textSecondary} style={{ ...textCenter, marginTop: 4 }}>{content.persona}</T>
            </Card>
          </View>
        );
      case 'tierValue':
        return (
          <View style={center}>
            <T size="xl" weight="bold" style={{ ...textCenter, marginBottom: Spacing.sm }}>আপনার প্যাকেজ</T>
            <T size="sm" color={colors.textSecondary} style={{ ...textCenter, marginBottom: Spacing.lg }}>
              টায়ার {tier} · {cfg.name} — {cfg.tagline}
            </T>
            {content.highlights.map((h) => (
              <Row key={h} gap={Spacing.sm} style={styles.listRow}>
                <CheckIcon size={18} color={cfg.color} />
                <T size="sm" style={{ flex: 1 }}>{h}</T>
              </Row>
            ))}
            <Card style={{ marginTop: Spacing.md, backgroundColor: colors.aiBg, width: '100%' }}>
              <T size="xs" color={colors.textSecondary} style={textCenter}>
                পরবর্তী ধাপে অ্যাপ টিউটোরিয়াল — প্রতিটি পেজ নিজে খুলে দেখতে পারবেন।
              </T>
            </Card>
          </View>
        );
      case 'whatsNew':
        return (
          <View style={center}>
            <T size="xl" weight="bold" style={{ ...textCenter, marginBottom: Spacing.lg }}>নতুন সুবিধা</T>
            {content.whatsNew.map((h) => (
              <Row key={h} gap={Spacing.sm} style={styles.listRow}>
                <T color={cfg.color}>✦</T>
                <T size="sm" style={{ flex: 1 }}>{h}</T>
              </Row>
            ))}
          </View>
        );
      case 'loan':
        return (
          <View style={center}>
            <T size="xl" weight="bold" style={{ ...textCenter, marginBottom: Spacing.sm }}>ব্যবসায়িক ঋণ</T>
            <T size="sm" color={colors.textSecondary} style={{ ...textCenter, marginBottom: Spacing.lg }}>
              {content.creditHint}
            </T>
            <Row gap={Spacing.sm} style={{ width: '100%', marginBottom: Spacing.lg }}>
              <Pressable
                style={[
                  styles.choiceCard,
                  { borderColor: hasLoanChoice === true ? cfg.color : colors.border, backgroundColor: colors.surface },
                  hasLoanChoice === true && styles.choiceActive,
                ]}
                onPress={() => setHasLoanChoice(true)}
              >
                <T size="lg">✅</T>
                <T size="sm" weight="semibold" style={{ marginTop: Spacing.xs }}>ঋণ আছে</T>
              </Pressable>
              <Pressable
                style={[
                  styles.choiceCard,
                  { borderColor: hasLoanChoice === false ? cfg.color : colors.border, backgroundColor: colors.surface },
                  hasLoanChoice === false && styles.choiceActive,
                ]}
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
          </View>
        );
      case 'credit':
        return (
          <View style={center}>
            <T size="xl" weight="bold" style={{ ...textCenter, marginBottom: Spacing.sm }}>ক্রেডিট স্কোর</T>
            <T size="sm" color={colors.textSecondary} style={{ ...textCenter, marginBottom: Spacing.lg }}>
              ঋণ থাকলে হোমে স্কোর কার্ড দেখা যাবে।
            </T>
            <LinearGradient colors={[...Gradients.hero]} style={styles.creditPreview}>
              <T size="lg" weight="semibold" color="#fff">{toBn(profile.score)} / ১০০</T>
              <T size="sm" color="#fff" style={{ marginTop: Spacing.xs }}>{profile.gradeEmoji} {profile.gradeLabel}</T>
              <View style={[styles.previewBar, { backgroundColor: '#ffffff33' }]}>
                <View style={{ width: `${profile.score}%`, height: 8, borderRadius: 4, backgroundColor: scoreColor }} />
              </View>
            </LinearGradient>
          </View>
        );
      case 'ready':
        return (
          <View style={center}>
            <T size="4xl" style={{ marginBottom: Spacing.sm }}>✅</T>
            <T size="xl" weight="bold" style={textCenter}>সেটআপ সম্পন্ন</T>
            <T size="sm" color={colors.textSecondary} style={{ ...textCenter, marginTop: Spacing.sm, marginBottom: Spacing.lg }}>
              এখন অ্যাপ টিউটোরিয়াল — প্রতিটি ফিচার নিজে খুলে দেখুন।
            </T>
            <Card style={{ backgroundColor: colors.primary + '12', width: '100%' }}>
              <T size="sm" weight="bold" style={textCenter}>📱 অ্যাপ টিউটোরিয়াল</T>
              <T size="xs" color={colors.textSecondary} style={{ ...textCenter, marginTop: 4 }}>
                বাম/ডান বাটনে ধাপ · «পেজ দেখুন» দিয়ে স্ক্রিন খুলুন
              </T>
            </Card>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <GuidanceShell
      variant="screen"
      backgroundColor={colors.bg}
      stepIndex={stepIndex}
      stepTotal={steps.length}
      phaseLabel="গ্রাহক সেটআপ"
      accentColor={cfg.color}
      onBack={goBack}
      onNext={handleNext}
      backDisabled={stepIndex === 0 || submitting}
      nextDisabled={(isLoan && loanNextBlocked) || submitting}
      nextLoading={submitting}
      backLabel="পিছনে"
      nextLabel={isReady ? 'টিউটোরিয়াল' : 'এগিয়ে'}
    >
      <GuidanceContentCard>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={guidanceContentStyles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {renderBody()}
        </ScrollView>
      </GuidanceContentCard>
    </GuidanceShell>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  listRow: {
    width: '100%',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  choiceCard: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  choiceActive: { borderWidth: 2 },
  lenderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    width: '100%',
  },
  creditPreview: {
    width: '100%',
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  previewBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
});
