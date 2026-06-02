import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { T, Row } from './atoms';
import { Gradients, Spacing, Radius, Shadow } from '../theme';

interface HeroStat {
  label: string;
  value: string;
  emoji?: string;
}

interface HeroCardProps {
  title: string;
  titleEmoji?: string;
  metric: string;
  metricLabel: string;
  stats?: HeroStat[];
  style?: StyleProp<ViewStyle>;
}

/** Gradient hero card — matches Antarious home dashboard */
export const HeroCard = ({
  title,
  titleEmoji = '📊',
  metric,
  metricLabel,
  stats = [],
  style,
}: HeroCardProps) => (
  <LinearGradient
    colors={[...Gradients.hero]}
    locations={[...Gradients.heroLocations]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[{
      borderRadius: Radius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.base,
      ...Shadow.md,
    }, style]}
  >
    <Row justify="space-between" align="center" style={{ marginBottom: Spacing.md }}>
      <Row gap={Spacing.sm}>
        <T size="md">{titleEmoji}</T>
        <T size="sm" weight="semibold" color="#ffffff">{title}</T>
      </Row>
      <T size="md">✨</T>
    </Row>

    <T size="4xl" weight="bold" color="#ffffff" align="center" style={{ marginBottom: Spacing.xs }}>
      {metric}
    </T>
    <T size="sm" color="rgba(255,255,255,0.92)" align="center" style={{ marginBottom: stats.length ? Spacing.lg : 0 }}>
      {metricLabel}
    </T>

    {stats.length > 0 && (
      <View style={{
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: Radius.md,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
      }}>
        {stats.map((s, i) => (
          <View key={s.label} style={{ flex: 1, alignItems: 'center' }}>
            <T size="xs" color="rgba(255,255,255,0.85)" align="center">{s.label}</T>
            <T size="lg" weight="bold" color="#ffffff" align="center">
              {s.value}{s.emoji ? ` ${s.emoji}` : ''}
            </T>
          </View>
        ))}
      </View>
    )}
  </LinearGradient>
);
