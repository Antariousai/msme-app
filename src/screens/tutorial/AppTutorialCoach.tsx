import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../auth/AuthContext';
import { T, Btn, Card, Row } from '../../components/atoms';
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

const NAV_DELAY_MS = 380;

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

  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth - Spacing.base * 2;

  const steps = useMemo(() => getAppTutorialSteps(tier, isUpgrade), [tier, isUpgrade]);
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const listRef = useRef<FlatList<AppTutorialStep>>(null);
  const indexRef = useRef(0);

  const step = steps[index];
  const isLast = index >= steps.length - 1;

  const setStepIndex = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(next, steps.length - 1));
    if (clamped === indexRef.current) return;
    indexRef.current = clamped;
    setIndex(clamped);
  }, [steps.length]);

  useEffect(() => {
    if (visible) {
      indexRef.current = 0;
      setIndex(0);
      requestAnimationFrame(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      });
    }
  }, [visible, tier]);

  useEffect(() => {
    if (!visible || !step) return;
    const timer = setTimeout(() => {
      if (step.target === 'home') navigateHome();
      else if (step.target === 'account') navigateAccount();
      else openFeature(step.target, { fromOnboarding: true });
    }, NAV_DELAY_MS);
    return () => clearTimeout(timer);
  }, [visible, index, step?.target, navigateHome, navigateAccount, openFeature]);

  useEffect(() => {
    if (!visible) return;
    listRef.current?.scrollToIndex({ index, animated: true });
  }, [index, visible, cardWidth]);

  const onSwipeEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
    if (i >= 0 && i < steps.length) setStepIndex(i);
  };

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

  const renderStepPage = ({ item }: { item: AppTutorialStep }) => {
    const targetLabel = getTutorialTargetLabel(item.target, tier);
    return (
      <View style={[styles.stepPage, { width: cardWidth }]}>
        <ScrollView
          style={styles.coachScroll}
          contentContainerStyle={styles.coachScrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <T size="3xl" style={{ marginBottom: Spacing.xs }}>{item.emoji}</T>
          <T size="lg" weight="bold" style={{ marginBottom: Spacing.xs }}>{item.title}</T>
          <View style={[styles.targetChip, { backgroundColor: colors.bgDark }]}>
            <T size="xs" weight="semibold" color={colors.primary}>
              📍 {targetLabel} স্ক্রিন
            </T>
          </View>
          <T size="sm" color={colors.textSecondary} style={{ marginTop: Spacing.sm, marginBottom: Spacing.sm }}>
            {item.body}
          </T>
          {item.bullets?.map((b) => (
            <Row key={b} gap={Spacing.sm} style={{ marginBottom: Spacing.xs }}>
              <CheckIcon size={14} color={colors.primary} />
              <T size="xs" style={{ flex: 1 }}>{b}</T>
            </Row>
          ))}
          {item.screenPreview ? (
            <View style={[styles.previewBox, { backgroundColor: colors.aiBg, borderColor: colors.border }]}>
              <T size="xs" weight="semibold" color={colors.ai}>এই পেজে দেখবেন</T>
              <T size="xs" color={colors.textSecondary} style={{ marginTop: 4 }}>
                {item.screenPreview}
              </T>
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  };

  if (!step) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={() => {}}>
        <View style={[styles.coachWrap, { paddingBottom: insets.bottom + Spacing.sm }]}>
          <Card style={[styles.coachCard, { backgroundColor: colors.surface }]} padding={0}>
            <View style={[styles.coachHeader, { backgroundColor: colors.primary + '18' }]}>
              <View style={[styles.tutorialPill, { backgroundColor: colors.primary }]}>
                <T size="xs" color="#fff" weight="bold">অ্যাপ টিউটোরিয়াল</T>
              </View>
              <T size="xs" color={colors.textTertiary}>
                {toBn(index + 1)} / {toBn(steps.length)}
              </T>
            </View>

            <FlatList
              ref={listRef}
              data={steps}
              keyExtractor={(item) => item.id}
              renderItem={renderStepPage}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              bounces={false}
              decelerationRate="fast"
              snapToInterval={cardWidth}
              snapToAlignment="start"
              disableIntervalMomentum
              onMomentumScrollEnd={onSwipeEnd}
              getItemLayout={(_, i) => ({
                length: cardWidth,
                offset: cardWidth * i,
                index: i,
              })}
              style={{ maxHeight: 360 }}
            />

            <View style={[styles.coachFooter, { borderTopColor: colors.border }]}>
              <T size="xs" color={colors.textTertiary} style={{ marginBottom: Spacing.xs, textAlign: 'center' }}>
                ← ডানে সোয়াইপ: পরের ধাপ · বামে: আগের ধাপ →
              </T>
              <Row gap={Spacing.xs} style={{ marginBottom: Spacing.sm, justifyContent: 'center' }}>
                {steps.map((_, i) => (
                  <Pressable key={i} onPress={() => setStepIndex(i)} hitSlop={8}>
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
              <Btn
                label={isLast ? 'টিউটোরিয়াল শেষ — অ্যাপ ব্যবহার করুন' : `পরবর্তী: ${steps[index + 1]?.title ?? ''}`}
                onPress={goNext}
                fullWidth
                loading={submitting}
              />
              <Row gap={Spacing.sm} style={{ marginTop: Spacing.sm }}>
                {index > 0 ? (
                  <Btn label="পিছনে" onPress={goBack} variant="outline" flex disabled={submitting} />
                ) : (
                  <View style={{ flex: 1 }} />
                )}
                <Btn label="এড়িয়ে যান" onPress={skip} variant="ghost" flex disabled={submitting} />
              </Row>
            </View>
          </Card>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.52)',
    justifyContent: 'flex-end',
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
  stepPage: { flexShrink: 0 },
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
    padding: Spacing.base,
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
});
