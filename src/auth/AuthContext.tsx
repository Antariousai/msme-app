import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/helpers';

export type UserTier = 0 | 1 | 2 | 3 | 4;

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  businessName: string;
  tier: UserTier;
  location: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (phone: string, pin: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateTier: (tier: UserTier) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => false,
  signOut: async () => {},
  updateTier: async () => {},
});

const DEMO_USERS: Record<string, { pin: string; user: AuthUser }> = {
  '01700000000': {
    pin: '1234',
    user: {
      id: 'u1',
      name: 'রাহেলা বেগম',
      phone: '01700000000',
      businessName: 'রাহেলা বুটিক হাউস',
      tier: 0,
      location: 'ঢাকা',
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
    },
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_USER);
        if (stored) setUser(JSON.parse(stored));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const signIn = async (phone: string, pin: string): Promise<boolean> => {
    const entry = DEMO_USERS[phone];
    if (!entry || entry.pin !== pin) return false;
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(entry.user));
    setUser(entry.user);
    return true;
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    setUser(null);
  };

  const updateTier = async (tier: UserTier) => {
    if (!user) return;
    const updated = { ...user, tier };
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateTier }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
