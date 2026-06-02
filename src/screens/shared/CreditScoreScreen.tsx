import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader } from '../../components/AppHeader';
import {
  T,
  Card,
  Row,
  ScreenScroll,
  SectionHeader,
  Btn,
  AISuggestion,
  StatusPill,
} from '../../components/atoms';
import { ScreenFrame } from '../../components/ScreenFrame';
import { Colors, Spacing, Radius, Gradients } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../auth/AuthContext';
import {
  computeBusinessCreditScore,
  creditScoreColor,
  buildPksfCreditReport,
  CreditFactor,
} from '../../utils/creditScore';
import { shareReport } from '../../utils/report';
import { toBn } from '../../utils/helpers';

const FactorRow = ({ factor }: { factor: CreditFactor }) => {
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
      <T size="xs" color={Colors.textSecondary} style={{ marginTop: Spacing.xs }}>{factor.detail}</T>
      {factor.tip ? (
        <T size="xs" color={Colors.warning} style={{ marginTop: 4 }}>💡 {factor.tip}</T>
      ) : null}
    </Card>
  );
};

export const CreditScoreScreen = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [exporting, setExporting] = useState(false);

  const profile = useMemo(() => computeBusinessCreditScore(), []);
  const scoreColor = creditScoreColor(profile.score);
  const canPksf = (user?.tier ?? 0) >= 3;

  const exportPksf = async () => {
    setExporting(true);
    try {
      const content = buildPksfCreditReport(user?.businessName ?? 'আমার ব্যবসা', profile);
      await shareReport('pksf-credit-score', content);
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScreenFrame>
      <AppHeader title="ক্রেডিট স্কোর" subtitle="অ্যাকাউন্ট · MSME প্রোফাইল" />
      <ScreenScroll>
        <LinearGradient
          colors={[...Gradients.hero]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scoreHero}
        >
          <T size="sm" weight="semibold" color="#fff" style={{ opacity: 0.9 }}>
            {user?.businessName ?? 'আপনার ব্যবসা'}
          </T>
          <View style={styles.scoreRing}>
            <View style={[styles.scoreRingInner, { borderColor: '#ffffff88' }]}>
              <T color="#fff" weight="bold" style={styles.scoreNumber}>{toBn(profile.score)}</T>
              <T size="xs" color="#fff" style={{ opacity: 0.85 }}>/ ১০০</T>
            </View>
          </View>
          <Row justify="center" gap={Spacing.sm} style={{ marginTop: Spacing.sm }}>
            <StatusPill
              label={`${profile.gradeEmoji} ${profile.gradeLabel}`}
              type={profile.score >= 60 ? 'success' : profile.score >= 40 ? 'warning' : 'error'}
            />
            {profile.pksfEligible && (
              <StatusPill label="PKSF যোগ্য" type="info" />
            )}
          </Row>
          <T size="xs" color="#fff" style={{ opacity: 0.8, marginTop: Spacing.sm, textAlign: 'center' }}>
            হিসাব · অর্ডার · স্টক · লিড ডেটা থেকে স্বয়ংক্রিয়
          </T>
        </LinearGradient>

        <AISuggestion
          title="📈 স্কোর বিশ্লেষণ"
          message={profile.summary}
          actionLabel="উপাদান দেখুন"
        />

        <SectionHeader title="স্কোর উপাদান" />
        {profile.factors.map((f) => (
          <FactorRow key={f.id} factor={f} />
        ))}

        <Card style={{ marginTop: Spacing.sm, marginBottom: Spacing.base }}>
          <T size="sm" weight="bold" style={{ marginBottom: Spacing.sm }}>🏛️ PKSF রিপোর্টিং</T>
          <T size="xs" color={colors.textSecondary} style={{ marginBottom: Spacing.md }}>
            পল্লী কর্ম-সহায়ক ফাউন্ডেশন (PKSF) ও অংশীদার ইনস্টিটিউশনের জন্য ক্রেডিট সারাংশ এক্সপোর্ট করুন।
            {canPksf ? '' : ' সম্পূর্ণ রিপোর্ট টায়ার ৩+ এ উপলব্ধ।'}
          </T>
          {!profile.pksfEligible && (
            <T size="xs" color={Colors.warning} style={{ marginBottom: Spacing.md }}>
              স্কোর ৬০+ হলে PKSF যোগ্যতা চিহ্ন সক্রিয় হয়।
            </T>
          )}
          <Btn
            label={canPksf ? '⬇️ PKSF রিপোর্ট এক্সপোর্ট' : '🔒 টায়ার ৩+ প্রয়োজন'}
            onPress={exportPksf}
            fullWidth
            variant="primary"
            disabled={!canPksf}
            loading={exporting}
          />
        </Card>

        <Card style={{ backgroundColor: colors.aiBg }}>
          <T size="xs" color={colors.textSecondary}>
            * ডেমো মডেল — প্রকৃত PKSF ইন্টিগ্রেশন ব্যাকএন্ড API সংযুক্ত হলে লাইভ ডেটা ব্যবহার হবে।
          </T>
        </Card>
      </ScreenScroll>
    </ScreenFrame>
  );
};

/** Inline row inside the account profile card */
export const AccountCreditScoreRow = ({ onPress }: { onPress: () => void }) => {
  const { colors } = useTheme();
  const profile = useMemo(() => computeBusinessCreditScore(), []);
  const color = creditScoreColor(profile.score);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.accountCreditRow,
      { borderTopColor: colors.border, opacity: pressed ? 0.85 : 1 },
    ]}>
      <View style={[styles.miniRing, { borderColor: color }]}>
        <T size="lg" weight="bold" color={color}>{toBn(profile.score)}</T>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <T size="sm" weight="bold">🏦 ক্রেডিট স্কোর</T>
        <T size="xs" color={colors.textSecondary} numberOfLines={1}>
          {profile.gradeEmoji} {profile.gradeLabel}
          {profile.pksfEligible ? ' · PKSF যোগ্য' : ''}
        </T>
      </View>
      <View style={[styles.creditBarMini, { backgroundColor: colors.bg }]}>
        <View style={[styles.creditBarMiniFill, { width: `${profile.score}%`, backgroundColor: color }]} />
      </View>
      <T size="lg" color={colors.textTertiary}>›</T>
    </Pressable>
  );
};

/** Standalone card (legacy — prefer AccountCreditScoreRow) */
export const CreditScoreSummaryCard = ({ onPress }: { onPress: () => void }) => (
  <AccountCreditScoreRow onPress={onPress} />
);

const styles = StyleSheet.create({
  scoreHero: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  scoreRing: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  scoreRingInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  scoreNumber: {
    fontSize: 42,
    lineHeight: 48,
  },
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
  miniRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  accountCreditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    borderTopWidth: 1,
  },
  creditBarMini: {
    width: 48,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  creditBarMiniFill: {
    height: 6,
    borderRadius: 3,
  },
});
