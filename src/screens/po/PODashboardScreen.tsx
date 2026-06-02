import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, Chip, AISuggestion } from '../../components/atoms';
import { ScreenFrame } from '../../components/ScreenFrame';
import { HeroCard } from '../../components/HeroCard';
import { Spacing, Radius } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../auth/AuthContext';
import { seedBeneficiaries, Beneficiary } from '../../data/beneficiaries';
import { creditScoreColor } from '../../utils/creditScore';
import { toBn } from '../../utils/helpers';
import { EmojiIcon } from '../../icons/emoji';

type FilterKey = 'all' | 'strong' | 'watch' | 'risk';

interface PODashboardScreenProps {
  onOpenBeneficiary: (id: string) => void;
}

const BeneficiaryRow = ({
  b,
  onPress,
}: {
  b: Beneficiary;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  const color = creditScoreColor(b.score);

  return (
    <Card onPress={onPress} style={{ marginBottom: Spacing.sm }} padding={Spacing.md} effect="slideX">
      <Row justify="space-between" align="center" fill>
        <Row gap={Spacing.sm} style={{ flex: 1, minWidth: 0 }}>
          <View style={[styles.scoreRing, { borderColor: color }]}>
            <T size="sm" weight="bold" color={color}>{toBn(b.score)}</T>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <T size="sm" weight="semibold" numberOfLines={1}>{b.businessName}</T>
            <T size="xs" color={colors.textTertiary} numberOfLines={1}>{b.name}</T>
            <T size="xs" color={colors.textSecondary} numberOfLines={1} style={{ marginTop: 2 }}>
              📍 {b.location}
            </T>
          </View>
        </Row>
        <T size="sm" color={colors.textTertiary} style={{ flexShrink: 0, marginLeft: Spacing.sm }}>খুলুন</T>
      </Row>
    </Card>
  );
};

export const PODashboardScreen = ({ onOpenBeneficiary }: PODashboardScreenProps) => {
  const { signOut } = useAuth();
  const { colors } = useTheme();
  const [filter, setFilter] = useState<FilterKey>('all');

  const summary = useMemo(() => {
    const list = seedBeneficiaries;
    const avg = Math.round(list.reduce((s, b) => s + b.score, 0) / list.length);
    const atRisk = list.filter((b) => b.score < 60).length;
    const strong = list.filter((b) => b.score >= 80).length;
    return { total: list.length, avg, atRisk, strong };
  }, []);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'strong':
        return seedBeneficiaries.filter((b) => b.score >= 80);
      case 'watch':
        return seedBeneficiaries.filter((b) => b.score >= 60 && b.score < 80);
      case 'risk':
        return seedBeneficiaries.filter((b) => b.score < 60);
      default:
        return seedBeneficiaries;
    }
  }, [filter]);

  const topInsight = useMemo(() => {
    const atRisk = seedBeneficiaries.filter((b) => b.score < 60);
    if (atRisk.length > 0) {
      return `${atRisk[0].businessName} — স্কোর ${toBn(atRisk[0].score)}। আজ ফলো-আপ করলে উন্নতি সম্ভব।`;
    }
    const best = [...seedBeneficiaries].sort((a, b) => b.score - a.score)[0];
    return `${best.businessName} সবচেয়ে শক্তিশালী (স্কোর ${toBn(best.score)}) — মডেল হিসেবে দেখান।`;
  }, []);

  return (
    <ScreenFrame>
      <AppHeader showGreeting />
      <ScreenScroll>
        <HeroCard
          title="📊 PO ড্যাশবোর্ড"
          metric={toBn(summary.total)}
          metricLabel="মোট উপকারভোগী"
          stats={[
            { label: 'গড় স্কোর', value: toBn(summary.avg) },
            { label: 'শক্তিশালী', value: toBn(summary.strong) },
            { label: 'ঝুঁকিতে', value: toBn(summary.atRisk) },
          ]}
        />

        <AISuggestion
          title="💡 আজকের PO পরামর্শ"
          message={topInsight}
          actionLabel="তালিকা দেখুন"
        />

        <Row gap={Spacing.sm} wrap style={{ marginBottom: Spacing.base }}>
          <Chip label="সব" active={filter === 'all'} onPress={() => setFilter('all')} />
          <Chip label="৮০+" active={filter === 'strong'} onPress={() => setFilter('strong')} />
          <Chip label="পর্যবেক্ষণ" active={filter === 'watch'} onPress={() => setFilter('watch')} />
          <Chip label="ঝুঁকি" active={filter === 'risk'} onPress={() => setFilter('risk')} />
        </Row>

        <SectionHeader title="🏦 উপকারভোগী তালিকা" />

        {filtered.length === 0 ? (
          <T size="sm" color={colors.textTertiary}>এই ফিল্টারে কেউ নেই</T>
        ) : (
          filtered.map((b) => (
            <BeneficiaryRow key={b.id} b={b} onPress={() => onOpenBeneficiary(b.id)} />
          ))
        )}

        <Card onPress={signOut} style={{ marginTop: Spacing.base }} padding={Spacing.md}>
          <Row justify="space-between" align="center" fill>
            <Row gap={Spacing.md} style={{ flex: 1, minWidth: 0 }}>
              <EmojiIcon emoji="🚪" size={22} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <T size="sm" weight="bold">সাইন আউট</T>
                <T size="xs" color={colors.textTertiary}>PO পোর্টাল থেকে প্রস্থান</T>
              </View>
            </Row>
            <T size="sm" color={colors.textTertiary}>›</T>
          </Row>
        </Card>

        <T size="xs" color={colors.textTertiary} align="center" style={{ marginTop: Spacing.lg, marginBottom: Spacing.sm }}>
          Antarious MSME · PO পোর্টাল
        </T>
      </ScreenScroll>
    </ScreenFrame>
  );
};

const styles = StyleSheet.create({
  scoreRing: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
