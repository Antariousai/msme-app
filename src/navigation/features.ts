import React from 'react';
import { UserTier } from '../auth/AuthContext';
import { Tier0Home, BookkeepingScreen } from '../screens/tier0/BookkeepingScreen';
import { MessagesScreen } from '../screens/tier1/MessagesScreen';
import { CommentsScreen } from '../screens/tier1/CommentsScreen';
import { CalendarScreen } from '../screens/tier1/CalendarScreen';
import { OrdersScreen, WebsiteScreen } from '../screens/tier2/OrdersScreen';
import { InventoryScreen, CourierScreen } from '../screens/tier2/InventoryScreen';
import { LeadsScreen } from '../screens/tier3/LeadsScreen';
import { DashboardScreen, ReportsScreen, ComplaintsScreen } from '../screens/tier4/DashboardScreen';
import { FEATURE_EMOJI, makeEmojiIcon } from '../icons/emoji';

export type FeatureId =
  | 'bookkeeping'
  | 'messages'
  | 'comments'
  | 'calendar'
  | 'orders'
  | 'inventory'
  | 'courier'
  | 'website'
  | 'leads'
  | 'dashboard'
  | 'reports'
  | 'complaints';

export type FeatureCategory =
  | 'accounting'
  | 'sales'
  | 'operations'
  | 'customers'
  | 'insights';

export interface FeatureDef {
  id: FeatureId;
  label: string;
  subtitle: string;
  category: FeatureCategory;
  introducedIn: UserTier;
  emoji: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  component: React.ComponentType;
}

/** Display order and labels — grouped by business need, not tier */
export const FEATURE_CATEGORY_ORDER: FeatureCategory[] = [
  'accounting',
  'sales',
  'operations',
  'customers',
  'insights',
];

export const FEATURE_CATEGORY_META: Record<
  FeatureCategory,
  { title: string; description: string }
> = {
  accounting: {
    title: 'হিসাব ও অর্থ',
    description: 'আয়, ব্যয়, লাভ, জার্নাল ও বিশ্লেষণ',
  },
  sales: {
    title: 'বিক্রয় ও যোগাযোগ',
    description: 'মেসেজ, কমেন্ট ও অর্ডার',
  },
  operations: {
    title: 'স্টক ও ডেলিভারি',
    description: 'ইনভেন্টরি, কুরিয়ার, ওয়েবসাইট',
  },
  customers: {
    title: 'গ্রাহক ব্যবস্থাপনা',
    description: 'পরিকল্পনা, লিড ও রূপান্তর',
  },
  insights: {
    title: 'ব্যবসা বিশ্লেষণ',
    description: 'ড্যাশবোর্ড, রিপোর্ট ও অভিযোগ',
  },
};

export const FEATURES: FeatureDef[] = [
  {
    id: 'bookkeeping',
    label: 'হিসাব রক্ষা',
    subtitle: 'আয়, ব্যয়, জার্নাল ও বিশ্লেষণ',
    category: 'accounting',
    introducedIn: 0,
    emoji: FEATURE_EMOJI.bookkeeping,
    icon: makeEmojiIcon(FEATURE_EMOJI.bookkeeping),
    component: BookkeepingScreen,
  },
  {
    id: 'messages',
    label: 'মেসেজ',
    subtitle: 'Facebook + Instagram',
    category: 'sales',
    introducedIn: 1,
    emoji: FEATURE_EMOJI.messages,
    icon: makeEmojiIcon(FEATURE_EMOJI.messages),
    component: MessagesScreen,
  },
  {
    id: 'comments',
    label: 'কমেন্ট',
    subtitle: 'স্বয়ংক্রিয় কমেন্ট রিপ্লাই',
    category: 'sales',
    introducedIn: 1,
    emoji: FEATURE_EMOJI.comments,
    icon: makeEmojiIcon(FEATURE_EMOJI.comments),
    component: CommentsScreen,
  },
  {
    id: 'calendar',
    label: 'ক্যালেন্ডার',
    subtitle: 'দৈনিক ও সাপ্তাহিক পরিকল্পনা',
    category: 'customers',
    introducedIn: 1,
    emoji: FEATURE_EMOJI.calendar,
    icon: makeEmojiIcon(FEATURE_EMOJI.calendar),
    component: CalendarScreen,
  },
  {
    id: 'orders',
    label: 'অর্ডার',
    subtitle: 'সব চ্যানেল',
    category: 'sales',
    introducedIn: 2,
    emoji: FEATURE_EMOJI.orders,
    icon: makeEmojiIcon(FEATURE_EMOJI.orders),
    component: OrdersScreen,
  },
  {
    id: 'inventory',
    label: 'ইনভেন্টরি',
    subtitle: 'স্টক ইনফ্লো/আউটফ্লো',
    category: 'operations',
    introducedIn: 2,
    emoji: FEATURE_EMOJI.inventory,
    icon: makeEmojiIcon(FEATURE_EMOJI.inventory),
    component: InventoryScreen,
  },
  {
    id: 'courier',
    label: 'কুরিয়ার',
    subtitle: 'Pathao · RedX · Steadfast',
    category: 'operations',
    introducedIn: 2,
    emoji: FEATURE_EMOJI.courier,
    icon: makeEmojiIcon(FEATURE_EMOJI.courier),
    component: CourierScreen,
  },
  {
    id: 'website',
    label: 'ওয়েবসাইট',
    subtitle: 'ইন্টিগ্রেশন ও হোস্টিং',
    category: 'operations',
    introducedIn: 2,
    emoji: FEATURE_EMOJI.website,
    icon: makeEmojiIcon(FEATURE_EMOJI.website),
    component: WebsiteScreen,
  },
  {
    id: 'leads',
    label: 'লিড',
    subtitle: 'ক্যাপচার ও স্কোরিং',
    category: 'customers',
    introducedIn: 3,
    emoji: FEATURE_EMOJI.leads,
    icon: makeEmojiIcon(FEATURE_EMOJI.leads),
    component: LeadsScreen,
  },
  {
    id: 'dashboard',
    label: 'ড্যাশবোর্ড',
    subtitle: 'ইনসাইট ও বিশ্লেষণ',
    category: 'insights',
    introducedIn: 4,
    emoji: FEATURE_EMOJI.dashboard,
    icon: makeEmojiIcon(FEATURE_EMOJI.dashboard),
    component: DashboardScreen,
  },
  {
    id: 'reports',
    label: 'রিপোর্ট',
    subtitle: 'দৈনিক · সাপ্তাহিক · মাসিক',
    category: 'insights',
    introducedIn: 4,
    emoji: FEATURE_EMOJI.reports,
    icon: makeEmojiIcon(FEATURE_EMOJI.reports),
    component: ReportsScreen,
  },
  {
    id: 'complaints',
    label: 'অভিযোগ',
    subtitle: 'ট্র্যাকিং ও সমাধান',
    category: 'insights',
    introducedIn: 4,
    emoji: FEATURE_EMOJI.complaints,
    icon: makeEmojiIcon(FEATURE_EMOJI.complaints),
    component: ComplaintsScreen,
  },
];

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
      return ['bookkeeping', 'messages', 'comments'];
    case 2:
      return ['orders', 'inventory', 'courier'];
    case 3:
      return ['leads', 'messages', 'bookkeeping'];
    case 4:
      return ['dashboard', 'leads', 'bookkeeping'];
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

export function getFeaturesByCategory(
  tier: UserTier,
): { category: FeatureCategory; features: FeatureDef[] }[] {
  const accessible = getAccessibleFeatures(tier);
  return FEATURE_CATEGORY_ORDER.map((category) => ({
    category,
    features: accessible.filter((f) => f.category === category),
  })).filter((g) => g.features.length > 0);
}

export function getHubFeaturesByCategory(
  tier: UserTier,
): { category: FeatureCategory; features: FeatureDef[] }[] {
  const hub = getHubFeatures(tier);
  return FEATURE_CATEGORY_ORDER.map((category) => ({
    category,
    features: hub.filter((f) => f.category === category),
  })).filter((g) => g.features.length > 0);
}

export function isInPrimaryTabs(tier: UserTier, featureId: FeatureId): boolean {
  return getPrimaryTabIds(tier).includes(featureId);
}
