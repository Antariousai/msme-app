import React, { useState } from 'react';
import { View } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatCard, StatusPill, Chip, AISuggestion, Btn } from '../../components/atoms';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { HeroCard } from '../../components/HeroCard';
import { ScreenFrame } from '../../components/ScreenFrame';
import { Colors, Spacing } from '../../theme';
import { TrendUpIcon, TrendDownIcon, PeakIcon, ReportIcon, DownloadIcon } from '../../icons';
import { seedTransactions, seedComplaints, aiSuggestions, productSales, peakHours } from '../../data/seed';
import { bnTaka, calcProfit, toBn } from '../../utils/helpers';
import { useAuth } from '../../auth/AuthContext';
import { buildBusinessReport, shareReport, periodLabel, ReportPeriod } from '../../utils/report';

export const DashboardScreen = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const income = seedTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = seedTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const profit = calcProfit(income, expense);

  const summaries = {
    daily: { revenue: 3500, orders: 4, messages: 12, label: 'আজ' },
    weekly: { revenue: 18500, orders: 22, messages: 68, label: 'এই সপ্তাহ' },
    monthly: { revenue: 72000, orders: 89, messages: 245, label: 'এই মাস' },
  };
  const s = summaries[period];

  const best = productSales[0];
  const worst = productSales[productSales.length - 1];
  const peak = [...peakHours].sort((a, b) => b.orders - a.orders)[0];
  const maxPeak = Math.max(...peakHours.map((p) => p.orders));

  const exportSummary = async () => {
    const rp: ReportPeriod = period === 'weekly' ? 'weekly' : 'monthly';
    const content = buildBusinessReport({
      businessName: user?.businessName ?? 'আমার ব্যবসা',
      period: rp,
      income: s.revenue,
      expense,
      breakdown: [
        { label: `বেস্ট সেলার (${best.name})`, amount: best.revenue },
        { label: `ওয়ার্স সেলার (${worst.name})`, amount: worst.revenue },
      ],
    });
    await shareReport(`${periodLabel(rp)}-dashboard`, content);
  };

  return (
    <ScreenFrame>
      <AppHeader title="ড্যাশবোর্ড" subtitle="ইনসাইট ও রিপোর্টিং" />
      <ScreenScroll>
        <Row gap={Spacing.sm} wrap style={{ marginBottom: Spacing.base }}>
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <Chip
              key={p}
              label={p === 'daily' ? 'দৈনিক' : p === 'weekly' ? 'সাপ্তাহিক' : 'মাসিক'}
              active={period === p}
              onPress={() => setPeriod(p)}
            />
          ))}
        </Row>

        <Card style={{ marginBottom: Spacing.base, backgroundColor: Colors.tier4 + '15' }}>
          <T size="sm" color={Colors.textSecondary}>{s.label}র সারাংশ</T>
          <T size="3xl" weight="bold" color={Colors.tier4}>{bnTaka(s.revenue)}</T>
          <Row gap={Spacing.xl} style={{ marginTop: Spacing.sm }}>
            <View>
              <T size="xs" color={Colors.textTertiary}>অর্ডার</T>
              <T size="lg" weight="bold">{toBn(s.orders)}</T>
            </View>
            <View>
              <T size="xs" color={Colors.textTertiary}>মেসেজ</T>
              <T size="lg" weight="bold">{toBn(s.messages)}</T>
            </View>
            <View>
              <T size="xs" color={Colors.textTertiary}>লাভ</T>
              <T size="lg" weight="bold" color={Colors.success}>{bnTaka(profit)}</T>
            </View>
          </Row>
          <Btn
            label="সারাংশ এক্সপোর্ট"
            onPress={exportSummary}
            variant="outline"
            size="sm"
            icon={<DownloadIcon size={14} color={Colors.primary} />}
            style={{ marginTop: Spacing.md, alignSelf: 'flex-start' }}
          />
        </Card>

        <SectionHeader title="বেস্ট ও ওয়ার্স সেলিং" />
        <Row gap={Spacing.sm} style={{ marginBottom: Spacing.base }}>
          <StatCard label="বেস্ট সেলার" value={best.name} subtitle={`${toBn(best.units)} ইউনিট`} color={Colors.success} icon={<TrendUpIcon size={16} color={Colors.success} />} />
          <StatCard label="ওয়ার্স সেলার" value={worst.name} subtitle={`${toBn(worst.units)} ইউনিট`} color={Colors.error} icon={<TrendDownIcon size={16} color={Colors.error} />} />
        </Row>

        <Card style={{ marginBottom: Spacing.base }}>
          <Row gap={Spacing.sm} style={{ marginBottom: Spacing.sm }}>
            <PeakIcon size={20} color={Colors.accent} />
            <T size="md" weight="bold">পিক আওয়ার বিশ্লেষণ</T>
          </Row>
          {peakHours.map((p) => (
            <Row key={p.slot} gap={Spacing.sm} align="center" style={{ marginBottom: Spacing.xs }}>
              <T size="xs" color={Colors.textSecondary} style={{ width: 96 }}>{p.slot}</T>
              <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: Colors.bgDark }}>
                <View style={{ width: `${(p.orders / maxPeak) * 100}%`, height: 8, borderRadius: 4, backgroundColor: p.orders === maxPeak ? Colors.accent : Colors.tier4 }} />
              </View>
              <T size="xs" weight="semibold" color={Colors.textSecondary}>{toBn(p.orders)}</T>
            </Row>
          ))}
          <T size="xs" color={Colors.textTertiary} style={{ marginTop: Spacing.xs }}>
            সর্বোচ্চ কার্যকলাপ: {peak.slot}
          </T>
        </Card>

        <SectionHeader title="AI ইনসাইট" />
        {[...aiSuggestions.finance, ...aiSuggestions.performance].map((item, i) => (
          <View key={i} style={{ marginBottom: Spacing.sm }}>
            <AISuggestion title={item.title} message={item.message} />
          </View>
        ))}
      </ScreenScroll>
    </ScreenFrame>
  );
};

export const ReportsScreen = () => (
  <ScreenFrame>
    <AppHeader title="রিপোর্ট" subtitle="দৈনিক · সাপ্তাহিক · মাসিক" />
    <ScreenScroll>
      {[
        { title: 'দৈনিক সারাংশ', date: '২৭ মে ২০২৬', revenue: 3500, orders: 4 },
        { title: 'সাপ্তাহিক সারাংশ', date: '২০–২৬ মে', revenue: 18500, orders: 22 },
        { title: 'মাসিক সারাংশ', date: 'মে ২০২৬', revenue: 72000, orders: 89 },
      ].map((r) => (
        <Card key={r.title} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
          <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
            <Row gap={Spacing.sm}>
              <ReportIcon size={18} color={Colors.tier4} />
              <T size="sm" weight="bold">{r.title}</T>
            </Row>
            <T size="xs" color={Colors.textTertiary}>{r.date}</T>
          </Row>
          <Row gap={Spacing.xl}>
            <T size="sm" color={Colors.primary} weight="semibold">{bnTaka(r.revenue)}</T>
            <T size="sm" color={Colors.textSecondary}>{toBn(r.orders)} অর্ডার</T>
          </Row>
        </Card>
      ))}
    </ScreenScroll>
  </ScreenFrame>
);

export const ComplaintsScreen = () => (
  <ScreenFrame>
    <AppHeader title="অভিযোগ" subtitle="ট্র্যাকিং ও সমাধান" />
    <ScreenScroll>
      <SectionHeader title="অভিযোগ তালিকা" />
      {seedComplaints.map((c) => (
        <Card key={c.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
          <Row justify="space-between" style={{ marginBottom: Spacing.xs }}>
            <T size="sm" weight="semibold">{c.customer}</T>
            <StatusPill
              label={c.status === 'open' ? 'খোলা' : c.status === 'in_progress' ? 'চলমান' : 'সমাধান'}
              type={c.status === 'resolved' ? 'success' : c.status === 'in_progress' ? 'warning' : 'error'}
            />
          </Row>
          <T size="sm" color={Colors.textSecondary}>{c.issue}</T>
          <T size="xs" color={Colors.textTertiary} style={{ marginTop: Spacing.xs }}>{c.date}</T>
        </Card>
      ))}
    </ScreenScroll>
  </ScreenFrame>
);

export const Tier4Home = () => (
  <ScreenFrame>
    <AppHeader showGreeting />
    <ScreenScroll>
      <HeroCard
        title="এন্টারপ্রাইজ ড্যাশবোর্ড"
        titleEmoji="📊"
        metric={bnTaka(83500)}
        metricLabel="আজকের আয়"
        stats={[
          { label: 'খোলা অভিযোগ', value: '১', emoji: '⚠️' },
          { label: 'অর্ডার', value: '৪', emoji: '📦' },
        ]}
      />

      <AISuggestion
        title="🔥 লিড ক্লোজিং সাপোর্ট"
        message="৩টি হট লিড অপেক্ষমাণ — আজ ফলো-আপ করলে ২টি রূপান্তর সম্ভব। 🚀"
        actionLabel="লিড দেখুন"
      />

      <FeatureToolsSection layout="grid" scope="all" />
    </ScreenScroll>
  </ScreenFrame>
);
