import { UserTier } from '../auth/AuthContext';

/** Customer setup only — business profile, tier value, loan (not app how-to) */
export type CustomerOnboardingStepId =
  | 'welcome'
  | 'tierValue'
  | 'whatsNew'
  | 'loan'
  | 'credit'
  | 'ready';

export const CUSTOMER_FLOW: Record<UserTier, CustomerOnboardingStepId[]> = {
  0: ['welcome', 'tierValue', 'loan', 'credit', 'ready'],
  1: ['welcome', 'tierValue', 'loan', 'credit', 'ready'],
  2: ['welcome', 'tierValue', 'loan', 'credit', 'ready'],
  3: ['welcome', 'tierValue', 'loan', 'credit', 'ready'],
  4: ['welcome', 'tierValue', 'loan', 'credit', 'ready'],
};

export const CUSTOMER_UPGRADE_FLOW: Record<UserTier, CustomerOnboardingStepId[]> = {
  0: CUSTOMER_FLOW[0],
  1: ['whatsNew', 'ready'],
  2: ['whatsNew', 'ready'],
  3: ['whatsNew', 'ready'],
  4: ['whatsNew', 'ready'],
};

export function resolveCustomerSteps(
  tier: UserTier,
  isUpgrade: boolean,
  loanAlreadySet: boolean,
  includeCredit: boolean,
): CustomerOnboardingStepId[] {
  const base = isUpgrade && tier > 0 ? CUSTOMER_UPGRADE_FLOW[tier] : CUSTOMER_FLOW[tier];
  return base.filter((id) => {
    if (id === 'loan' && loanAlreadySet) return false;
    if (id === 'credit' && !includeCredit) return false;
    return true;
  });
}
