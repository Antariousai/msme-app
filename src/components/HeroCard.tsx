import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { T, Row } from './atoms';
import { Spin } from './motion';
import { Gradients, Spacing, Radius, Shadow, Typography } from '../theme';

interface HeroStat {
  label: string;
  value: string;
}

interface HeroCardProps {
  /** Small label above the metric, e.g. "📊 এন্টারপ্রাইজ ড্যাশবোর্ড" */
  title: string;
  metric: string;
  metricLabel: string;
  stats?: HeroStat[];
  /** Optional override gradient (e.g. income hero) */
  colors?: readonly string[];
  sparkle?: string;
  style?: StyleProp<ViewStyle>;
}

/** Gradient hero card — matches Antarious studio `.hero` */
export const HeroCard = ({
  title,
  metric,
  metricLabel,
  stats = [],
  colors,
  sparkle = '✨',
  style,
}: HeroCardProps) => (
  <LinearGradient
    colors={(colors ?? Gradients.hero) as [string, string, ...string[]]}
    locations={colors ? undefined : [...Gradients.heroLocations]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[{
      borderRadius: Radius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.base,
      overflow: 'hidden',
      ...Shadow.soft,
    }, style]}
  >
    <View style={{ position: 'absolute', top: 14, right: 18 }}>
      <Spin>
        <T size="lg" style={{ opacity: 0.55 }}>{sparkle}</T>
      </Spin>
    </View>

    <T size="sm" weight="semibold" color="#ffffff" style={{ opacity: 0.92 }}>{title}</T>
    <T color="#ffffff" weight="bold" style={{ fontSize: Typography.size['4xl'], marginVertical: 2 }}>
      {metric}
    </T>
    <T size="sm" weight="semibold" color="#ffffff" style={{ opacity: 0.92 }}>{metricLabel}</T>

    {stats.length > 0 && (
      <Row gap={Spacing.xl} style={{ marginTop: Spacing.md }}>
        {stats.map((s) => (
          <View key={s.label}>
            <T size="xs" color="#ffffff" style={{ opacity: 0.85 }}>{s.label}</T>
            <T size="lg" weight="bold" color="#ffffff">{s.value}</T>
          </View>
        ))}
      </Row>
    )}
  </LinearGradient>
);
