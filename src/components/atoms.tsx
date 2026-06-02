import React from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ActivityIndicator, ScrollView, TextInput, Pressable, StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, Shadow, Typography } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RipplePressable, SlideIn } from './motion';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '../theme';

type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

const fontForWeight = (weight: TextWeight = 'regular') => {
  const map: Record<TextWeight, string> = {
    regular: Typography.fontFamily.regular,
    medium: Typography.fontFamily.medium,
    semibold: Typography.fontFamily.semibold,
    bold: Typography.fontFamily.bold,
  };
  return map[weight];
};

// ─── Text ────────────────────────────────────────────────────────────────────

interface TProps {
  children: React.ReactNode;
  size?: keyof typeof Typography.size;
  color?: string;
  weight?: TextWeight;
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
  numberOfLines?: number;
}

export const T = ({
  children, size = 'base', color,
  weight = 'regular', align = 'left', style, numberOfLines,
}: TProps) => {
  const { colors } = useTheme();
  const textColor = color ?? colors.textPrimary;
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{
        fontFamily: fontForWeight(weight),
        fontSize: Typography.size[size],
        color: textColor,
        textAlign: align,
        lineHeight: Typography.size[size] * Typography.lineHeight.normal,
      }, style]}
    >
      {children}
    </Text>
  );
};

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevated?: boolean;
  padding?: number;
}

export const Card = ({ children, style, onPress, elevated = false, padding = Spacing.lg }: CardProps) => {
  const { colors } = useTheme();
  const baseStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    padding,
    ...(elevated ? Shadow.md : Shadow.card),
  };
  if (onPress) {
    return (
      <RipplePressable onPress={onPress} style={[baseStyle, style]}>
        {children}
      </RipplePressable>
    );
  }
  return <View style={[baseStyle, style]}>{children}</View>;
};

// ─── Button ──────────────────────────────────────────────────────────────────

interface BtnProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /** Equal-width button inside a horizontal row (use instead of fullWidth in rows) */
  flex?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Btn = ({
  label, onPress, variant = 'primary', size = 'md',
  fullWidth = false, flex = false, loading = false, disabled = false, icon, style,
}: BtnProps) => {
  const { colors } = useTheme();
  const heights = { sm: 36, md: 50, lg: 56 };

  const variantStyles: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: colors.primary, text: colors.textInverse },
    secondary: { bg: colors.accent, text: colors.textInverse },
    outline: { bg: 'transparent', text: colors.primary, border: colors.primary },
    ghost: { bg: colors.chip, text: colors.chipInk },
    danger: { bg: colors.expense, text: colors.textInverse },
  };

  const vs = variantStyles[variant];
  const useGradient = variant === 'primary' || variant === 'secondary';

  const inner = (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={vs.text}/>
      ) : (
        <>
          {icon}
          <T size={size === 'sm' ? 'sm' : 'md'} color={vs.text} weight="bold" numberOfLines={1}>
            {label}
          </T>
        </>
      )}
    </>
  );

  const boxStyle: ViewStyle = {
    height: heights[size],
    paddingHorizontal: size === 'sm' ? Spacing.md : Spacing.lg,
    borderRadius: Radius.btn,
    backgroundColor: useGradient ? 'transparent' : vs.bg,
    borderWidth: vs.border ? 1.5 : 0,
    borderColor: vs.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    overflow: 'hidden',
    ...(flex && { flex: 1, minWidth: 0, alignSelf: 'stretch' }),
    ...(fullWidth && !flex && { width: '100%' }),
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <RipplePressable
      onPress={onPress}
      disabled={disabled || loading}
      bounce
      style={[boxStyle, style]}
    >
      {useGradient && (
        <LinearGradient
          colors={variant === 'primary' ? [...Gradients.button] : [colors.accent, colors.primary2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs }}>
        {inner}
      </View>
    </RipplePressable>
  );
};

// ─── Chip / Tag ───────────────────────────────────────────────────────────────

interface ChipProps {
  label: string;
  color?: string;
  bg?: string;
  onPress?: () => void;
  active?: boolean;
}

export const Chip = ({ label, color, bg, onPress, active = false }: ChipProps) => {
  const { colors } = useTheme();
  return (
    <RipplePressable
      onPress={onPress}
      style={{
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        backgroundColor: active ? (bg ?? colors.primary) : colors.surface,
        ...Shadow.card,
      }}
    >
      <T size="sm" color={active ? (color ?? colors.textInverse) : colors.textSecondary} weight="bold">
        {label}
      </T>
    </RipplePressable>
  );
};

// ─── Row ─────────────────────────────────────────────────────────────────────

interface RowProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
  fill?: boolean;
}

export const Row = ({
  children, style, gap = Spacing.sm, align = 'center',
  justify = 'flex-start', wrap = false, fill = false,
}: RowProps) => (
  <View style={[{
    flexDirection: 'row',
    alignItems: align,
    justifyContent: justify,
    gap,
    ...(wrap && { flexWrap: 'wrap' }),
    ...(fill && { width: '100%' }),
  }, style]}>
    {children}
  </View>
);

/** Side-by-side buttons that share width equally on mobile */
export const BtnRow = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <Row fill style={style}>
    {children}
  </Row>
);

// ─── Divider ─────────────────────────────────────────────────────────────────

export const Divider = ({ style }: { style?: ViewStyle }) => {
  const { colors } = useTheme();
  return (
    <View style={[{ height: 1, backgroundColor: colors.border, marginVertical: Spacing.sm }, style]}/>
  );
};

// ─── Badge ───────────────────────────────────────────────────────────────────

interface BadgeProps {
  count?: number;
  color?: string;
  size?: number;
}

export const Badge = ({ count, color, size = 18 }: BadgeProps) => {
  const { colors } = useTheme();
  const badgeColor = color ?? colors.error;
  if (!count || count === 0) return null;
  return (
    <View style={{
      backgroundColor: badgeColor,
      borderRadius: Radius.full,
      minWidth: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    }}>
      <T size="xs" color={colors.textInverse} weight="bold">{count > 99 ? '99+' : String(count)}</T>
    </View>
  );
};

// ─── Section Header ──────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader = ({ title, action, onAction }: SectionHeaderProps) => {
  const { colors } = useTheme();
  return (
    <Row justify="space-between" style={{ marginBottom: Spacing.sm }}>
      <T size="md" weight="bold">{title}</T>
      {action && onAction && (
        <Pressable onPress={onAction}>
          <T size="sm" color={colors.primary} weight="medium">{action}</T>
        </Pressable>
      )}
    </Row>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  style?: ViewStyle;
}

export const StatCard = ({
  label, value, subtitle, color, icon, trend, trendValue, style,
}: StatCardProps) => {
  const { colors } = useTheme();
  const accent = color ?? colors.primary;
  return (
  <Card style={[{ flex: 1 }, style]}>
    <Row justify="space-between" align="flex-start" style={{ marginBottom: Spacing.sm }}>
      <T size="sm" color={colors.textSecondary}>{label}</T>
      {icon && <View style={{ opacity: 0.7 }}>{icon}</View>}
    </Row>
    <T size="2xl" weight="bold" color={accent}>{value}</T>
    {(subtitle || (trend && trendValue)) && (
      <Row style={{ marginTop: Spacing.xs }} gap={Spacing.xs}>
        {trend && trendValue && (
          <T size="xs" color={trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textSecondary} weight="medium">
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendValue}
          </T>
        )}
        {subtitle && <T size="xs" color={colors.textTertiary}>{subtitle}</T>}
      </Row>
    )}
  </Card>
  );
};

// ─── Input ───────────────────────────────────────────────────────────────────

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Input = ({
  label, placeholder, value, onChangeText,
  secureTextEntry = false, keyboardType = 'default',
  multiline = false, numberOfLines = 1, icon, style,
}: InputProps) => {
  const { colors } = useTheme();
  return (
  <View style={[{ gap: Spacing.xs }, style]}>
    {label && <T size="sm" weight="medium" color={colors.textSecondary}>{label}</T>}
    <View style={{
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
      backgroundColor: colors.chip,
      borderRadius: Radius.lg,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: Spacing.md,
      paddingVertical: multiline ? Spacing.sm : 0,
      minHeight: multiline ? numberOfLines * 24 + Spacing.base : 44,
      gap: Spacing.sm,
    }}>
      {icon && <View style={{ paddingTop: multiline ? 2 : 0 }}>{icon}</View>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={{
          flex: 1,
          fontFamily: Typography.fontFamily.regular,
          fontSize: Typography.size.base,
          color: colors.textPrimary,
          paddingVertical: multiline ? 0 : 0,
        }}
      />
    </View>
  </View>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}

export const EmptyState = ({ icon, title, subtitle, action, onAction }: EmptyStateProps) => (
  <View style={{ alignItems: 'center', paddingVertical: Spacing['3xl'], gap: Spacing.md }}>
    {icon && <View style={{ opacity: 0.4 }}>{icon}</View>}
    <T size="md" weight="semibold" align="center">{title}</T>
    {subtitle && <T size="sm" align="center">{subtitle}</T>}
    {action && onAction && <Btn label={action} onPress={onAction} variant="outline" size="sm"/>}
  </View>
);

// ─── Status Pill ─────────────────────────────────────────────────────────────

interface StatusPillProps {
  label: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export const StatusPill = ({ label, type = 'neutral' }: StatusPillProps) => {
  const { colors } = useTheme();
  const palette = {
    success: { bg: colors.successLight, text: colors.success },
    warning: { bg: colors.warningLight, text: colors.warning },
    error: { bg: colors.errorLight, text: colors.error },
    info: { bg: colors.chip, text: colors.ai },
    neutral: { bg: colors.bgDark, text: colors.textSecondary },
  };
  const c = palette[type];
  return (
    <View style={{ paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full, backgroundColor: c.bg }}>
      <T size="xs" color={c.text} weight="semibold">{label}</T>
    </View>
  );
};

// ─── Tier Badge ──────────────────────────────────────────────────────────────

interface TierBadgeProps {
  tier: 0 | 1 | 2 | 3 | 4;
  compact?: boolean;
}

const tierLabels: Record<number, string> = {
  0: 'অফলাইন', 1: 'স্টার্টার', 2: 'গ্রোথ', 3: 'প্রো', 4: 'এন্টারপ্রাইজ',
};

export const TierBadge = ({ tier, compact = false }: TierBadgeProps) => {
  const { colors } = useTheme();
  return (
  <View style={{
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: colors.chip,
  }}>
    <T size="sm" color={colors.chipInk} weight="bold">
      {compact ? `👑 টায়ার ${tier}` : `👑 টায়ার ${tier} — ${tierLabels[tier]}`}
    </T>
  </View>
  );
};

// ─── Feature Lock ────────────────────────────────────────────────────────────

interface FeatureLockProps {
  requiredTier: number;
  currentTier: number;
  onUpgrade: () => void;
  children: React.ReactNode;
}

export const FeatureLock = ({ requiredTier, currentTier, onUpgrade, children }: FeatureLockProps) => {
  const { colors } = useTheme();
  const tierColors: Record<number, string> = {
    0: colors.tier0, 1: colors.tier1, 2: colors.tier2, 3: colors.tier3, 4: colors.tier4,
  };
  if (currentTier >= requiredTier) return <>{children}</>;
  return (
    <View style={{ opacity: 0.5, position: 'relative' }}>
      {children}
      <Pressable
        onPress={onUpgrade}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: colors.overlay,
          borderRadius: Radius.lg,
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.sm,
        }}
      >
        <T size="sm" color={colors.textInverse} weight="semibold" align="center">
          টায়ার {requiredTier} প্রয়োজন
        </T>
        <View style={{
          backgroundColor: tierColors[requiredTier],
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.xs,
          borderRadius: Radius.full,
        }}>
          <T size="xs" color={colors.textInverse} weight="bold">আপগ্রেড করুন</T>
        </View>
      </Pressable>
    </View>
  );
};

// ─── Screen Scroll ────────────────────────────────────────────────────────────

interface ScreenScrollProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentPadding?: boolean;
}

export const ScreenScroll = ({ children, style, contentPadding = true }: ScreenScrollProps) => {
  const insets = useSafeAreaInsets();
  const tabBarClearance = 68;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        contentPadding && {
          padding: Spacing.base,
          paddingBottom: tabBarClearance + insets.bottom + Spacing.lg,
        },
        style,
      ]}
    >
      <SlideIn>{children}</SlideIn>
    </ScrollView>
  );
};

// ─── AI Suggestion Card ───────────────────────────────────────────────────────

interface AISuggestionProps {
  title: string;
  message: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const AISuggestion = ({ title, message, onAction, actionLabel }: AISuggestionProps) => {
  const { colors } = useTheme();
  return (
  <View style={{
    backgroundColor: colors.aiBg,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.ai,
    marginBottom: Spacing.base,
    gap: Spacing.xs,
  }}>
    <Row gap={Spacing.sm} align="center" style={{ flexWrap: 'wrap' }}>
      <View style={{
        paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full,
        backgroundColor: colors.ai, alignItems: 'center', justifyContent: 'center',
      }}>
        <T size="xs" color="#ffffff" weight="bold">AI</T>
      </View>
      <T size="sm" weight="bold" color={colors.textPrimary}>{title}</T>
    </Row>
    <T size="sm" color={colors.textPrimary} style={{ opacity: 0.92 }}>{message}</T>
    {onAction && actionLabel && (
      <Pressable onPress={onAction}>
        <T size="sm" color={colors.ai} weight="bold">{actionLabel} →</T>
      </Pressable>
    )}
  </View>
  );
};
