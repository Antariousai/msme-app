import React from 'react';
import { UserTier } from '../auth/AuthContext';
import { Tier0Home, BookkeepingScreen } from '../screens/tier0/BookkeepingScreen';
import { MessagesScreen } from '../screens/tier1/MessagesScreen';
import { FinanceScreen, CalendarScreen } from '../screens/tier1/FinanceScreen';
import { OrdersScreen, WebsiteScreen } from '../screens/tier2/OrdersScreen';
import { InventoryScreen, CourierScreen } from '../screens/tier2/InventoryScreen';
import { LeadsScreen } from '../screens/tier3/LeadsScreen';
import { DashboardScreen, ReportsScreen, ComplaintsScreen } from '../screens/tier4/DashboardScreen';
import {
  BookIcon, MessageIcon, FinanceIcon, CalendarIcon, OrderIcon,
  InventoryIcon, CourierIcon, WebsiteIcon, LeadIcon, ChartIcon,
  ReportIcon, ComplaintIcon,
} from '../icons';

export type FeatureId =
  | 'bookkeeping'
  | 'messages'
  | 'finance'
  | 'calendar'
  | 'orders'
  | 'inventory'
  | 'courier'
  | 'website'
  | 'leads'
  | 'dashboard'
  | 'reports'
  | 'complaints';

export interface FeatureDef {
  id: FeatureId;
  label: string;
  subtitle: string;
  introducedIn: UserTier;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  component: React.ComponentType;
}

export const FEATURES: FeatureDef[] = [
  {
    id: 'bookkeeping',
    label: 'হিসাব রক্ষা',
    subtitle: 'আয় ও ব্যয়',
    introducedIn: 0,
    icon: BookIcon,
    component: BookkeepingScreen,
  },
  {
    id: 'messages',
    label: 'মেসেজ',
    subtitle: 'Facebook + Instagram',
    introducedIn: 1,
    icon: MessageIcon,
    component: MessagesScreen,
  },
  {
    id: 'finance',
    label: 'অর্থ',
    subtitle: 'আয়, ব্যয় ও লাভ',
    introducedIn: 1,
    icon: FinanceIcon,
    component: FinanceScreen,
  },
  {
    id: 'calendar',
    label: 'ক্যালেন্ডার',
    subtitle: 'দৈনিক ও সাপ্তাহিক',
    introducedIn: 1,
    icon: CalendarIcon,
    component: CalendarScreen,
  },
  {
    id: 'orders',
    label: 'অর্ডার',
    subtitle: 'সব চ্যানেল',
    introducedIn: 2,
    icon: OrderIcon,
    component: OrdersScreen,
  },
  {
    id: 'inventory',
    label: 'ইনভেন্টরি',
    subtitle: 'স্টক ইনফ্লো/আউটফ্লো',
    introducedIn: 2,
    icon: InventoryIcon,
    component: InventoryScreen,
  },
  {
    id: 'courier',
    label: 'কুরিয়ার',
    subtitle: 'Pathao · RedX · Steadfast',
    introducedIn: 2,
    icon: CourierIcon,
    component: CourierScreen,
  },
  {
    id: 'website',
    label: 'ওয়েবসাইট',
    subtitle: 'ইন্টিগ্রেশন ও হোস্টিং',
    introducedIn: 2,
    icon: WebsiteIcon,
    component: WebsiteScreen,
  },
  {
    id: 'leads',
    label: 'লিড',
    subtitle: 'ক্যাপচার ও স্কোরিং',
    introducedIn: 3,
    icon: LeadIcon,
    component: LeadsScreen,
  },
  {
    id: 'dashboard',
    label: 'ড্যাশবোর্ড',
    subtitle: 'ইনসাইট ও বিশ্লেষণ',
    introducedIn: 4,
    icon: ChartIcon,
    component: DashboardScreen,
  },
  {
    id: 'reports',
    label: 'রিপোর্ট',
    subtitle: 'দৈনিক · সাপ্তাহিক · মাসিক',
    introducedIn: 4,
    icon: ReportIcon,
    component: ReportsScreen,
  },
  {
    id: 'complaints',
    label: 'অভিযোগ',
    subtitle: 'ট্র্যাকিং ও সমাধান',
    introducedIn: 4,
    icon: ComplaintIcon,
    component: ComplaintsScreen,
  },
];

export const TIER_GROUP_LABELS: Record<UserTier, string> = {
  0: 'টায়ার ০ — অফলাইন',
  1: 'টায়ার ১ — স্টার্টার',
  2: 'টায়ার ২ — গ্রোথ',
  3: 'টায়ার ৩ — প্রো',
  4: 'টায়ার ৪ — এন্টারপ্রাইজ',
};

/** Features unlocked at or below the user's tier */
export function getAccessibleFeatures(tier: UserTier): FeatureDef[] {
  return FEATURES.filter((f) => f.introducedIn <= tier);
}

/** Feature IDs shown as bottom tabs for each tier */
export function getPrimaryTabIds(tier: UserTier): FeatureId[] {
  switch (tier) {
    case 0:
      return ['bookkeeping'];
    case 1:
      return ['messages', 'finance', 'calendar'];
    case 2:
      return ['orders', 'inventory', 'courier'];
    case 3:
      return ['leads', 'messages', 'finance'];
    case 4:
      return ['dashboard', 'leads', 'finance'];
    default:
      return [];
  }
}

/** Features accessible but not in the bottom tab bar — opened via hub / More */
export function getHubFeatures(tier: UserTier): FeatureDef[] {
  const inTabs = new Set(getPrimaryTabIds(tier));
  return getAccessibleFeatures(tier).filter((f) => !inTabs.has(f.id));
}

export function getFeatureById(id: FeatureId): FeatureDef | undefined {
  return FEATURES.find((f) => f.id === id);
}

export function getFeaturesByTierGroup(tier: UserTier): { tierLevel: UserTier; features: FeatureDef[] }[] {
  const accessible = getAccessibleFeatures(tier);
  const groups: UserTier[] = [0, 1, 2, 3, 4];
  return groups
    .filter((t) => t <= tier)
    .map((tierLevel) => ({
      tierLevel,
      features: accessible.filter((f) => f.introducedIn === tierLevel),
    }))
    .filter((g) => g.features.length > 0);
}

export function isInPrimaryTabs(tier: UserTier, featureId: FeatureId): boolean {
  return getPrimaryTabIds(tier).includes(featureId);
}
