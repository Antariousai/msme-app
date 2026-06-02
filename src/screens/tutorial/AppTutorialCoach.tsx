import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import { T, Btn, Row } from '../../components/atoms';
import { Spacing, Radius } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import {
  AppTutorialStep,
  getAppTutorialSteps,
  getTutorialTargetLabel,
} from '../../data/appTutorial';
import { isUpgradeOnboarding } from '../../auth/onboarding';
import { useFeatureNav } from '../../navigation/FeatureNavContext';
import { toBn } from '../../utils/helpers';
import { CheckIcon } from '../../icons';
import {
  GuidanceShell,
  GuidanceContentCard,
  guidanceContentStyles,
  guidanceCenterText,
} from '../../components/guidance/GuidanceShell';

interface AppTutorialCoachProps {
  visible: boolean;
  onComplete: () => void;
}

export const AppTutorialCoach = ({ visible, onComplete }: AppTutorialCoachProps) => {
  const { user, completeTierTutorial } = useAuth();
  const { colors } = useTheme();
  const { openFeature, navigateHome, navigateAccount } = useFeatureNav();
  const tier = user?.tier ?? 0;
  const isUpgrade = isUpgradeOnboarding(user, tier);

  const steps = useMemo(() => getAppTutorialSteps(tier, isUpgrade), [tier, isUpgrade]);
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [openedStepIds, setOpenedStepIds] = useState<Set<string>>(new Set());

  const step = steps[index];
  const isLast = index >= steps.length - 1;
  const accentColor = colors.primary;

  useEffect(() => {
    if (visible) {
      setIndex(0);
      setOpenedStepIds(new Set());
    }
  }, [visible, tier]);

  const setStepIndex = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(next, steps.length - 1)));
  }, [steps.length]);

  const finishTutorial = async () => {
    setSubmitting(true);
    try {
      await completeTierTutorial(tier);
      onComplete();
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = async () => {
    if (submitting) return;
    if (isLast) {
      await finishTutorial();
      return;
    }
    setStepIndex(index + 1);
  };

  const goBack = () => {
    if (submitting || index <= 0) return;
    setStepIndex(index - 1);
  };

  const skip = async () => {
    if (submitting) return;
    await finishTutorial();
  };

  const openStepScreen = () => {
    if (!step) return;
    if (step.target === 'home') navigateHome();
    else if (step.target === 'account') navigateAccount();
    else openFeature(step.target, { fromOnboarding: true });
    setOpenedStepIds((prev) => new Set(prev).add(step.id));
  };

  if (!step) return null;

  const targetLabel = getTutorialTargetLabel(step.target, tier);
  const hasOpened = openedStepIds.has(step.id);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <GuidanceShell
          variant="overlay"
          stepIndex={index}
          stepTotal={steps.length}
          phaseLabel="অ্যাপ টিউটোরিয়াল"
          accentColor={accentColor}
          onBack={goBack}
          onNext={goNext}
          onSkip={skip}
          backDisabled={index === 0 || submitting}
          nextDisabled={submitting}
          nextLoading={submitting}
          backLabel="পিছনে"
          nextLabel={isLast ? 'শেষ' : 'পরবর্তী'}
        >
          <GuidanceContentCard>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={guidanceContentStyles.scroll}
            >
              <View style={guidanceContentStyles.centerBlock}>
                <T size="4xl" style={{ marginBottom: Spacing.sm }}>{step.emoji}</T>
                <T size="xl" weight="bold" style={{ ...guidanceCenterText, marginBottom: Spacing.xs }}>
                  {step.title}
                </T>
                <T size="xs" color={colors.textTertiary} style={guidanceCenterText}>
                  ধাপ {toBn(index + 1)} · {targetLabel}
                </T>
                <T
                  size="sm"
                  color={colors.textSecondary}
                  style={{ ...guidanceCenterText, marginTop: Spacing.md, marginBottom: Spacing.md }}
                >
                  {step.body}
                </T>

                {step.bullets?.map((b) => (
                  <Row key={b} gap={Spacing.sm} style={styles.bulletRow}>
                    <CheckIcon size={16} color={colors.primary} />
                    <T size="sm" style={{ flex: 1 }}>{b}</T>
                  </Row>
                ))}

                {step.screenPreview ? (
                  <View style={[styles.previewBox, { backgroundColor: colors.aiBg, borderColor: colors.border }]}>
                    <T size="xs" weight="semibold" color={colors.ai} style={guidanceCenterText}>
                      এই পেজে দেখবেন
                    </T>
                    <T size="xs" color={colors.textSecondary} style={{ ...guidanceCenterText, marginTop: 4 }}>
                      {step.screenPreview}
                    </T>
                  </View>
                ) : null}

                <Btn
                  label={hasOpened ? `✓ ${targetLabel} খোলা হয়েছে` : `${targetLabel} পেজ দেখুন`}
                  onPress={openStepScreen}
                  variant={hasOpened ? 'outline' : 'primary'}
                  size="lg"
                  fullWidth
                  style={{ marginTop: Spacing.lg }}
                  disabled={submitting}
                />
                <T size="xs" color={colors.textTertiary} style={{ ...guidanceCenterText, marginTop: Spacing.sm }}>
                  বাম/ডান বড় বাটন দিয়ে ধাপ বদলান · পেজ নিজে খুলতে উপরের বাটন
                </T>
              </View>
            </ScrollView>
          </GuidanceContentCard>
        </GuidanceShell>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  bulletRow: {
    width: '100%',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  previewBox: {
    width: '100%',
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
});
