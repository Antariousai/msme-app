import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useFeatureNav } from '../navigation/FeatureNavContext';
import {
  getFeaturesByCategory,
  getHubFeaturesByCategory,
  FEATURE_CATEGORY_META,
  FeatureDef,
  FeatureCategory,
} from '../navigation/features';
import { T, Card, Row } from './atoms';
import { Spacing, Radius, Shadow } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { EmojiIcon, CATEGORY_EMOJI } from '../icons/emoji';
import { RipplePressable } from './motion';

interface FeatureToolsSectionProps {
  defaultExpanded?: boolean;
  title?: string;
  /** Grid tiles (home) vs chip list (hub collapsed) */
  layout?: 'grid' | 'chips';
  /** all accessible features vs hub-only */
  scope?: 'all' | 'hub';
}

export const FeatureToolsSection = ({
  defaultExpanded = true,
  title,
  layout = 'grid',
  scope = 'all',
}: FeatureToolsSectionProps) => {
  const { user } = useAuth();
  const { openFeature } = useFeatureNav();
  const { colors } = useTheme();

  if (!user) return null;

  const grouped = scope === 'all'
    ? getFeaturesByCategory(user.tier)
    : getHubFeaturesByCategory(user.tier);

  if (grouped.length === 0) return null;

  if (layout === 'grid') {
    return (
      <View style={{ marginTop: Spacing.sm }}>
        {title && (
          <T size="md" weight="bold" style={{ marginBottom: Spacing.sm }}>{title}</T>
        )}
        {grouped.map(({ category, features }) => (
          <CategoryGrid
            key={category}
            category={category}
            features={features}
            onOpen={openFeature}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={{ marginBottom: Spacing.base }}>
      {title && <T size="md" weight="bold" style={{ marginBottom: Spacing.sm }}>{title}</T>}
      {grouped.map(({ category, features }) => (
        <View key={category} style={{ marginTop: Spacing.sm }}>
          <T size="xs" color={colors.textSecondary} weight="semibold">{FEATURE_CATEGORY_META[category].title}</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.xs }}>
            {features.map((f) => (
              <FeatureChip key={f.id} feature={f} onPress={() => openFeature(f.id)} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const CategoryGrid = ({
  category,
  features,
  onOpen,
}: {
  category: FeatureCategory;
  features: FeatureDef[];
  onOpen: (id: FeatureDef['id']) => void;
}) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const pad = Spacing.base * 2;
  const gap = Spacing.sm;
  const cols = 3;
  const tileW = (width - pad - gap * (cols - 1)) / cols;
  const meta = FEATURE_CATEGORY_META[category];

  return (
    <View style={{ marginBottom: Spacing.lg }}>
      <Row gap={Spacing.sm} align="center" style={{ marginBottom: Spacing.xs }}>
        <EmojiIcon emoji={CATEGORY_EMOJI[category]} size={20} />
        <T size="md" weight="bold">{meta.title}</T>
      </Row>
      <T size="xs" color={colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
        {meta.description}
      </T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
        {features.map((f) => (
          <RipplePressable
            key={f.id}
            onPress={() => onOpen(f.id)}
            style={{
              width: tileW,
              backgroundColor: colors.surface,
              borderRadius: Radius.lg,
              paddingVertical: Spacing.md,
              paddingHorizontal: Spacing.xs,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.borderLight,
              ...Shadow.sm,
            }}
          >
            <EmojiIcon emoji={f.emoji} size={28} />
            <T size="xs" weight="semibold" align="center" style={{ marginTop: Spacing.xs }} numberOfLines={2}>
              {f.label}
            </T>
          </RipplePressable>
        ))}
      </View>
    </View>
  );
};

const FeatureChip = ({
  feature,
  onPress,
}: {
  feature: FeatureDef;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <RipplePressable onPress={onPress}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}>
        <EmojiIcon emoji={feature.emoji} size={16} />
        <T size="xs" weight="medium">{feature.label}</T>
      </View>
    </RipplePressable>
  );
};

/** Full feature list for More screen — grouped by business need */
export const FeatureLauncherList = () => {
  const { user } = useAuth();
  const { openFeature, tabFeatureIds } = useFeatureNav();
  const { colors } = useTheme();

  if (!user) return null;

  const grouped = getFeaturesByCategory(user.tier);

  return (
    <View>
      {grouped.map(({ category, features }) => {
        const meta = FEATURE_CATEGORY_META[category];
        return (
          <View key={category} style={{ marginBottom: Spacing.base }}>
            <Row gap={Spacing.sm} align="center" style={{ marginBottom: Spacing.xs }}>
              <EmojiIcon emoji={CATEGORY_EMOJI[category]} size={18} />
              <T size="md" weight="bold">{meta.title}</T>
            </Row>
            <T size="xs" color={colors.textTertiary} style={{ marginBottom: Spacing.sm, marginTop: -Spacing.xs }}>
              {meta.description}
            </T>
            {features.map((f) => {
              const inTab = tabFeatureIds.includes(f.id);
              return (
                <Card key={f.id} onPress={() => openFeature(f.id)} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
                  <Row justify="space-between" align="center" fill>
                    <Row gap={Spacing.sm} style={{ flex: 1, minWidth: 0 }}>
                      <EmojiIcon emoji={f.emoji} size={22} />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <T size="sm" weight="semibold" numberOfLines={1}>{f.label}</T>
                        <T size="xs" color={colors.textTertiary} numberOfLines={2}>{f.subtitle}</T>
                      </View>
                    </Row>
                    <T size="xs" color={inTab ? colors.accent : colors.textTertiary} style={{ flexShrink: 0, marginLeft: Spacing.sm }}>
                      {inTab ? 'ট্যাব' : 'খুলুন'}
                    </T>
                  </Row>
                </Card>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};
