import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/helpers';
import { LoanLenderId } from '../data/loanLenders';
import type { TierOnboardingState, UserLoanProfile } from './onboarding';

export type { UserLoanProfile };

export type { TierOnboardingState } from './onboarding';

export type UserTier = 0 | 1 | 2 | 3 | 4;
export type AuthRole = 'msme' | 'po';

export interface AddOns {
  brandStudio: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  businessName: string;
  tier: UserTier;
  location: string;
  addOns: AddOns;
  /** Per-tier first-time onboarding completion */
  tierOnboarding?: Partial<Record<UserTier, TierOnboardingState>>;
  /** Set during onboarding when user declares a business loan */
  loanProfile?: UserLoanProfile;
}

export interface ProgramOfficer {
  id: string;
  name: string;
  phone: string;
  organization: string;
  region: string;
}

export type AuthSession =
  | { role: 'msme'; user: AuthUser }
  | { role: 'po'; officer: ProgramOfficer };

interface AuthContextType {
  session: AuthSession | null;
  role: AuthRole | null;
  user: AuthUser | null;
  officer: ProgramOfficer | null;
  loading: boolean;
  signIn: (phone: string, pin: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateTier: (tier: UserTier) => Promise<void>;
  setBrandStudioAddOn: (enabled: boolean) => Promise<void>;
  completeTierOnboarding: (
    tier: UserTier,
    loan?: { hasLoan: boolean; lenderId?: LoanLenderId },
  ) => Promise<void>;
  completeTierTutorial: (tier: UserTier) => Promise<void>;
  resetTierGuidance: (tier?: UserTier) => Promise<void>;
  resetTierTutorial: (tier?: UserTier) => Promise<void>;
  updateLoanProfile: (loan: UserLoanProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  role: null,
  user: null,
  officer: null,
  loading: true,
  signIn: async () => false,
  signOut: async () => {},
  updateTier: async () => {},
  setBrandStudioAddOn: async () => {},
  completeTierOnboarding: async () => {},
  completeTierTutorial: async () => {},
  resetTierGuidance: async () => {},
  resetTierTutorial: async () => {},
  updateLoanProfile: async () => {},
});

const DEMO_MSME: Record<string, { pin: string; user: AuthUser }> = {
  '01700000000': {
    pin: '1234',
    user: {
      id: 'u1',
      name: 'রাহেলা বেগম',
      phone: '01700000000',
      businessName: 'রাহেলা বুটিক হাউস',
      tier: 0,
      location: 'ঢাকা',
      addOns: { brandStudio: false },
    },
  },
  '01800000001': {
    pin: '1234',
    user: {
      id: 'u2',
      name: 'মোঃ ফয়সাল',
      phone: '01800000001',
      businessName: 'ফয়সাল ইলেকট্রনিক্স',
      tier: 1,
      location: 'চট্টগ্রাম',
      addOns: { brandStudio: false },
    },
  },
  '01900000002': {
    pin: '1234',
    user: {
      id: 'u3',
      name: 'সুমাইয়া আক্তার',
      phone: '01900000002',
      businessName: 'সুমাইয়া ফ্যাশন',
      tier: 2,
      location: 'সিলেট',
      addOns: { brandStudio: true },
    },
  },
  '01700000003': {
    pin: '1234',
    user: {
      id: 'u4',
      name: 'করিম সাহেব',
      phone: '01700000003',
      businessName: 'করিম এন্টারপ্রাইজ',
      tier: 3,
      location: 'রাজশাহী',
      addOns: { brandStudio: false },
    },
  },
  '01800000004': {
    pin: '1234',
    user: {
      id: 'u5',
      name: 'নাসরিন পারভিন',
      phone: '01800000004',
      businessName: 'নাসরিন টেক্সটাইল',
      tier: 4,
      location: 'ময়মনসিংহ',
      addOns: { brandStudio: true },
    },
  },
};

const DEMO_PO: Record<string, { pin: string; officer: ProgramOfficer }> = {
  '01999000000': {
    pin: '1234',
    officer: {
      id: 'po1',
      name: 'মোঃ রাশেদুল ইসলাম',
      phone: '01999000000',
      organization: 'Antarious MSME প্রোগ্রাম',
      region: 'ঢাকা ও ঢাকার আশেপাশ',
    },
  },
};

function parseStoredSession(raw: string): AuthSession | null {
  const parsed = JSON.parse(raw) as AuthSession | AuthUser;
  if (parsed && typeof parsed === 'object' && 'role' in parsed) {
    const s = parsed as AuthSession;
    if (s.role === 'po' && s.officer) return s;
    if (s.role === 'msme' && s.user) {
      if (!s.user.addOns) s.user.addOns = { brandStudio: false };
      if (!s.user.tierOnboarding) s.user.tierOnboarding = {};
      return s;
    }
    return null;
  }
  const legacy = parsed as AuthUser;
  if (legacy?.phone && legacy?.tier !== undefined) {
    if (!legacy.addOns) legacy.addOns = { brandStudio: false };
    if (!legacy.tierOnboarding) legacy.tierOnboarding = {};
    return { role: 'msme', user: legacy };
  }
  return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_USER);
        if (stored) {
          const restored = parseStoredSession(stored);
          if (restored) setSession(restored);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const persist = async (next: AuthSession | null) => {
    if (next) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
    setSession(next);
  };

  const signIn = async (phone: string, pin: string): Promise<boolean> => {
    const po = DEMO_PO[phone];
    if (po && po.pin === pin) {
      await persist({ role: 'po', officer: po.officer });
      return true;
    }
    const msme = DEMO_MSME[phone];
    if (msme && msme.pin === pin) {
      await persist({ role: 'msme', user: msme.user });
      return true;
    }
    return false;
  };

  const signOut = async () => {
    await persist(null);
  };

  const updateTier = async (tier: UserTier) => {
    if (!session || session.role !== 'msme') return;
    const updated = { role: 'msme' as const, user: { ...session.user, tier } };
    await persist(updated);
  };

  const setBrandStudioAddOn = async (enabled: boolean) => {
    if (!session || session.role !== 'msme') return;
    const updated = {
      role: 'msme' as const,
      user: { ...session.user, addOns: { ...session.user.addOns, brandStudio: enabled } },
    };
    await persist(updated);
  };

  const completeTierOnboarding = async (
    tier: UserTier,
    loan?: { hasLoan: boolean; lenderId?: LoanLenderId },
  ) => {
    if (!session || session.role !== 'msme') return;
    const tierOnboarding = {
      ...session.user.tierOnboarding,
      [tier]: {
        completed: true,
        customerCompleted: true,
        tutorialCompleted: session.user.tierOnboarding?.[tier]?.tutorialCompleted ?? false,
      },
    };
    let loanProfile = session.user.loanProfile;
    if (loan !== undefined) {
      loanProfile = loan.hasLoan
        ? { hasLoan: true, lenderId: loan.lenderId }
        : { hasLoan: false };
    }
    const updated = {
      role: 'msme' as const,
      user: {
        ...session.user,
        tierOnboarding,
        loanProfile,
      },
    };
    await persist(updated);
  };

  const completeTierTutorial = async (tier: UserTier) => {
    if (!session || session.role !== 'msme') return;
    const prev = session.user.tierOnboarding?.[tier];
    const tierOnboarding = {
      ...session.user.tierOnboarding,
      [tier]: {
        ...prev,
        completed: true,
        customerCompleted: true,
        tutorialCompleted: true,
      },
    };
    await persist({
      role: 'msme',
      user: { ...session.user, tierOnboarding },
    });
  };

  const resetTierGuidance = async (tier?: UserTier) => {
    if (!session || session.role !== 'msme') return;
    const t = tier ?? session.user.tier;
    const tierOnboarding = { ...session.user.tierOnboarding };
    delete tierOnboarding[t];
    await persist({
      role: 'msme',
      user: { ...session.user, tierOnboarding },
    });
  };

  const resetTierTutorial = async (tier?: UserTier) => {
    if (!session || session.role !== 'msme') return;
    const t = tier ?? session.user.tier;
    const prev = session.user.tierOnboarding?.[t];
    if (!prev?.customerCompleted && !prev?.completed) return;
    const tierOnboarding = {
      ...session.user.tierOnboarding,
      [t]: {
        ...prev,
        completed: true,
        customerCompleted: true,
        tutorialCompleted: false,
      },
    };
    await persist({
      role: 'msme',
      user: { ...session.user, tierOnboarding },
    });
  };

  const updateLoanProfile = async (loan: UserLoanProfile) => {
    if (!session || session.role !== 'msme') return;
    const updated = {
      role: 'msme' as const,
      user: { ...session.user, loanProfile: loan },
    };
    await persist(updated);
  };

  const user = session?.role === 'msme' ? session.user : null;
  const officer = session?.role === 'po' ? session.officer : null;
  const role = session?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        session,
        role,
        user,
        officer,
        loading,
        signIn,
        signOut,
        updateTier,
        setBrandStudioAddOn,
        completeTierOnboarding,
        completeTierTutorial,
        resetTierGuidance,
        resetTierTutorial,
        updateLoanProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
