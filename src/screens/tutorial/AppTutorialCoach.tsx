import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../auth/AuthContext';
import { T, Btn, Card, Row } from '../../components/atoms';
import { Spacing, Radius } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import {
  getAppTutorialSteps,
  getTutorialTargetLabel,
} from '../../data/appTutorial';
import { isUpgradeOnboarding } from '../../auth/onboarding';
import { useFeatureNav } from '../../navigation/FeatureNavContext';
import { toBn } from '../../utils/helpers';
import { CheckIcon, ChevronDownIcon } from '../../icons';
import { GuidanceSideNav } from '../../components/guidance/GuidanceShell';

interface AppTutorialCoachProps {
  visible: boolean;
  onComplete: () => void;
}

export const AppTutorialCoach = ({ visible, onComplete }: AppTutorialCoachProps) => {
  const { user, completeTierTutorial } = useAuth();
  const { colors } = useTheme();
  const { openFeature, navigateHome, navigateAccount } = useFeatureNav();
  const insets = useSafeAreaInsets();
  const tier = user?.tier ?? 0;
  const isUpgrade = isUpgradeOnboarding(user, tier);

  const steps = useMemo(() => getAppTutorialSteps(tier, isUpgrade), [tier, isUpgrade]);
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [openedStepIds, setOpenedStepIds] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(true);

  const step = steps[index];
  const isLast = index >= steps.length - 1;
  const accentColor = colors.primary;

  useEffect(() => {
    if (visible) {
      setIndex(0);
      setOpenedStepIds(new Set());
      setExpanded(true);
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
    setExpanded(false);
  };

  if (!step) return null;

  const targetLabel = getTutorialTargetLabel(step.target, tier);
  const hasOpened = openedStepIds.has(step.id);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View
        style={[
          styles.backdrop,
          expanded ? styles.backdropDim : styles.backdropClear,
        ]}
        pointerEvents={expanded ? 'auto' : 'box-none'}
      >
        {expanded ? (
          <>
            <View style={[styles.sideRail, styles.sideRailLeft]} pointerEvents="box-none">
              <GuidanceSideNav
                side="left"
                onPress={goBack}
                disabled={index === 0 || submitting}
                label="পিছনে"
                accentColor={accentColor}
              />
            </View>
            <View style={[styles.sideRail, styles.sideRailRight]} pointerEvents="box-none">
              <GuidanceSideNav
                side="right"
                onPress={goNext}
                disabled={submitting}
                loading={submitting}
                label={isLast ? 'শেষ' : 'পরবর্তী'}
                accentColor={accentColor}
              />
            </View>
          </>
        ) : null}

        <View
          style={[
            styles.coachAnchor,
            { paddingBottom: insets.bottom + Spacing.sm },
          ]}
          pointerEvents="box-none"
        >
          {expanded ? (
            <View style={styles.coachWrap} pointerEvents="auto">
              <Card style={[styles.coachCard, { backgroundColor: colors.surface }]} padding={0}>
                <View style={[styles.coachHeader, { backgroundColor: colors.primary + '18' }]}>
                  <View style={[styles.tutorialPill, { backgroundColor: colors.primary }]}>
                    <T size="xs" color="#fff" weight="bold">অ্যাপ টিউটোরিয়াল</T>
                  </View>
                  <Row gap={Spacing.md}>
                    <Pressable onPress={skip} hitSlop={8} disabled={submitting}>
                      <T size="xs" color={colors.textSecondary} weight="semibold">এড়িয়ে যান</T>
                    </Pressable>
                    <T size="xs" color={colors.textTertiary}>
                      {toBn(index + 1)} / {toBn(steps.length)}
                    </T>
                  </Row>
                </View>

                <ScrollView
                  style={styles.coachScroll}
                  contentContainerStyle={styles.coachScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <T size="3xl" style={{ marginBottom: Spacing.xs }}>{step.emoji}</T>
                  <T size="lg" weight="bold" style={{ marginBottom: Spacing.xs }}>{step.title}</T>
                  <View style={[styles.targetChip, { backgroundColor: colors.bgDark }]}>
                    <T size="xs" weight="semibold" color={colors.primary}>
                      📍 {targetLabel} স্ক্রিন
                    </T>
                  </View>
                  <T size="sm" color={colors.textSecondary} style={{ marginTop: Spacing.sm, marginBottom: Spacing.sm }}>
                    {step.body}
                  </T>
                  {step.bullets?.map((b) => (
                    <Row key={b} gap={Spacing.sm} style={{ marginBottom: Spacing.xs }}>
                      <CheckIcon size={14} color={colors.primary} />
                      <T size="xs" style={{ flex: 1 }}>{b}</T>
                    </Row>
                  ))}
                  {step.screenPreview ? (
                    <View style={[styles.previewBox, { backgroundColor: colors.aiBg, borderColor: colors.border }]}>
                      <T size="xs" weight="semibold" color={colors.ai}>এই পেজে দেখবেন</T>
                      <T size="xs" color={colors.textSecondary} style={{ marginTop: 4 }}>
                        {step.screenPreview}
                      </T>
                    </View>
                  ) : null}

                  <Btn
                    label={hasOpened ? `✓ ${targetLabel} খোলা — আবার দেখুন` : `${targetLabel} পেজ দেখুন`}
                    onPress={openStepScreen}
                    variant={hasOpened ? 'outline' : 'primary'}
                    size="lg"
                    fullWidth
                    style={{ marginTop: Spacing.md }}
                    disabled={submitting}
                  />
                  <T size="xs" color={colors.textTertiary} style={{ marginTop: Spacing.sm, textAlign: 'center' }}>
                    পেজ খুললে কোচ ছোট হবে — নিচের পটিতে ট্যাপ করে বড় করুন
                  </T>
                </ScrollView>

                <View style={[styles.coachFooter, { borderTopColor: colors.border }]}>
                  <Row gap={Spacing.xs} style={{ justifyContent: 'center' }}>
                    {steps.map((_, i) => (
                      <Pressable key={i} onPress={() => setStepIndex(i)} hitSlop={8} disabled={submitting}>
                        <View
                          style={[
                            styles.dot,
                            { backgroundColor: i === index ? colors.primary : colors.border },
                            i === index && styles.dotActive,
                          ]}
                        />
                      </Pressable>
                    ))}
                  </Row>
                </View>
              </Card>
            </View>
          ) : (
            <Pressable
              style={[styles.minimizedBar, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => setExpanded(true)}
              accessibilityRole="button"
              accessibilityLabel="টিউটোরিয়াল বড় করুন"
            >
              <T size="lg">{step.emoji}</T>
              <View style={styles.minimizedText}>
                <T size="sm" weight="bold" numberOfLines={1}>{step.title}</T>
                <T size="xs" color={colors.textTertiary}>
                  ধাপ {toBn(index + 1)}/{toBn(steps.length)} · ট্যাপ করে চালিয়ে যান
                </T>
              </View>
              <View style={[styles.expandBtn, { backgroundColor: colors.primary }]}>
                <View style={styles.expandIconFlip}>
                  <ChevronDownIcon size={22} color="#fff" strokeWidth={2.2} />
                </View>
              </View>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropDim: {
    backgroundColor: 'rgba(0,0,0,0.52)',
  },
  backdropClear: {
    backgroundColor: 'transparent',
  },
  sideRail: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  sideRailLeft: {
    left: 0,
  },
  sideRailRight: {
    right: 0,
  },
  coachAnchor: {
    justifyContent: 'flex-end',
    zIndex: 3,
  },
  coachWrap: {
    paddingHorizontal: Spacing.base,
    maxHeight: '78%',
  },
  coachCard: {
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
  },
  coachHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  tutorialPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  coachScroll: { maxHeight: 340 },
  coachScrollContent: { padding: Spacing.base, paddingTop: Spacing.sm },
  targetChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  previewBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  coachFooter: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
  },
  minimizedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    gap: Spacing.sm,
    shadowColor: '#083344',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  minimizedText: {
    flex: 1,
    minWidth: 0,
  },
  expandBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandIconFlip: {
    transform: [{ rotate: '180deg' }],
  },
});
