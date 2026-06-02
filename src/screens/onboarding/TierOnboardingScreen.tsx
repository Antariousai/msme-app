import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../auth/AuthContext';
import { T, Btn, Card, Row, Chip, StatusPill } from '../../components/atoms';
import { Spacing, Radius, TierConfig, Gradients } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { TIER_ONBOARDING } from '../../data/tierOnboardingContent';
import {
  ONBOARDING_STEP_CONTENT,
  OnboardingStepId,
  resolveOnboardingSteps,
} from '../../data/tierOnboardingSteps';
import { LOAN_LENDERS, LoanLenderId } from '../../data/loanLenders';
import { isUpgradeOnboarding, userHasLoan } from '../../auth/onboarding';
import { computeBusinessCreditScore, creditScoreColor } from '../../utils/creditScore';
import { useTransactions } from '../../context/TransactionsContext';
import type { OpenFeatureOptions } from '../../navigation/FeatureNavContext';
import { toBn } from '../../utils/helpers';
import { CheckIcon } from '../../icons';
import { FeatureId } from '../../navigation/features';

interface TierOnboardingScreenProps {
  onComplete: () => void;
  /** Close onboarding first, then open tab/modal (required — onboarding blocks navigation) */
  onOpenFeature: (id: FeatureId, options?: OpenFeatureOptions) => void;
}

export const TierOnboardingScreen = ({ onComplete, onOpenFeature }: TierOnboardingScreenProps) => {
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
  const [autoReplyOn, setAutoReplyOn] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const includeCredit = loanAlreadySet
    ? userHasLoan(user)
    : hasLoanChoice === true;

  const steps = useMemo(
    () => resolveOnboardingSteps(tier, isUpgrade, loanAlreadySet, includeCredit),
    [tier, isUpgrade, loanAlreadySet, includeCredit],
  );

  const stepId = steps[stepIndex] ?? 'done';
  const progress = steps.length > 0 ? ((stepIndex + 1) / steps.length) * 100 : 100;

  const profile = useMemo(() => computeBusinessCreditScore(transactions), [transactions]);
  const scoreColor = creditScoreColor(profile.score);
  const willShowCredit = userHasLoan(user) || hasLoanChoice === true;

  const goToIndex = (idx: number) => {
    if (idx >= 0 && idx < steps.length) setStepIndex(idx);
  };

  const goNext = () => {
    if (stepId === 'loan') {
      if (hasLoanChoice === true && lenderId) {
        const creditIdx = steps.indexOf('credit');
        goToIndex(creditIdx >= 0 ? creditIdx : stepIndex + 1);
        return;
      }
      const tabsIdx = steps.indexOf('tabs');
      const doneIdx = steps.indexOf('done');
      goToIndex(tabsIdx >= 0 ? tabsIdx : doneIdx >= 0 ? doneIdx : stepIndex + 1);
      return;
    }
    goToIndex(stepIndex + 1);
  };

  const goBack = () => goToIndex(stepIndex - 1);

  const openStepFeature = (
    featureId: FeatureId,
    bookkeepingAction?: 'income' | 'expense',
  ) => {
    onOpenFeature(featureId, { bookkeepingAction, fromOnboarding: true });
  };

  const finish = async (openFirstWin = false) => {
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
      if (openFirstWin) {
        const fw = content.firstWin;
        onOpenFeature(fw.featureId, {
          bookkeepingAction: fw.bookkeepingAction,
          fromOnboarding: true,
        });
      } else {
        onComplete();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderWelcome = () => (
    <>
      <T size="4xl" style={{ marginBottom: Spacing.sm }}>{content.emoji}</T>
      <T size="2xl" weight="bold">{isUpgrade ? content.upgradeTitle : content.title}</T>
      <T size="sm" color={colors.textSecondary} style={{ marginTop: Spacing.xs, marginBottom: Spacing.md }}>
        {isUpgrade ? content.upgradeSubtitle : content.subtitle}
      </T>
      <Card style={{ marginBottom: Spacing.md, backgroundColor: cfg.color + '14' }}>
        <T size="xs" color={colors.textTertiary}>লক্ষ্য ব্যবহারকারী</T>
        <T size="sm" style={{ marginTop: 4 }}>{content.persona}</T>
      </Card>
      {!isUpgrade && tier === 0 ? (
        <Card style={{ backgroundColor: colors.aiBg, marginBottom: Spacing.md }}>
          <T size="sm" weight="bold">মৌলিক হিসাব</T>
          <T size="xs" color={colors.textSecondary} style={{ marginTop: 4 }}>
            Facebook/Instagram ছাড়াই — শুধু আয়, খরচ ও লাভ।
          </T>
        </Card>
      ) : null}
      {!isUpgrade && tier === 1 ? (
        <Card style={{ backgroundColor: colors.aiBg, marginBottom: Spacing.md }}>
          <T size="sm" weight="bold">ইনবক্স + টাকার হিসাব</T>
          <T size="xs" color={colors.textSecondary} style={{ marginTop: 4 }}>
            মেসেজ মিস করবেন না — চ্যাট থেকে অর্ডার ও আয় এক অ্যাপে।
          </T>
        </Card>
      ) : null}
      <T size="sm" color={colors.textSecondary}>
        {isUpgrade ? 'নতুন টুল — পরের ধাপে দেখুন।' : 'পরের ধাপগুলোতে প্রতিটি ফিচার সংক্ষেপে শেখানো হবে।'}
      </T>
    </>
  );

  const renderWhatsNew = () => (
    <>
      <T size="4xl" style={{ marginBottom: Spacing.sm }}>🆕</T>
      <T size="xl" weight="bold">{content.upgradeTitle}</T>
      <T size="sm" color={colors.textSecondary} style={{ marginBottom: Spacing.lg }}>
        {content.upgradeSubtitle}
      </T>
      {content.whatsNew.map((h) => (
        <Row key={h} gap={Spacing.sm} style={{ marginBottom: Spacing.md }}>
          <T size="sm" color={cfg.color}>✦</T>
          <T size="sm" style={{ flex: 1 }}>{h}</T>
        </Row>
      ))}
    </>
  );

  const renderTierStep = (id: OnboardingStepId) => {
    const meta = ONBOARDING_STEP_CONTENT[id];
    if (!meta) return null;

    return (
      <>
        <T size="4xl" style={{ marginBottom: Spacing.sm }}>{meta.emoji}</T>
        <T size="xl" weight="bold" style={{ marginBottom: Spacing.sm }}>{meta.title}</T>
        <T size="sm" color={colors.textSecondary} style={{ marginBottom: Spacing.lg }}>
          {meta.body}
        </T>
        {meta.bullets?.map((b) => (
          <Row key={b} gap={Spacing.sm} style={{ marginBottom: Spacing.sm }}>
            <CheckIcon size={16} color={cfg.color} />
            <T size="sm" style={{ flex: 1 }}>{b}</T>
          </Row>
        ))}

        {id === 't0_firstTransaction' && (
          <Row gap={Spacing.sm} style={{ marginTop: Spacing.lg }}>
            <Btn
              label="➕ আয়"
              onPress={() => openStepFeature('bookkeeping', 'income')}
              variant="income"
              flex
            />
            <Btn
              label="➖ খরচ"
              onPress={() => openStepFeature('bookkeeping', 'expense')}
              variant="expense"
              flex
            />
          </Row>
        )}

        {id === 't1_connectChannels' && (
          <Row gap={Spacing.sm} style={{ marginTop: Spacing.lg }}>
            <StatusPill label="Facebook সংযুক্ত" type="success" />
            <StatusPill label="Instagram সংযুক্ত" type="success" />
          </Row>
        )}

        {id === 't1_autoReply' && (
          <Card style={{ marginTop: Spacing.lg }}>
            <Row justify="space-between" align="center">
              <T size="sm" weight="semibold">অটো রিপ্লাই চালু</T>
              <Switch
                value={autoReplyOn}
                onValueChange={setAutoReplyOn}
                trackColor={{ false: colors.border, true: colors.primary2 }}
                thumbColor={colors.surface}
              />
            </Row>
            <T size="xs" color={colors.textTertiary} style={{ marginTop: Spacing.xs }}>
              {autoReplyOn ? 'টেমপ্লেট উত্তর সক্রিয় (ডেমো)' : 'ম্যানুয়াল উত্তর'}
            </T>
          </Card>
        )}

        {id === 't2_orderPipeline' && (
          <Card style={{ marginTop: Spacing.lg }}>
            <Row gap={Spacing.xs} wrap>
              <StatusPill label="অপেক্ষমাণ" type="warning" />
              <T size="xs">→</T>
              <StatusPill label="কনফার্ম" type="info" />
              <T size="xs">→</T>
              <StatusPill label="পাঠানো" type="info" />
              <T size="xs">→</T>
              <StatusPill label="ডেলিভার্ড" type="success" />
            </Row>
          </Card>
        )}

        {id === 't3_leadScore' && (
          <Card style={{ marginTop: Spacing.lg, backgroundColor: colors.warningLight }}>
            <T size="sm" weight="bold">উদাহরণ: আয়েশা সিদ্দিকা</T>
            <T size="xs" color={colors.textSecondary}>স্কোর ৯২ · হট লিড 🔥</T>
          </Card>
        )}

        {id === 't3_kanban' && (
          <Row gap={Spacing.xs} wrap style={{ marginTop: Spacing.lg }}>
            {['নতুন', 'যোগাযোগ', 'যোগ্য', 'রূপান্তর'].map((s) => (
              <Chip key={s} label={s} active={s === 'যোগ্য'} onPress={() => {}} />
            ))}
          </Row>
        )}

        {id === 't4_periodSummary' && (
          <Row gap={Spacing.xs} style={{ marginTop: Spacing.lg }}>
            <Chip label="দৈনিক" active onPress={() => {}} />
            <Chip label="সাপ্তাহিক" onPress={() => {}} />
            <Chip label="মাসিক" onPress={() => {}} />
          </Row>
        )}

        {meta.featureId && meta.ctaLabel && id !== 't0_firstTransaction' && (
          <Btn
            label={meta.ctaLabel}
            onPress={() =>
              openStepFeature(meta.featureId!, meta.bookkeepingAction)
            }
            fullWidth
            style={{ marginTop: Spacing.lg }}
          />
        )}
      </>
    );
  };

  const renderLoan = () => (
    <>
      <T size="4xl" style={{ marginBottom: Spacing.sm }}>🏦</T>
      <T size="xl" weight="bold" style={{ marginBottom: Spacing.sm }}>ব্যবসায়িক ঋণ</T>
      <T size="sm" color={colors.textSecondary} style={{ marginBottom: Spacing.lg }}>
        {content.creditHint} ক্রেডিট স্কোর শুধু ঋণগ্রহীতাদের হোমে দেখা যায়; ঋণ না থাকলে দেখাবে না।
      </T>
      <Row gap={Spacing.sm} style={{ marginBottom: Spacing.lg }}>
        <Pressable
          style={[
            styles.choiceCard,
            { borderColor: hasLoanChoice === true ? cfg.color : colors.border, backgroundColor: colors.surface },
            hasLoanChoice === true && { borderWidth: 2 },
          ]}
          onPress={() => setHasLoanChoice(true)}
        >
          <T size="lg">✅</T>
          <T size="sm" weight="semibold" style={{ marginTop: Spacing.xs }}>হ্যাঁ, ঋণ আছে</T>
        </Pressable>
        <Pressable
          style={[
            styles.choiceCard,
            { borderColor: hasLoanChoice === false ? cfg.color : colors.border, backgroundColor: colors.surface },
            hasLoanChoice === false && { borderWidth: 2 },
          ]}
          onPress={() => {
            setHasLoanChoice(false);
            setLenderId(null);
          }}
        >
          <T size="lg">🚫</T>
          <T size="sm" weight="semibold" style={{ marginTop: Spacing.xs }}>না, ঋণ নেই</T>
        </Pressable>
      </Row>
      {hasLoanChoice === true && (
        <>
          <T size="sm" weight="semibold" style={{ marginBottom: Spacing.sm }}>ঋণ কোথা থেকে?</T>
          <View style={styles.lenderGrid}>
            {LOAN_LENDERS.map((l) => (
              <Chip
                key={l.id}
                label={`${l.emoji} ${l.label}`}
                active={lenderId === l.id}
                onPress={() => setLenderId(l.id)}
              />
            ))}
          </View>
        </>
      )}
    </>
  );

  const renderCredit = () => (
    <>
      <T size="xl" weight="bold" style={{ marginBottom: Spacing.sm }}>আপনার ক্রেডিট স্কোর</T>
      <T size="sm" color={colors.textSecondary} style={{ marginBottom: Spacing.lg }}>
        {content.creditHint}
      </T>
      <LinearGradient
        colors={[...Gradients.hero]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.creditPreview}
      >
        <T size="sm" weight="semibold" color="#fff" style={{ opacity: 0.9 }}>বর্তমান স্কোর</T>
        <T color="#fff" weight="bold" style={styles.previewScore}>{toBn(profile.score)}</T>
        <T size="xs" color="#fff" style={{ opacity: 0.85 }}>
          / ১০০ · {profile.gradeEmoji} {profile.gradeLabel}
        </T>
        <View style={[styles.previewBar, { backgroundColor: '#ffffff33' }]}>
          <View
            style={{
              width: `${profile.score}%`,
              height: 8,
              borderRadius: 4,
              backgroundColor: scoreColor,
            }}
          />
        </View>
      </LinearGradient>
      <T size="xs" color={colors.textTertiary} style={{ marginTop: Spacing.md, textAlign: 'center' }}>
        হোম স্ক্রিনের একদম উপরে এই কার্ড থাকবে
      </T>
    </>
  );

  const renderTabs = () => (
    <>
      <T size="4xl" style={{ marginBottom: Spacing.sm }}>🧭</T>
      <T size="xl" weight="bold" style={{ marginBottom: Spacing.sm }}>হোম ট্যাব ট্যুর</T>
      <T size="sm" color={colors.textSecondary} style={{ marginBottom: Spacing.lg }}>
        প্রতিদিনের কাজ নিচের ট্যাব থেকে করবেন।
      </T>
      {content.tabTour.map((tab, i) => (
        <Card key={tab.label} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
          <Row gap={Spacing.md}>
            <View style={[styles.tabNum, { backgroundColor: cfg.color + '22' }]}>
              <T size="xs" weight="bold" color={cfg.color}>{toBn(i + 1)}</T>
            </View>
            <View style={{ flex: 1 }}>
              <T size="sm" weight="bold">{tab.emoji} {tab.label}</T>
              <T size="xs" color={colors.textSecondary}>{tab.hint}</T>
            </View>
          </Row>
        </Card>
      ))}
    </>
  );

  const renderDone = () => (
    <>
      <T size="4xl" style={{ marginBottom: Spacing.sm }}>🎉</T>
      <T size="xl" weight="bold">সব প্রস্তুত!</T>
      <T size="sm" color={colors.textSecondary} style={{ marginTop: Spacing.sm, marginBottom: Spacing.md }}>
        {willShowCredit ? content.doneWithLoan : content.doneWithoutLoan}
      </T>
      <Card style={{ backgroundColor: cfg.color + '10' }}>
        <T size="sm" weight="bold">হোমে প্রথম কাজ</T>
        <T size="xs" color={colors.textSecondary} style={{ marginTop: 4 }}>
          {content.firstWin.description}
        </T>
      </Card>
    </>
  );

  const renderBody = () => {
    if (stepId === 'welcome') return renderWelcome();
    if (stepId === 'whatsNew') return renderWhatsNew();
    if (stepId === 'loan') return renderLoan();
    if (stepId === 'credit') return renderCredit();
    if (stepId === 'tabs') return renderTabs();
    if (stepId === 'done') return renderDone();
    return renderTierStep(stepId);
  };

  const isLoan = stepId === 'loan';
  const isDone = stepId === 'done';
  const isOptionalSkip =
    stepId === 't0_stockOptional' ||
    stepId === 't0_ngoReport' ||
    stepId === 't1_calendar' ||
    stepId === 't2_websiteSoon' ||
    stepId === 't4_reportsExport';

  const meta = ONBOARDING_STEP_CONTENT[stepId];
  const secondarySkip = meta?.secondaryLabel;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <View style={[styles.progressTrack, { backgroundColor: colors.bgDark }]}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: cfg.color }]} />
      </View>
      <T size="xs" color={colors.textTertiary} style={styles.stepCounter}>
        ধাপ {toBn(stepIndex + 1)} / {toBn(steps.length)}
      </T>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {renderBody()}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        {isDone ? (
          <View style={{ gap: Spacing.sm }}>
            <Btn
              label={content.firstWin.ctaLabel}
              onPress={() => finish(true)}
              fullWidth
              loading={submitting}
            />
            <Btn label="ড্যাশবোর্ডে যান" onPress={() => finish(false)} variant="outline" fullWidth />
          </View>
        ) : isLoan ? (
          <Row gap={Spacing.sm}>
            {stepIndex > 0 ? <Btn label="পিছনে" onPress={goBack} variant="outline" flex /> : null}
            <Btn
              label="এগিয়ে যান"
              onPress={goNext}
              flex
              disabled={hasLoanChoice === null || (hasLoanChoice === true && !lenderId)}
            />
          </Row>
        ) : (
          <View style={{ gap: Spacing.sm }}>
            <Row gap={Spacing.sm}>
              {stepIndex > 0 ? <Btn label="পিছনে" onPress={goBack} variant="outline" flex /> : null}
              <Btn label="এগিয়ে যান" onPress={goNext} flex />
            </Row>
            {isOptionalSkip && secondarySkip ? (
              <Btn label={secondarySkip} onPress={goNext} variant="ghost" size="sm" fullWidth />
            ) : null}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  progressTrack: { height: 4, width: '100%' },
  progressFill: { height: 4 },
  stepCounter: { textAlign: 'center', paddingTop: Spacing.sm },
  scroll: { padding: Spacing.xl, paddingBottom: Spacing['2xl'], flexGrow: 1 },
  footer: { padding: Spacing.base, borderTopWidth: 1 },
  choiceCard: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  lenderGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  creditPreview: { borderRadius: Radius.lg, padding: Spacing.xl, alignItems: 'center' },
  previewScore: { fontSize: 48, lineHeight: 56, marginVertical: Spacing.sm },
  previewBar: { width: '100%', height: 8, borderRadius: 4, marginTop: Spacing.md, overflow: 'hidden' },
  tabNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
