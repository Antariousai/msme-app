import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useFeatureNav } from '../navigation/FeatureNavContext';
import { getHubFeatures, getAccessibleFeatures, TIER_GROUP_LABELS, FeatureDef } from '../navigation/features';
import { T, Card, Row, SectionHeader } from './atoms';
import { Colors, Spacing, Radius } from '../theme';
import { ChevronDownIcon, ChevronRightIcon } from '../icons';

interface FeatureToolsSectionProps {
  /** Show only features introduced below the user's current tier focus (default: all hub features) */
  defaultExpanded?: boolean;
  title?: string;
}

export const FeatureToolsSection = ({
  defaultExpanded = false,
  title = 'অন্যান্য সরঞ্জাম',
}: FeatureToolsSectionProps) => {
  const { user } = useAuth();
  const { openFeature } = useFeatureNav();
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!user) return null;

  const hubFeatures = getHubFeatures(user.tier);
  if (hubFeatures.length === 0) return null;

  const grouped = [0, 1, 2, 3, 4]
    .filter((t) => t <= user.tier)
    .map((tierLevel) => ({
      tierLevel,
      features: hubFeatures.filter((f) => f.introducedIn === tierLevel),
    }))
    .filter((g) => g.features.length > 0);

  return (
    <View style={{ marginBottom: Spacing.base }}>
      <Pressable onPress={() => setExpanded(!expanded)}>
        <Row justify="space-between" style={{ marginBottom: expanded ? Spacing.sm : 0 }}>
          <View>
            <T size="md" weight="bold">{title}</T>
            <T size="xs" color={Colors.textTertiary}>
              {hubFeatures.length}টি ফিচার · পূর্ববর্তী টায়ার সহ
            </T>
          </View>
          {expanded
            ? <ChevronDownIcon size={20} color={Colors.textTertiary} />
            : <ChevronRightIcon size={20} color={Colors.textTertiary} />}
        </Row>
      </Pressable>

      {expanded && grouped.map(({ tierLevel, features }) => (
        <View key={tierLevel} style={{ marginTop: Spacing.sm }}>
          <T size="xs" color={Colors.textTertiary} weight="semibold" style={{ marginBottom: Spacing.xs }}>
            {TIER_GROUP_LABELS[tierLevel as keyof typeof TIER_GROUP_LABELS]}
          </T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
            {features.map((f) => (
              <FeatureChip key={f.id} feature={f} onPress={() => openFeature(f.id)} />
            ))}
          </View>
        </View>
      ))}

      {!expanded && (
        <Row gap={Spacing.sm} style={{ marginTop: Spacing.sm, flexWrap: 'wrap' }}>
          {hubFeatures.slice(0, 4).map((f) => (
            <FeatureChip key={f.id} feature={f} onPress={() => openFeature(f.id)} compact />
          ))}
          {hubFeatures.length > 4 && (
            <Pressable onPress={() => setExpanded(true)}>
              <View style={{
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                borderRadius: Radius.full,
                backgroundColor: Colors.bgDark,
              }}>
                <T size="xs" color={Colors.primary} weight="semibold">+{hubFeatures.length - 4} আরও</T>
              </View>
            </Pressable>
          )}
        </Row>
      )}
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
  const Icon = feature.icon;
  return (
    <Pressable onPress={onPress}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: compact ? Spacing.md : Spacing.base,
        paddingVertical: compact ? Spacing.sm : Spacing.md,
        borderRadius: Radius.lg,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
      }}>
        <Icon size={compact ? 16 : 18} color={Colors.secondary} />
        <T size={compact ? 'xs' : 'sm'} weight="medium">{feature.label}</T>
      </View>
    </Pressable>
  );
};

/** Full feature list for More screen — all accessible features grouped by tier */
export const FeatureLauncherList = () => {
  const { user } = useAuth();
  const { openFeature, tabFeatureIds } = useFeatureNav();

  if (!user) return null;

  const grouped = [0, 1, 2, 3, 4]
    .filter((t) => t <= user.tier)
    .map((tierLevel) => ({
      tierLevel,
      features: getAccessibleFeatures(user.tier).filter((f) => f.introducedIn === tierLevel),
    }))
    .filter((g) => g.features.length > 0);

  return (
    <View>
      {grouped.map(({ tierLevel, features }: { tierLevel: number; features: FeatureDef[] }) => (
        <View key={tierLevel} style={{ marginBottom: Spacing.base }}>
          <SectionHeader title={TIER_GROUP_LABELS[tierLevel as keyof typeof TIER_GROUP_LABELS]} />
          {features.map((f) => {
            const inTab = tabFeatureIds.includes(f.id);
            const Icon = f.icon;
            return (
              <Card key={f.id} onPress={() => openFeature(f.id)} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
                <Row justify="space-between">
                  <Row gap={Spacing.sm}>
                    <Icon size={20} color={Colors.secondary} />
                    <View>
                      <T size="sm" weight="semibold">{f.label}</T>
                      <T size="xs" color={Colors.textTertiary}>{f.subtitle}</T>
                    </View>
                  </Row>
                  <T size="xs" color={inTab ? Colors.accent : Colors.textTertiary}>
                    {inTab ? 'ট্যাব + এখানে' : 'খুলুন'}
                  </T>
                </Row>
              </Card>
            );
          })}
        </View>
      ))}
    </View>
  );
};
