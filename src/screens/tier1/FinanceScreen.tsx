import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, StatCard, SectionHeader, AISuggestion, Chip } from '../../components/atoms';
import { Colors, Spacing } from '../../theme';
import { FinanceIcon, TrendUpIcon, TrendDownIcon, CalendarIcon } from '../../icons';
import { seedTransactions } from '../../data/seed';
import { aiSuggestions, calendarEvents } from '../../data/seed';
import { bnTaka, calcProfit, toBn } from '../../utils/helpers';

export const FinanceScreen = () => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const income = seedTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = seedTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const profit = calcProfit(income, expense);

  return (
    <View style={styles.container}>
      <AppHeader title="অর্থ" subtitle="আয়, ব্যয় ও লাভ" />
      <ScreenScroll>
        <Row gap={Spacing.sm} style={{ marginBottom: Spacing.sm }}>
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <Chip
              key={p}
              label={p === 'daily' ? 'দৈনিক' : p === 'weekly' ? 'সাপ্তাহিক' : 'মাসিক'}
              active={period === p}
              onPress={() => setPeriod(p)}
            />
          ))}
        </Row>

        <Row gap={Spacing.sm} style={{ marginBottom: Spacing.base }}>
          <StatCard label="আয়" value={bnTaka(income)} color={Colors.success} trend="up" trendValue="১২%" icon={<TrendUpIcon size={16} color={Colors.success} />} />
          <StatCard label="ব্যয়" value={bnTaka(expense)} color={Colors.error} trend="down" trendValue="৫%" icon={<TrendDownIcon size={16} color={Colors.error} />} />
        </Row>

        <Card style={{ marginBottom: Spacing.base, backgroundColor: profit >= 0 ? Colors.successLight : Colors.errorLight }}>
          <Row justify="space-between" align="center">
            <View>
              <T size="sm" color={Colors.textSecondary}>নিট লাভ</T>
              <T size="3xl" weight="bold" color={profit >= 0 ? Colors.success : Colors.error}>{bnTaka(profit)}</T>
            </View>
            <FinanceIcon size={32} color={profit >= 0 ? Colors.success : Colors.error} />
          </Row>
        </Card>

        <SectionHeader title="AI পরামর্শ" />
        {aiSuggestions.finance.map((s, i) => (
          <View key={i} style={{ marginBottom: Spacing.sm }}>
            <AISuggestion title={s.title} message={s.message} />
          </View>
        ))}

        <SectionHeader title="ব্যবসা পারফরম্যান্স" />
        {aiSuggestions.performance.map((s, i) => (
          <View key={i} style={{ marginBottom: Spacing.sm }}>
            <AISuggestion title={s.title} message={s.message} />
          </View>
        ))}
      </ScreenScroll>
    </View>
  );
};

export const CalendarScreen = () => (
  <View style={styles.container}>
    <AppHeader title="ক্যালেন্ডার" subtitle="দৈনিক ও সাপ্তাহিক পরিকল্পনা" />
    <ScreenScroll>
      <Card style={{ marginBottom: Spacing.base }}>
        <Row gap={Spacing.sm}>
          <CalendarIcon size={24} color={Colors.primary} />
          <View>
            <T size="md" weight="bold">এই সপ্তাহ</T>
            <T size="sm" color={Colors.textSecondary}>২৬ মে – ১ জুন ২০২৬</T>
          </View>
        </Row>
      </Card>

      <SectionHeader title="আসন্ন ইভেন্ট" />
      {calendarEvents.map((ev) => (
        <Card key={ev.id} style={{ marginBottom: Spacing.sm }} padding={Spacing.md}>
          <Row justify="space-between">
            <View>
              <T size="sm" weight="semibold">{ev.title}</T>
              <T size="xs" color={Colors.textTertiary}>{ev.date}</T>
            </View>
            <T size="xs" color={Colors.primary} weight="medium">
              {ev.type === 'market' ? 'হাট' : ev.type === 'inventory' ? 'স্টক' : ev.type === 'promo' ? 'প্রচার' : 'হিসাব'}
            </T>
          </Row>
        </Card>
      ))}
    </ScreenScroll>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
});
