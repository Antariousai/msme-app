import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import {
  T,
  Card,
  Row,
  ScreenScroll,
  SectionHeader,
  Btn,
  AISuggestion,
  StatCard,
  TierBadge,
} from '../../components/atoms';
import { ScreenFrame } from '../../components/ScreenFrame';
import { HeroCard } from '../../components/HeroCard';
import { Colors, Spacing } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { getBeneficiaryById } from '../../data/beneficiaries';
import { buildBeneficiaryAnalyticsProfile, buildBeneficiaryReport } from '../../utils/beneficiaryReport';
import { creditScoreColor, CreditFactor } from '../../utils/creditScore';
import { bnTaka, calcProfit, toBn } from '../../utils/helpers';
import { shareReport } from '../../utils/report';
import { DownloadIcon } from '../../icons';

interface BeneficiaryDetailScreenProps {
  beneficiaryId: string;
  onBack: () => void;
}

const FactorRow = ({ factor }: { factor: CreditFactor }) => {
  const { colors } = useTheme();
  const barColor = creditScoreColor(factor.points);

  return (
    <Card style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
      <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
        <Row gap={Spacing.sm}>
          <T size="lg">{factor.emoji}</T>
          <T size="sm" weight="semibold">{factor.label}</T>
        </Row>
        <T size="sm" weight="bold" color={barColor}>{toBn(factor.points)}</T>
      </Row>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${factor.points}%`, backgroundColor: barColor }]} />
      </View>
      <T size="xs" color={colors.textSecondary} style={{ marginTop: Spacing.xs }}>{factor.detail}</T>
      {factor.tip ? (
        <T size="xs" color={Colors.warning} style={{ marginTop: 4 }}>💡 {factor.tip}</T>
      ) : null}
    </Card>
  );
};

export const BeneficiaryDetailScreen = ({ beneficiaryId, onBack }: BeneficiaryDetailScreenProps) => {
  const { colors } = useTheme();
  const [exporting, setExporting] = useState(false);

  const beneficiary = getBeneficiaryById(beneficiaryId);
  const profile = useMemo(
    () => (beneficiary ? buildBeneficiaryAnalyticsProfile(beneficiary) : null),
    [beneficiary],
  );

  if (!beneficiary || !profile) {
    return (
      <ScreenFrame>
        <AppHeader title="উপকারভোগী" showGreeting={false} />
        <T align="center" color={colors.textSecondary} style={{ padding: Spacing.xl }}>
          তথ্য পাওয়া যায়নি
        </T>
        <Btn label="ফিরে যান" onPress={onBack} variant="outline" fullWidth style={{ margin: Spacing.base }} />
      </ScreenFrame>
    );
  }

  const profit = calcProfit(beneficiary.monthlyIncome, beneficiary.monthlyExpense);

  const downloadReport = async () => {
    setExporting(true);
    try {
      const content = buildBeneficiaryReport(beneficiary, profile);
      await shareReport(`beneficiary-${beneficiary.id}`, content);
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScreenFrame>
      <AppHeader
        title={beneficiary.businessName}
        subtitle={beneficiary.name}
        showGreeting={false}
      />
      <ScreenScroll>
        <Pressable onPress={onBack} style={{ marginBottom: Spacing.sm }}>
          <T size="sm" color={colors.primary}>‹ PO ড্যাশবোর্ড</T>
        </Pressable>

        <HeroCard
          sparkle="🏦"
          title="ক্রেডিট স্কোর"
          metric={toBn(profile.score)}
          metricLabel={`${profile.gradeEmoji} ${profile.gradeLabel} · / ১০০`}
          stats={[
            { label: 'মাসিক আয়', value: bnTaka(beneficiary.monthlyIncome) },
            { label: 'মোট লাভ', value: bnTaka(profit) },
            { label: 'অর্ডার', value: toBn(beneficiary.orderCount) },
          ]}
        />

        <View style={{ marginBottom: Spacing.base }}>
          <TierBadge tier={beneficiary.tier} />
        </View>

        <Row gap={Spacing.sm} style={{ marginBottom: Spacing.base }}>
          <StatCard label="লিড" value={toBn(beneficiary.leadCount)} color={colors.primary} />
          <StatCard
            label="অভিযোগ"
            value={toBn(beneficiary.openComplaints)}
            color={beneficiary.openComplaints > 0 ? Colors.warning : Colors.success}
          />
        </Row>

        <Card style={{ marginBottom: Spacing.base, backgroundColor: colors.chip }}>
          <T size="sm" weight="bold" style={{ marginBottom: Spacing.xs }}>📍 ঠিকানা</T>
          <T size="sm" color={colors.textSecondary}>{beneficiary.location}</T>
          <T size="xs" color={colors.textTertiary} style={{ marginTop: Spacing.sm }}>{beneficiary.phone}</T>
        </Card>

        <AISuggestion
          title="💡 PO ইনসাইট"
          message={beneficiary.insight}
        />

        <SectionHeader title="স্কোর উপাদান" />
        {profile.factors.map((f) => (
          <FactorRow key={f.id} factor={f} />
        ))}

        <Card style={{ marginTop: Spacing.sm, marginBottom: Spacing.base }}>
          <T size="sm" weight="bold" style={{ marginBottom: Spacing.sm }}>📄 রিপোর্ট ডাউনলোড</T>
          <T size="xs" color={colors.textSecondary} style={{ marginBottom: Spacing.md }}>
            উপকারভোগীর বিশ্লেষণ রিপোর্ট শেয়ার বা ডাউনলোড করুন।
          </T>
          <Btn
            label="রিপোর্ট ডাউনলোড / শেয়ার"
            onPress={downloadReport}
            fullWidth
            variant="primary"
            loading={exporting}
            icon={<DownloadIcon size={16} color={Colors.textInverse} />}
          />
        </Card>
      </ScreenScroll>
    </ScreenFrame>
  );
};

const styles = StyleSheet.create({
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.bg,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
});
