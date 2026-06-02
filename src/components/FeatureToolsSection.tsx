import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useFeatureNav } from '../navigation/FeatureNavContext';
import {
  getHubFeatures,
  getHubFeaturesByCategory,
  getFeaturesByCategory,
  FEATURE_CATEGORY_META,
  FeatureDef,
  FeatureCategory,
} from '../navigation/features';
import { T, Card, Row, SectionHeader } from './atoms';
import { Spacing, Radius } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { EmojiIcon } from '../icons/emoji';
import { ChevronDownIcon, ChevronRightIcon } from '../icons';
import { RipplePressable } from './motion';

interface FeatureToolsSectionProps {
  defaultExpanded?: boolean;
  title?: string;
}

export const FeatureToolsSection = ({
  defaultExpanded = false,
  title = 'অন্যান্য সরঞ্জাম',
}: FeatureToolsSectionProps) => {
  const { user } = useAuth();
  const { openFeature } = useFeatureNav();
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!user) return null;

  const hubFeatures = getHubFeatures(user.tier);
  if (hubFeatures.length === 0) return null;

  const grouped = getHubFeaturesByCategory(user.tier);

  return (
    <View style={{ marginBottom: Spacing.base }}>
      <Pressable onPress={() => setExpanded(!expanded)}>
        <Row justify="space-between" style={{ marginBottom: expanded ? Spacing.sm : 0 }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <T size="md" weight="bold">{title}</T>
            <T size="xs" color={colors.textTertiary}>
              {hubFeatures.length}টি সরঞ্জাম · ব্যবসার প্রয়োজন অনুযায়ী
            </T>
          </View>
          {expanded
            ? <ChevronDownIcon size={20} color={colors.textTertiary} />
            : <ChevronRightIcon size={20} color={colors.textTertiary} />}
        </Row>
      </Pressable>

      {expanded && grouped.map(({ category, features }) => (
        <CategoryGroup
          key={category}
          category={category}
          features={features}
          onOpen={openFeature}
          compact
        />
      ))}

      {!expanded && (
        <Row gap={Spacing.sm} wrap style={{ marginTop: Spacing.sm }}>
          {hubFeatures.slice(0, 4).map((f) => (
            <FeatureChip key={f.id} feature={f} onPress={() => openFeature(f.id)} compact />
          ))}
          {hubFeatures.length > 4 && (
            <Pressable onPress={() => setExpanded(true)}>
              <View style={{
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                borderRadius: Radius.full,
                backgroundColor: colors.bgDark,
              }}>
                <T size="xs" color={colors.primary} weight="semibold">+{hubFeatures.length - 4} আরও</T>
              </View>
            </Pressable>
          )}
        </Row>
      )}
    </View>
  );
};

const CategoryGroup = ({
  category,
  features,
  onOpen,
  compact = false,
}: {
  category: FeatureCategory;
  features: FeatureDef[];
  onOpen: (id: FeatureDef['id']) => void;
  compact?: boolean;
}) => {
  const { colors } = useTheme();
  const meta = FEATURE_CATEGORY_META[category];
  return (
    <View style={{ marginTop: Spacing.sm }}>
      <T size="xs" color={colors.textSecondary} weight="semibold" style={{ marginBottom: 2 }}>
        {meta.title}
      </T>
      <T size="xs" color={colors.textTertiary} style={{ marginBottom: Spacing.xs }}>
        {meta.description}
      </T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
        {features.map((f) => (
          <FeatureChip key={f.id} feature={f} onPress={() => onOpen(f.id)} compact={compact} />
        ))}
      </View>
    </View>
  );
};

const FeatureChip = ({
  feature,
  onPress,
  compact = false,
}: {
  feature: FeatureDef;
  onPress: () => void;
  compact?: boolean;
}) => {
  const { colors } = useTheme();
  return (
    <RipplePressable onPress={onPress}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: compact ? Spacing.md : Spacing.base,
        paddingVertical: compact ? Spacing.sm : Spacing.md,
        borderRadius: Radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}>
        <EmojiIcon emoji={feature.emoji} size={compact ? 16 : 18} />
        <T size={compact ? 'xs' : 'sm'} weight="medium">{feature.label}</T>
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
            <SectionHeader title={meta.title} />
            <T size="xs" color={colors.textTertiary} style={{ marginBottom: Spacing.sm, marginTop: -Spacing.xs }}>
              {meta.description}
            </T>
            {features.map((f) => {
              const inTab = tabFeatureIds.includes(f.id);
              return (
                <Card key={f.id} onPress={() => openFeature(f.id)} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
                  <Row justify="space-between" align="center" fill>
                    <Row gap={Spacing.sm} style={{ flex: 1, minWidth: 0 }}>
                      <EmojiIcon emoji={f.emoji} size={20} />
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
