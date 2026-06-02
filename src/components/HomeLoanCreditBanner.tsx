import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { userHasLoan } from '../auth/onboarding';
import { useFeatureNav } from '../navigation/FeatureNavContext';
import { DashboardCreditScoreCard } from '../screens/shared/CreditScoreScreen';

/** Credit score at top of home dashboard — only when user declared a loan in onboarding */
export const HomeLoanCreditBanner = () => {
  const { user } = useAuth();
  const { openFeature } = useFeatureNav();

  if (!userHasLoan(user)) return null;

  return (
    <DashboardCreditScoreCard onPress={() => openFeature('creditScore')} />
  );
};
