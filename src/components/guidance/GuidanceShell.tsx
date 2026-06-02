import React from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, TextStyle, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../atoms';
import { Spacing, Radius } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { toBn } from '../../utils/helpers';

const RAIL_WIDTH = 76;
const NAV_BTN_SIZE = 64;

interface GuidanceSideNavProps {
  side: 'left' | 'right';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  label: string;
  accentColor: string;
}

const GuidanceSideNav = ({
  side,
  onPress,
  disabled,
  loading,
  label,
  accentColor,
}: GuidanceSideNavProps) => {
  const { colors } = useTheme();
  const isLeft = side === 'left';
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.railSlot,
        pressed && !inactive && styles.railPressed,
      ]}
    >
      <View
        style={[
          styles.navBtn,
          {
            backgroundColor: inactive ? colors.bgDark : accentColor,
            opacity: inactive ? 0.45 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : isLeft ? (
          <ChevronLeftIcon size={32} color="#fff" strokeWidth={2.2} />
        ) : (
          <ChevronRightIcon size={32} color="#fff" strokeWidth={2.2} />
        )}
      </View>
      <T
        size="xs"
        weight="semibold"
        color={inactive ? colors.textTertiary : colors.textPrimary}
        style={styles.railLabel}
      >
        {label}
      </T>
    </Pressable>
  );
};

export interface GuidanceShellProps {
  children: React.ReactNode;
  stepIndex: number;
  stepTotal: number;
  phaseLabel: string;
  accentColor: string;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  nextLabel?: string;
  backLabel?: string;
  skipLabel?: string;
  /** Dimmed full-screen overlay (tutorial) vs solid screen (onboarding) */
  variant?: 'overlay' | 'screen';
  backgroundColor?: string;
}

export const GuidanceShell = ({
  children,
  stepIndex,
  stepTotal,
  phaseLabel,
  accentColor,
  onBack,
  onNext,
  onSkip,
  backDisabled,
  nextDisabled,
  nextLoading,
  nextLabel = 'এগিয়ে',
  backLabel = 'পিছনে',
  skipLabel = 'এড়িয়ে যান',
  variant = 'screen',
  backgroundColor,
}: GuidanceShellProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const progress = stepTotal > 0 ? ((stepIndex + 1) / stepTotal) * 100 : 0;
  const isOverlay = variant === 'overlay';
  const bg = backgroundColor ?? (isOverlay ? 'transparent' : colors.bg);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: bg, paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.phasePill, { backgroundColor: accentColor }]}>
          <T size="xs" color="#fff" weight="bold">{phaseLabel}</T>
        </View>
        {onSkip ? (
          <Pressable onPress={onSkip} hitSlop={12} disabled={nextLoading}>
            <T size="sm" color={colors.textSecondary} weight="semibold">{skipLabel}</T>
          </Pressable>
        ) : (
          <View />
        )}
      </View>

      <View style={[styles.progressTrack, { backgroundColor: colors.bgDark }]}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: accentColor }]} />
      </View>
      <T size="xs" color={colors.textTertiary} style={styles.stepCounter}>
        {toBn(stepIndex + 1)} / {toBn(stepTotal)}
      </T>

      <View style={styles.bodyRow}>
        <View style={[styles.rail, { width: RAIL_WIDTH }]}>
          <GuidanceSideNav
            side="left"
            onPress={onBack}
            disabled={backDisabled}
            label={backLabel}
            accentColor={accentColor}
          />
        </View>

        <View style={styles.contentSlot}>{children}</View>

        <View style={[styles.rail, { width: RAIL_WIDTH }]}>
          <GuidanceSideNav
            side="right"
            onPress={onNext}
            disabled={nextDisabled}
            loading={nextLoading}
            label={nextLabel}
            accentColor={accentColor}
          />
        </View>
      </View>
    </View>
  );
};

/** Centered card for step copy — tutorial overlay & onboarding */
export const GuidanceContentCard = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.cardOuter, style]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
};

export const guidanceCenterText: TextStyle = { textAlign: 'center' };

export const guidanceContentStyles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  centerBlock: {
    width: '100%',
    alignItems: 'center',
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  phasePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  progressTrack: {
    height: 4,
    marginHorizontal: Spacing.base,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  stepCounter: {
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  bodyRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: Spacing.xs,
  },
  rail: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  railSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  railPressed: {
    opacity: 0.88,
  },
  navBtn: {
    width: NAV_BTN_SIZE,
    height: NAV_BTN_SIZE,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#083344',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  railLabel: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  contentSlot: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  cardOuter: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  card: {
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: '100%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
});
