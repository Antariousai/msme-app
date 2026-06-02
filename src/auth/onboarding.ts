import { AuthUser, UserTier } from './AuthContext';
import { LoanLenderId } from '../data/loanLenders';

export interface UserLoanProfile {
  hasLoan: boolean;
  lenderId?: LoanLenderId;
}

export interface TierOnboardingState {
  /** Legacy — same as customerCompleted */
  completed?: boolean;
  customerCompleted?: boolean;
  tutorialCompleted?: boolean;
}

export const isCustomerOnboarded = (user: AuthUser | null, tier: UserTier): boolean => {
  const s = user?.tierOnboarding?.[tier];
  return s?.customerCompleted === true || s?.completed === true;
};

export const isTutorialCompleted = (user: AuthUser | null, tier: UserTier): boolean =>
  user?.tierOnboarding?.[tier]?.tutorialCompleted === true;

/** Phase 1: tier welcome, value, loan */
export const needsCustomerOnboarding = (user: AuthUser | null): boolean =>
  !!user && !isCustomerOnboarded(user, user.tier);

/** Phase 2: in-app tour after customer setup */
export const needsAppTutorial = (user: AuthUser | null): boolean =>
  !!user && isCustomerOnboarded(user, user.tier) && !isTutorialCompleted(user, user.tier);

/** @deprecated use needsCustomerOnboarding */
export const needsTierOnboarding = needsCustomerOnboarding;

export const userHasLoan = (user: AuthUser | null): boolean =>
  user?.loanProfile?.hasLoan === true;

export const isUpgradeOnboarding = (user: AuthUser | null, tier: UserTier): boolean => {
  if (!user?.tierOnboarding || tier <= 0) return false;
  for (let t = 0; t < tier; t++) {
    if (isCustomerOnboarded(user, t as UserTier)) return true;
  }
  return false;
};

export type { OnboardingStepId } from '../data/tierOnboardingSteps';
export { resolveOnboardingSteps } from '../data/tierOnboardingSteps';
