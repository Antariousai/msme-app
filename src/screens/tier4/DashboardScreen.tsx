import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, SectionHeader, StatCard, StatusPill, Chip, AISuggestion } from '../../components/atoms';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { Colors, Spacing } from '../../theme';
import { ChartIcon, TrendUpIcon, TrendDownIcon, PeakIcon, ReportIcon } from '../../icons';
import { seedTransactions, seedComplaints, aiSuggestions } from '../../data/seed';
import { bnTaka, calcProfit, toBn } from '../../utils/helpers';

export const DashboardScreen = () => {
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

  return (
    <View style={styles.container}>
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
        </Card>

        <Row gap={Spacing.sm} style={{ marginBottom: Spacing.base }}>
          <StatCard label="বেস্ট সেলার" value="কটন কুর্তি" subtitle="৪৫ ইউনিট" color={Colors.success} icon={<TrendUpIcon size={16} color={Colors.success} />} />
          <StatCard label="ওয়ার্স সেলার" value="স্কার্ফ" subtitle="৩ ইউনিট" color={Colors.error} icon={<TrendDownIcon size={16} color={Colors.error} />} />
        </Row>

        <Card style={{ marginBottom: Spacing.base }}>
          <Row gap={Spacing.sm} style={{ marginBottom: Spacing.sm }}>
            <PeakIcon size={20} color={Colors.accent} />
            <T size="md" weight="bold">পিক আওয়ার বিশ্লেষণ</T>
          </Row>
          <T size="sm" color={Colors.textSecondary}>সর্বোচ্চ কার্যকলাপ: সন্ধ্যা ৭:০০ – ৯:০০</T>
          <T size="xs" color={Colors.textTertiary} style={{ marginTop: Spacing.xs }}>শুক্র ও শনিবারে ৩৫% বেশি অর্ডার</T>
        </Card>

        <SectionHeader title="AI ইনসাইট" />
        {[...aiSuggestions.finance, ...aiSuggestions.performance].map((item, i) => (
          <View key={i} style={{ marginBottom: Spacing.sm }}>
            <AISuggestion title={item.title} message={item.message} />
          </View>
        ))}
      </ScreenScroll>
    </View>
  );
};

export const ReportsScreen = () => (
  <View style={styles.container}>
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
  </View>
);

export const ComplaintsScreen = () => (
  <View style={styles.container}>
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
  </View>
);

export const Tier4Home = () => (
  <View style={styles.container}>
    <AppHeader showGreeting />
    <ScreenScroll>
      <Card style={{ marginBottom: Spacing.base, backgroundColor: Colors.tier4 + '15' }}>
        <Row gap={Spacing.sm}>
          <ChartIcon size={24} color={Colors.tier4} />
          <View>
            <T size="md" weight="bold">এন্টারপ্রাইজ ড্যাশবোর্ড</T>
            <T size="sm" color={Colors.textSecondary}>সম্পূর্ণ ব্যবসা বিশ্লেষণ</T>
          </View>
        </Row>
      </Card>
      <Row gap={Spacing.sm} style={{ marginBottom: Spacing.base }}>
        <Card style={{ flex: 1, minWidth: 0 }}>
          <T size="xs" color={Colors.textTertiary}>আজকের আয়</T>
          <T size="xl" weight="bold" color={Colors.success}>{bnTaka(3500)}</T>
        </Card>
        <Card style={{ flex: 1, minWidth: 0 }}>
          <T size="xs" color={Colors.textTertiary}>খোলা অভিযোগ</T>
          <T size="xl" weight="bold" color={Colors.error}>১</T>
        </Card>
      </Row>

      <AISuggestion
        title="লিড ক্লোজিং সাপোর্ট"
        message="৩টি হট লিড অপেক্ষমাণ — আজ ফলো-আপ করলে ২টি রূপান্তর সম্ভব।"
        actionLabel="লিড দেখুন"
      />

      <FeatureToolsSection defaultExpanded={false} />
    </ScreenScroll>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
});
