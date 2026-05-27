import React from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ActivityIndicator, ScrollView, TextInput, Pressable, StyleProp,
} from 'react-native';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';

// ─── Text ────────────────────────────────────────────────────────────────────

interface TProps {
  children: React.ReactNode;
  size?: keyof typeof Typography.size;
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
  numberOfLines?: number;
}

export const T = ({
  children, size = 'base', color = Colors.textPrimary,
  weight = 'regular', align = 'left', style, numberOfLines,
}: TProps) => {
  const fontWeightMap = { regular: '400', medium: '500', semibold: '600', bold: '700' };
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{
        fontSize: Typography.size[size],
        color,
        fontWeight: fontWeightMap[weight] as TextStyle['fontWeight'],
        textAlign: align,
        lineHeight: Typography.size[size] * 1.5,
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

export const Card = ({ children, style, onPress, elevated = false, padding = Spacing.base }: CardProps) => {
  const baseStyle: ViewStyle = {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding,
    ...(elevated ? Shadow.md : Shadow.sm),
  };
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [baseStyle, pressed && { opacity: 0.85 }, style]}>
        {children}
      </Pressable>
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
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Btn = ({
  label, onPress, variant = 'primary', size = 'md',
  fullWidth = false, loading = false, disabled = false, icon, style,
}: BtnProps) => {
  const heights = { sm: 36, md: 46, lg: 54 };
  const fontSizes = { sm: Typography.size.sm, md: Typography.size.base, lg: Typography.size.md };

  const variantStyles: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: Colors.primary, text: Colors.textInverse },
    secondary: { bg: Colors.secondary, text: Colors.textInverse },
    outline: { bg: 'transparent', text: Colors.primary, border: Colors.primary },
    ghost: { bg: Colors.bgDark, text: Colors.textPrimary },
    danger: { bg: Colors.error, text: Colors.textInverse },
  };

  const vs = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [{
        height: heights[size],
        paddingHorizontal: size === 'sm' ? Spacing.md : Spacing.xl,
        borderRadius: Radius.md,
        backgroundColor: vs.bg,
        borderWidth: vs.border ? 1.5 : 0,
        borderColor: vs.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        ...(fullWidth && { width: '100%' }),
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
      }, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vs.text}/>
      ) : (
        <>
          {icon}
          <T size={size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'base'} color={vs.text} weight="semibold">
            {label}
          </T>
        </>
      )}
    </Pressable>
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

export const Chip = ({ label, color, bg, onPress, active = false }: ChipProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [{
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: Radius.full,
      backgroundColor: active ? (bg ?? Colors.primary) : Colors.bgDark,
      opacity: pressed ? 0.8 : 1,
    }]}
  >
    <T size="sm" color={active ? (color ?? Colors.textInverse) : Colors.textSecondary} weight="medium">
      {label}
    </T>
  </Pressable>
);

// ─── Row ─────────────────────────────────────────────────────────────────────

interface RowProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
}

export const Row = ({ children, style, gap = Spacing.sm, align = 'center', justify = 'flex-start' }: RowProps) => (
  <View style={[{ flexDirection: 'row', alignItems: align, justifyContent: justify, gap }, style]}>
    {children}
  </View>
);

// ─── Divider ─────────────────────────────────────────────────────────────────

export const Divider = ({ style }: { style?: ViewStyle }) => (
  <View style={[{ height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm }, style]}/>
);

// ─── Badge ───────────────────────────────────────────────────────────────────

interface BadgeProps {
  count?: number;
  color?: string;
  size?: number;
}

export const Badge = ({ count, color = Colors.error, size = 18 }: BadgeProps) => {
  if (!count || count === 0) return null;
  return (
    <View style={{
      backgroundColor: color,
      borderRadius: Radius.full,
      minWidth: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    }}>
      <T size="xs" color={Colors.textInverse} weight="bold">{count > 99 ? '99+' : String(count)}</T>
    </View>
  );
};

// ─── Section Header ──────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader = ({ title, action, onAction }: SectionHeaderProps) => (
  <Row justify="space-between" style={{ marginBottom: Spacing.sm }}>
    <T size="md" weight="bold">{title}</T>
    {action && onAction && (
      <Pressable onPress={onAction}>
        <T size="sm" color={Colors.primary} weight="medium">{action}</T>
      </Pressable>
    )}
  </Row>
);

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
  label, value, subtitle, color = Colors.primary, icon, trend, trendValue, style,
}: StatCardProps) => (
  <Card style={[{ flex: 1 }, style]}>
    <Row justify="space-between" align="flex-start" style={{ marginBottom: Spacing.sm }}>
      <T size="sm" color={Colors.textSecondary}>{label}</T>
      {icon && <View style={{ opacity: 0.7 }}>{icon}</View>}
    </Row>
    <T size="2xl" weight="bold" color={color}>{value}</T>
    {(subtitle || (trend && trendValue)) && (
      <Row style={{ marginTop: Spacing.xs }} gap={Spacing.xs}>
        {trend && trendValue && (
          <T size="xs" color={trend === 'up' ? Colors.success : trend === 'down' ? Colors.error : Colors.textSecondary} weight="medium">
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendValue}
          </T>
        )}
        {subtitle && <T size="xs" color={Colors.textTertiary}>{subtitle}</T>}
      </Row>
    )}
  </Card>
);

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
}: InputProps) => (
  <View style={[{ gap: Spacing.xs }, style]}>
    {label && <T size="sm" weight="medium" color={Colors.textSecondary}>{label}</T>}
    <View style={{
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
      backgroundColor: Colors.bgDark,
      borderRadius: Radius.md,
      borderWidth: 1.5,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.md,
      paddingVertical: multiline ? Spacing.sm : 0,
      minHeight: multiline ? numberOfLines * 24 + Spacing.base : 48,
      gap: Spacing.sm,
    }}>
      {icon && <View style={{ paddingTop: multiline ? 2 : 0 }}>{icon}</View>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={{
          flex: 1,
          fontSize: Typography.size.base,
          color: Colors.textPrimary,
          paddingVertical: multiline ? 0 : 0,
        }}
      />
    </View>
  </View>
);

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
    <T size="md" weight="semibold" color={Colors.textSecondary} align="center">{title}</T>
    {subtitle && <T size="sm" color={Colors.textTertiary} align="center">{subtitle}</T>}
    {action && onAction && <Btn label={action} onPress={onAction} variant="outline" size="sm"/>}
  </View>
);

// ─── Status Pill ─────────────────────────────────────────────────────────────

interface StatusPillProps {
  label: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export const StatusPill = ({ label, type = 'neutral' }: StatusPillProps) => {
  const colors = {
    success: { bg: Colors.successLight, text: Colors.success },
    warning: { bg: Colors.warningLight, text: Colors.warning },
    error: { bg: Colors.errorLight, text: Colors.error },
    info: { bg: '#E0F2FE', text: Colors.accent },
    neutral: { bg: Colors.bgDark, text: Colors.textSecondary },
  };
  const c = colors[type];
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

const tierColors: Record<number, string> = {
  0: Colors.tier0, 1: Colors.tier1, 2: Colors.tier2, 3: Colors.tier3, 4: Colors.tier4,
};

export const TierBadge = ({ tier, compact = false }: TierBadgeProps) => (
  <View style={{
    paddingHorizontal: compact ? Spacing.sm : Spacing.md,
    paddingVertical: compact ? 2 : Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: tierColors[tier] + '22',
    borderWidth: 1,
    borderColor: tierColors[tier] + '44',
  }}>
    <T size="xs" color={tierColors[tier]} weight="bold">
      {compact ? `T${tier}` : `টায়ার ${tier} — ${tierLabels[tier]}`}
    </T>
  </View>
);

// ─── Feature Lock ────────────────────────────────────────────────────────────

interface FeatureLockProps {
  requiredTier: number;
  currentTier: number;
  onUpgrade: () => void;
  children: React.ReactNode;
}

export const FeatureLock = ({ requiredTier, currentTier, onUpgrade, children }: FeatureLockProps) => {
  if (currentTier >= requiredTier) return <>{children}</>;
  return (
    <View style={{ opacity: 0.5, position: 'relative' }}>
      {children}
      <Pressable
        onPress={onUpgrade}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: Colors.overlay,
          borderRadius: Radius.lg,
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.sm,
        }}
      >
        <T size="sm" color={Colors.textInverse} weight="semibold" align="center">
          টায়ার {requiredTier} প্রয়োজন
        </T>
        <View style={{
          backgroundColor: tierColors[requiredTier],
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.xs,
          borderRadius: Radius.full,
        }}>
          <T size="xs" color={Colors.textInverse} weight="bold">আপগ্রেড করুন</T>
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

export const ScreenScroll = ({ children, style, contentPadding = true }: ScreenScrollProps) => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={[
      contentPadding && { padding: Spacing.base, paddingBottom: Spacing['4xl'] },
      style,
    ]}
  >
    {children}
  </ScrollView>
);

// ─── AI Suggestion Card ───────────────────────────────────────────────────────

interface AISuggestionProps {
  title: string;
  message: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const AISuggestion = ({ title, message, onAction, actionLabel }: AISuggestionProps) => (
  <View style={{
    backgroundColor: Colors.accent + '12',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    gap: Spacing.xs,
  }}>
    <Row gap={Spacing.xs}>
      <View style={{
        width: 20, height: 20, borderRadius: Radius.full,
        backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
      }}>
        <T size="xs" color={Colors.textInverse} weight="bold">AI</T>
      </View>
      <T size="sm" weight="semibold" color={Colors.accent}>{title}</T>
    </Row>
    <T size="sm" color={Colors.textSecondary}>{message}</T>
    {onAction && actionLabel && (
      <Pressable onPress={onAction}>
        <T size="sm" color={Colors.accent} weight="semibold">{actionLabel} →</T>
      </Pressable>
    )}
  </View>
);
