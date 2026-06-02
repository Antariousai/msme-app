import { UserTier } from '../auth/AuthContext';
import { FeatureId } from '../navigation/features';

export interface TabTourItem {
  emoji: string;
  label: string;
  hint: string;
}

export interface FirstWinAction {
  featureId: FeatureId;
  ctaLabel: string;
  title: string;
  description: string;
  bookkeepingAction?: 'income' | 'expense';
}

export interface TierOnboardingConfig {
  emoji: string;
  title: string;
  subtitle: string;
  persona: string;
  highlights: string[];
  upgradeTitle: string;
  upgradeSubtitle: string;
  whatsNew: string[];
  firstWin: FirstWinAction;
  tabTour: TabTourItem[];
  creditHint: string;
  doneWithoutLoan: string;
  doneWithLoan: string;
}

export const TIER_ONBOARDING: Record<UserTier, TierOnboardingConfig> = {
  0: {
    emoji: '📝',
    title: 'অফলাইন প্যাকেজে স্বাগতম',
    subtitle: 'ছোট ব্যবসার জন্য সহজ হিসাব রক্ষা',
    persona: 'বাজার, হাতে-কলমে বিক্রি বা এনজিও-সহায়তাপ্রাপ্ত উদ্যোক্তা',
    highlights: [
      'দৈনিক আয় ও খরচ লিখুন',
      'মোট লাভ এক নজরে দেখুন',
      'পণ্য মজুদ ট্র্যাক করুন',
      'এনজিও রিপোর্ট পাঠান',
    ],
    upgradeTitle: 'অফলাইন টুলস প্রস্তুত',
    upgradeSubtitle: 'হিসাব ও মজুদ এখন এক অ্যাপে',
    whatsNew: ['হোম থেকে দ্রুত আয়/খরচ', 'মজুদ ট্যাব', 'সরল স্টক তালিকা'],
    firstWin: {
      featureId: 'bookkeeping',
      ctaLabel: '➕ প্রথম আয় লিখুন',
      title: 'প্রথম লেনদেন লিখুন',
      description: 'আজকের একটি বিক্রয় বা খরচ যোগ করলেই লাভের হিসাব শুরু হবে।',
      bookkeepingAction: 'income',
    },
    tabTour: [
      { emoji: '🏠', label: 'হোম', hint: 'আজকের সারাংশ ও দ্রুত আয়/খরচ' },
      { emoji: '📝', label: 'হিসাব', hint: 'লেনদেন তালিকা ও এনজিও রিপোর্ট' },
      { emoji: '📦', label: 'মজুদ', hint: 'পণ্য ও স্টক আপডেট' },
      { emoji: '👤', label: 'অ্যাকাউন্ট', hint: 'সেটিংস ও সরঞ্জাম' },
    ],
    creditHint: 'মাইক্রোঋণ বা এনজিও ঋণ থাকলে স্কোর প্রোগ্রাম অফিসারের কাছে প্রমাণ হিসেবে কাজে লাগতে পারে।',
    doneWithoutLoan: 'হোম থেকে আয়-খরচ লিখতে শুরু করুন। পরে ঋণ নিলে সেটিংসে যোগ করুন।',
    doneWithLoan: 'ড্যাশবোর্ডের উপরে ক্রেডিট স্কোর দেখা যাবে। নিয়মিত হিসাব রাখলে স্কোর উন্নত হয়।',
  },
  1: {
    emoji: '💬',
    title: 'স্টার্টার প্যাকেজে স্বাগতম',
    subtitle: 'সোশ্যাল মিডিয়া থেকে বিক্রি শুরু করুন',
    persona: 'Facebook/Instagram থেকে বিক্রি করা বুটিক বা অনলাইন দোকান',
    highlights: [
      'Facebook ও Instagram মেসেজ',
      'অটো রিপ্লাই ও কমেন্ট',
      'অর্ডার কনফার্ম করুন',
      'হিসাব + ক্যালেন্ডার',
    ],
    upgradeTitle: 'সোশ্যাল কমার্স চালু',
    upgradeSubtitle: 'ইনবক্স ও বিক্রি এক জায়গায়',
    whatsNew: ['মেসেজ ট্যাব', 'কমেন্ট মডারেশন', 'অটো রিপ্লাই', 'বাজার ক্যালেন্ডার'],
    firstWin: {
      featureId: 'messages',
      ctaLabel: '💬 মেসেজ দেখুন',
      title: 'অপেক্ষমাণ মেসেজ দেখুন',
      description: 'নতুন গ্রাহকের প্রশ্নের উত্তর দিন বা অর্ডার কনফার্ম করুন।',
    },
    tabTour: [
      { emoji: '🏠', label: 'হোম', hint: 'মেসেজ সারাংশ ও AI টিপস' },
      { emoji: '📝', label: 'হিসাব', hint: 'বিক্রির পর আয় লিখুন' },
      { emoji: '💬', label: 'মেসেজ', hint: 'FB + IG ইনবক্স' },
      { emoji: '💭', label: 'কমেন্ট', hint: 'পোস্টের মন্তব্য পরিচালনা' },
      { emoji: '👤', label: 'অ্যাকাউন্ট', hint: 'সব ফিচার ও সেটিংস' },
    ],
    creditHint: 'ঋণ পরিশোধের ক্ষমতা দেখাতে হিসাব ও বিক্রি ডেটা স্কোরে যুক্ত হয়।',
    doneWithoutLoan: 'মেসেজ ট্যাব থেকে গ্রাহকের সাথে যোগাযোগ শুরু করুন।',
    doneWithLoan: 'ক্রেডিট স্কোর হোমে দেখা যাবে — বিক্রি ও হিসাব মিলিয়ে উন্নতি করুন।',
  },
  2: {
    emoji: '📦',
    title: 'গ্রোথ প্যাকেজে স্বাগতম',
    subtitle: 'অর্ডার, স্টক ও ডেলিভারি একসাথে',
    persona: 'মাল্টি-চ্যানেল বিক্রি ও কুরিয়ার ব্যবহারকারী দোকান',
    highlights: [
      'মাল্টি-চ্যানেল অর্ডার',
      'ইনভেন্টরি ও কম স্টক সতর্কতা',
      'কুরিয়ার ট্র্যাকিং',
      'ওয়েবসাইট ইন্টিগ্রেশন',
    ],
    upgradeTitle: 'অপারেশন স্কেল আপ',
    upgradeSubtitle: 'অর্ডার, স্টক ও ডেলিভারি যুক্ত হয়েছে',
    whatsNew: ['অর্ডার ট্যাব ও ফিল্টার', 'ইনভেন্টরি সতর্কতা', 'কুরিয়ার ট্র্যাকিং', 'হিসাব হাব থেকে'],
    firstWin: {
      featureId: 'orders',
      ctaLabel: '📋 অর্ডার দেখুন',
      title: 'অপেক্ষমাণ অর্ডার কনফার্ম করুন',
      description: 'ফেসবুক, ইনস্টাগ্রাম বা ওয়েব থেকে আসা অর্ডার এক তালিকায় দেখুন।',
    },
    tabTour: [
      { emoji: '🏠', label: 'হোম', hint: 'সক্রিয় অর্ডার ও স্টক সতর্কতা' },
      { emoji: '📋', label: 'অর্ডার', hint: 'স্ট্যাটাস ও ফিল্টার' },
      { emoji: '📦', label: 'মজুদ', hint: 'স্টক ইন/আউট' },
      { emoji: '🛵', label: 'কুরিয়ার', hint: 'ট্র্যাকিং আইডি' },
      { emoji: '👤', label: 'অ্যাকাউন্ট', hint: 'হিসাব ও অন্যান্য টুল' },
    ],
    creditHint: 'স্টক ও অর্ডার পূরণ হার স্কোরে প্রভাব ফেলে — ঋণদাতার কাছে বিশ্বাসযোগ্যতা বাড়ায়।',
    doneWithoutLoan: 'অর্ডার ট্যাব দিয়ে আজকের বিক্রি প্রসেস করুন।',
    doneWithLoan: 'হোমে স্কোর + অর্ডার মিলিয়ে ব্যবসা পরিচালনা করুন।',
  },
  3: {
    emoji: '🎯',
    title: 'প্রো প্যাকেজে স্বাগতম',
    subtitle: 'লিড ধরে রাখুন, বিক্রি বাড়ান',
    persona: 'লিড ও ফলো-আপ-চালিত বিক্রি টিম বা মালিক',
    highlights: [
      'লিড স্কোরিং ও কানবান',
      'গ্রাহক ফলো-আপ',
      'CRM পাইপলাইন',
      'AI ক্লোজিং পরামর্শ',
    ],
    upgradeTitle: 'CRM ও লিড স্কোরিং',
    upgradeSubtitle: 'গ্রাহক পাইপলাইন এখন সক্রিয়',
    whatsNew: ['কানবান লিড বোর্ড', 'লিড স্কোর', 'হট লিড AI টিপ', 'মেসেজ + হিসাব একসাথে'],
    firstWin: {
      featureId: 'leads',
      ctaLabel: '🎯 লিড বোর্ড খুলুন',
      title: 'সবচেয়ে গরম লিডে ফলো-আপ',
      description: 'স্কোর ৭০+ লিডে কল বা স্টেজ পরিবর্তন করে রূপান্তর বাড়ান।',
    },
    tabTour: [
      { emoji: '🏠', label: 'হোম', hint: 'লিড সারাংশ ও ক্লোজিং টিপ' },
      { emoji: '🎯', label: 'লিড', hint: 'কানবান ও স্কোর' },
      { emoji: '💬', label: 'মেসেজ', hint: 'ইনবক্স থেকে লিড ধরুন' },
      { emoji: '📝', label: 'হিসাব', hint: 'মার্জিন ও লাভ ট্র্যাক' },
      { emoji: '👤', label: 'অ্যাকাউন্ট', hint: 'ক্রেডিট স্কোর (ঋণ থাকলে)' },
    ],
    creditHint: 'লিড রূপান্তর ও লাভ মার্জিন ঋণ স্কোরিংয়ে গুরুত্ব পায়।',
    doneWithoutLoan: 'লিড বোর্ডে আজকের ফলো-আপ শুরু করুন।',
    doneWithLoan: 'হোমের স্কোর দেখে লিড ও হিসাব একসাথে ম্যানেজ করুন।',
  },
  4: {
    emoji: '📊',
    title: 'এন্টারপ্রাইজ প্যাকেজে স্বাগতম',
    subtitle: 'ডেটা-চালিত সিদ্ধান্ত নিন',
    persona: 'সাপ্তাহিক রিপোর্ট ও টিম দিয়ে চালানো প্রতিষ্ঠান',
    highlights: [
      'দৈনিক/সাপ্তাহিক/মাসিক ইনসাইট',
      'বেস্ট ও ওয়ার্স সেলার',
      'পিক আওয়ার বিশ্লেষণ',
      'অভিযোগ ট্র্যাকিং',
    ],
    upgradeTitle: 'বিশ্লেষণ ড্যাশবোর্ড',
    upgradeSubtitle: 'ইনসাইট, রিপোর্ট ও অভিযোগ যুক্ত',
    whatsNew: ['ড্যাশবোর্ড ট্যাব', 'পিরিয়ড সারাংশ', 'পিক আওয়ার', 'অভিযোগ ও রিপোর্ট'],
    firstWin: {
      featureId: 'dashboard',
      ctaLabel: '📊 ড্যাশবোর্ড দেখুন',
      title: 'আজকের সারাংশ দেখুন',
      description: 'দৈনিক আয়, অর্ডার, পিক আওয়ার ও বেস্ট সেলার এক নজরে।',
    },
    tabTour: [
      { emoji: '🏠', label: 'হোম', hint: 'এন্টারপ্রাইজ সারাংশ' },
      { emoji: '📊', label: 'ড্যাশবোর্ড', hint: 'পিরিয়ড ও বিশ্লেষণ' },
      { emoji: '🎯', label: 'লিড', hint: 'ক্লোজিং সাপোর্ট' },
      { emoji: '📝', label: 'হিসাব', hint: 'লাভ ও রিপোর্ট' },
      { emoji: '👤', label: 'অ্যাকাউন্ট', hint: 'রিপোর্ট এক্সপোর্ট' },
    ],
    creditHint: 'ব্যাংক/ঋণদাতার জন্য স্কোর + রিপোর্ট এক্সপোর্ট (টায়ার ৩+)।',
    doneWithoutLoan: 'ড্যাশবোর্ড ট্যাবে সাপ্তাহিক পর্যালোচনা শুরু করুন।',
    doneWithLoan: 'হোমের ক্রেডিট স্কোর + ড্যাশবোর্ড দিয়ে ঋণ ও ব্যবসা ট্র্যাক করুন।',
  },
};
