import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
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
    <View style={styles.sparkleWrap}>
      <Spin>
        <T size="lg" style={{ opacity: 0.55 }}>{sparkle}</T>
      </Spin>
    </View>

    <View style={styles.content}>
      <T size="sm" weight="semibold" color="#ffffff" style={styles.title} numberOfLines={2}>
        {title}
      </T>
      <T
        color="#ffffff"
        weight="bold"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.55}
        style={styles.metric}
      >
        {metric}
      </T>
      <T size="sm" weight="semibold" color="#ffffff" style={styles.metricLabel} numberOfLines={1}>
        {metricLabel}
      </T>

      {stats.length > 0 && (
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCell}>
              <T size="xs" color="#ffffff" style={styles.statLabel} numberOfLines={1}>
                {s.label}
              </T>
              <T
                size="md"
                weight="bold"
                color="#ffffff"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                style={styles.statValue}
              >
                {s.value}
              </T>
            </View>
          ))}
        </View>
      )}
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  sparkleWrap: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.base,
    zIndex: 1,
  },
  content: {
    paddingRight: Spacing['3xl'],
  },
  title: {
    opacity: 0.92,
  },
  metric: {
    fontSize: Typography.size['4xl'],
    lineHeight: Typography.size['4xl'] * 1.15,
    marginTop: Spacing.xs,
    marginBottom: 2,
  },
  metricLabel: {
    opacity: 0.92,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
    width: '100%',
  },
  statCell: {
    flex: 1,
    minWidth: 0,
  },
  statLabel: {
    opacity: 0.85,
    marginBottom: 2,
  },
  statValue: {
    lineHeight: 22,
  },
});
