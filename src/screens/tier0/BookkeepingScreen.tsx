import React from 'react';
import { AppHeader } from '../../components/AppHeader';
import { ScreenScroll, AISuggestion } from '../../components/atoms';
import { IncomeExpenseQuickActions } from '../../components/IncomeExpenseQuickActions';
import { HomeQuickLink } from '../../components/HomeQuickLink';
import { FeatureToolsSection } from '../../components/FeatureToolsSection';
import { ScreenFrame } from '../../components/ScreenFrame';
import { HeroCard } from '../../components/HeroCard';
import { HomeLoanCreditBanner } from '../../components/HomeLoanCreditBanner';
import { bnTaka, toBn } from '../../utils/helpers';
import { useFeatureNav } from '../../navigation/FeatureNavContext';
import { useTransactions } from '../../context/TransactionsContext';

export { AccountingScreen as BookkeepingScreen } from '../accounting/AccountingScreen';

export const Tier0Home = () => {
  const { openFeature } = useFeatureNav();
  const { transactions, income, expense, profit } = useTransactions();
  const txCount = transactions.length;

  return (
    <ScreenFrame>
      <AppHeader showGreeting />
      <ScreenScroll>
        <HomeLoanCreditBanner />
        <HeroCard
          title="💰 আজকের হিসাব"
          metric={bnTaka(income)}
          metricLabel="মোট আয়"
          stats={[
            { label: 'মোট ব্যয়', value: bnTaka(expense) },
            { label: 'মোট লাভ', value: bnTaka(profit) },
            { label: 'লেনদেন', value: `${toBn(txCount)} টি` },
          ]}
        />

        <IncomeExpenseQuickActions />

        <HomeQuickLink
          emoji="📦"
          title="পণ্য মজুদ"
          subtitle="স্টক দেখুন ও আপডেট করুন"
          actionLabel="মজুদ দেখুন"
          onPress={() => openFeature('inventory')}
        />

        <AISuggestion
          title="💡 টিপস"
          message="প্রতিদিন হিসাব লিখে রাখুন — ছোট ব্যবসায় নিয়মিত রেকর্ড রাখলে মাস শেষে লাভ-ক্ষতি বুঝতে সহজ হয়।"
          actionLabel="হিসাব খুলুন"
          onAction={() => openFeature('bookkeeping')}
        />

        <FeatureToolsSection layout="grid" scope="all" />
      </ScreenScroll>
    </ScreenFrame>
  );
};
