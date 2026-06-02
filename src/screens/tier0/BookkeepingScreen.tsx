import React from 'react';
import { View } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { T, Card, Row, ScreenScroll, Btn, AISuggestion } from '../../components/atoms';
import { IncomeExpenseQuickActions } from '../../components/IncomeExpenseQuickActions';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { ScreenFrame } from '../../components/ScreenFrame';
import { HeroCard } from '../../components/HeroCard';
import { Spacing, Colors } from '../../theme';
import { seedTransactions } from '../../data/seed';
import { bnTaka, calcProfit, toBn } from '../../utils/helpers';
import { useFeatureNav } from '../../navigation/FeatureNavContext';
export { AccountingScreen as BookkeepingScreen } from '../accounting/AccountingScreen';

export const Tier0Home = () => {
  const { openFeature } = useFeatureNav();

  const income  = seedTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = seedTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const profit  = calcProfit(income, expense);
  const txCount = seedTransactions.length;

  return (
    <ScreenFrame>
      <AppHeader showGreeting />
      <ScreenScroll>

        <HeroCard
          title="💰 আজকের হিসাব"
          metric={bnTaka(income)}
          metricLabel="মোট আয়"
          stats={[
            { label: 'মোট ব্যয়', value: bnTaka(expense) },
            { label: 'মোট লাভ',  value: bnTaka(profit)  },
            { label: 'লেনদেন',   value: `${toBn(txCount)} টি` },
          ]}
        />

        <IncomeExpenseQuickActions />

        {/* Inventory quick summary */}
        <Card style={{ marginBottom: Spacing.base }} onPress={() => openFeature('inventory')}>
          <Row justify="space-between" align="center">
            <View>
              <T size="sm" weight="bold">📦 পণ্য মজুদ</T>
              <T size="xs" color={Colors.textSecondary} style={{ marginTop: 2 }}>
                স্টক দেখুন ও আপডেট করুন
              </T>
            </View>
            <Btn
              label="মজুদ দেখুন"
              onPress={() => openFeature('inventory')}
              variant="ghost"
              size="sm"
            />
          </Row>
        </Card>

        <AISuggestion
          title="💡 টিপস"
          message="প্রতিদিন হিসাব লিখে রাখুন — ছোট ব্যবসায় নিয়মিত রেকর্ড রাখলে মাস শেষে লাভ-ক্ষতি বুঝতে সহজ হয়।"
        />

        <FeatureToolsSection layout="grid" scope="all" />
      </ScreenScroll>
    </ScreenFrame>
  );
};
