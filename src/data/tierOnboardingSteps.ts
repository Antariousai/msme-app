import { UserTier } from '../auth/AuthContext';
import { FeatureId } from '../navigation/features';

/** All onboarding screen ids — tier-specific + shared */
export type OnboardingStepId =
  | 'welcome'
  | 'whatsNew'
  | 'loan'
  | 'credit'
  | 'tabs'
  | 'done'
  // Tier 0 — Offline
  | 't0_firstTransaction'
  | 't0_stockOptional'
  | 't0_ngoReport'
  // Tier 1 — Starter
  | 't1_connectChannels'
  | 't1_autoReply'
  | 't1_firstMessage'
  | 't1_bookkeepingLink'
  | 't1_calendar'
  // Tier 2 — Growth
  | 't2_orderPipeline'
  | 't2_inventoryLowStock'
  | 't2_courier'
  | 't2_websiteSoon'
  | 't2_bookkeepingHub'
  // Tier 3 — Pro
  | 't3_leadScore'
  | 't3_kanban'
  | 't3_followUp'
  | 't3_messagesLeads'
  | 't3_bookkeepingMargin'
  // Tier 4 — Enterprise
  | 't4_periodSummary'
  | 't4_bestWorst'
  | 't4_peakHours'
  | 't4_complaints'
  | 't4_leadsScale'
  | 't4_reportsExport';

export interface OnboardingStepContent {
  emoji: string;
  title: string;
  body: string;
  bullets?: string[];
  /** Optional feature to open from this step's primary CTA */
  featureId?: FeatureId;
  bookkeepingAction?: 'income' | 'expense';
  ctaLabel?: string;
  secondaryLabel?: string;
}

export const ONBOARDING_STEP_CONTENT: Partial<Record<OnboardingStepId, OnboardingStepContent>> = {
  welcome: { emoji: '👋', title: '', body: '' },
  whatsNew: { emoji: '🆕', title: 'নতুন যা যুক্ত হয়েছে', body: '' },

  t0_firstTransaction: {
    emoji: '💰',
    title: 'প্রথম লেনদেন লিখুন',
    body: 'আজকের একটি বিক্রয় বা খরচ যোগ করলেই মোট লাভের হিসাব শুরু হবে। সোশ্যাল মিডিয়া লাগবে না — শুধু হিসাব।',
    bullets: ['➕ আয় = বিক্রি বা অন্য আয়', '➖ খরচ = কাঁচামাল, ভাড়া, পরিবহন'],
    featureId: 'bookkeeping',
    bookkeepingAction: 'income',
    ctaLabel: '➕ আয় যোগ করুন',
    secondaryLabel: '➖ খরচ যোগ করুন',
  },
  t0_stockOptional: {
    emoji: '📦',
    title: 'পণ্য মজুদ আছে?',
    body: 'যাদের স্টক থাকে তারা মজুদ ট্যাবে পণ্য যোগ করতে পারেন। না থাকলে এড়িয়ে যান।',
    featureId: 'inventory',
    ctaLabel: 'মজুদ সেটআপ করুন',
    secondaryLabel: 'এখন নয় — এগিয়ে যান',
  },
  t0_ngoReport: {
    emoji: '📤',
    title: 'এনজিও রিপোর্ট',
    body: 'প্রোগ্রাম অফিসার বা এনজিও-তে মাসিক হিসাব পাঠাতে চান? হিসাব ট্যাবে রিপোর্ট এক্সপোর্ট করা যায়।',
    bullets: ['মোট আয় ও ব্যয় সারাংশ', 'শেয়ার বা ডাউনলোড'],
    featureId: 'bookkeeping',
    ctaLabel: 'হিসাব দেখুন',
    secondaryLabel: 'পরে করব',
  },

  t1_connectChannels: {
    emoji: '🔗',
    title: 'Facebook + Instagram এক জায়গায়',
    body: 'দুই চ্যানেলের মেসেজ এক ইনবক্সে — আলাদা অ্যাপ খুলতে হবে না। (ডেমো: সংযোগ সিমুলেটেড)',
    bullets: ['👍 Facebook পেজ', '📸 Instagram DM'],
  },
  t1_autoReply: {
    emoji: '🤖',
    title: 'অটো রিপ্লাই',
    body: 'দাম, সাইজ, ডেলিভারি — সাধারণ প্রশ্নে টেমপ্লেট উত্তর পাঠান। চালু রাখলে রাতেও গ্রাহক উত্তর পায়।',
    bullets: ['টেমপ্লেট কাস্টমাইজ', 'জটিল প্রশ্ন ম্যানুয়াল'],
  },
  t1_firstMessage: {
    emoji: '💬',
    title: 'অপেক্ষমাণ মেসেজ',
    body: 'নতুন ও অনুমোদন অপেক্ষমাণ মেসেজ দেখুন — উত্তর দিন বা অর্ডার কনফার্ম করুন।',
    featureId: 'messages',
    ctaLabel: 'মেসেজ ইনবক্স খুলুন',
  },
  t1_bookkeepingLink: {
    emoji: '📝',
    title: 'বিক্রি হলে আয় লিখুন',
    body: 'অর্ডার কনফার্ম বা ডেলিভারি দেওয়ার পর ➕ আয় যোগ করলে লাভের হিসাব ঠিক থাকে।',
    featureId: 'bookkeeping',
    bookkeepingAction: 'income',
    ctaLabel: '➕ আয় যোগ করুন',
  },
  t1_calendar: {
    emoji: '📅',
    title: 'বাজার ও ফলো-আপ',
    body: 'বাজারের দিন, মেলা বা গ্রাহক ফলো-আপ ক্যালেন্ডারে রাখুন।',
    featureId: 'calendar',
    ctaLabel: 'ক্যালেন্ডার দেখুন',
    secondaryLabel: 'পরে সেট করব',
  },

  t2_orderPipeline: {
    emoji: '📋',
    title: 'অর্ডার পাইপলাইন',
    body: 'অপেক্ষমাণ → কনফার্ম → পাঠানো → ডেলিভার্ড — সব চ্যানেলের অর্ডার এক তালিকায়।',
    bullets: ['ফেসবুক · ইনস্টাগ্রাম · ওয়েবসাইট', 'ফিল্টার: স্ট্যাটাস, চ্যানেল, ক্যাটাগরি'],
    featureId: 'orders',
    ctaLabel: 'অর্ডার তালিকা খুলুন',
  },
  t2_inventoryLowStock: {
    emoji: '⚠️',
    title: 'কম স্টক সতর্কতা',
    body: 'হোমে কম স্টক সতর্কতা দেখা যায়। মজুদ ট্যাবে পণ্য যোগ ও আপডেট করুন।',
    featureId: 'inventory',
    ctaLabel: 'মজুদ দেখুন',
  },
  t2_courier: {
    emoji: '🛵',
    title: 'কুরিয়ার ট্র্যাকিং',
    body: 'Pathao, RedX, Steadfast — অর্ডার আইডি দিয়ে ট্র্যাকিং স্ট্যাটাস দেখুন।',
    featureId: 'courier',
    ctaLabel: 'কুরিয়ার ট্র্যাকিং',
  },
  t2_websiteSoon: {
    emoji: '🌐',
    title: 'ওয়েবসাইট ইন্টিগ্রেশন',
    body: 'ওয়েব থেকে অর্ডার দেখা যায়। সম্পূর্ণ সাইট বিল্ডার শীঘ্রই আসছে — এখন অর্ডার ও হাব টুলস ব্যবহার করুন।',
    bullets: ['ওয়েব অর্ডার তালিকায়', 'ব্র্যান্ড স্টুডিও (সেটিংস)'],
  },
  t2_bookkeepingHub: {
    emoji: '📝',
    title: 'হিসাব কোথায়?',
    body: 'গ্রোথ প্যাকেজে হিসাব নিচের ট্যাব বারে নেই — অ্যাকাউন্ট বা হোমের ➕ আয় / ➖ খরচ থেকে খুলুন।',
    featureId: 'bookkeeping',
    ctaLabel: 'হিসাব রক্ষা খুলুন',
  },

  t3_leadScore: {
    emoji: '🔥',
    title: 'লিড স্কোর ০–১০০',
    body: 'স্কোর ৭০+ = হট লিড — আগে ফলো-আপ করুন। স্কোর উৎস, যোগাযোগ ও পর্যায় মিলিয়ে গণনা হয়।',
    bullets: ['৯০+ = অতি জরুরি', '৫০–৬৯ = nurture'],
  },
  t3_kanban: {
    emoji: '📌',
    title: 'কানবান পাইপলাইন',
    body: 'নতুন → যোগাযোগ → যোগ্য → রূপান্তর → হারানো — কার্ড টেনে বা মেনু থেকে স্টেজ বদলান।',
    bullets: ['মোবাইল: অ্যাকর্ডিয়ন', 'ওয়াইড: কানবান বোর্ড'],
    featureId: 'leads',
    ctaLabel: 'লিড বোর্ড খুলুন',
  },
  t3_followUp: {
    emoji: '📞',
    title: 'আজকের ফলো-আপ',
    body: 'আয়েশা সিদ্দিকা (স্কোর ৯২) — আজ কল করলে রূপান্তর সম্ভাবনা বেশি। হট লিডে এক ট্যাপে কল।',
    featureId: 'leads',
    ctaLabel: 'হট লিড দেখুন',
  },
  t3_messagesLeads: {
    emoji: '💬',
    title: 'ইনবক্স থেকে লিড',
    body: 'মেসেজ থেকে গ্রাহক চিহ্নিত করে লিড তৈরি ও স্কোর আপডেট করুন — CRM ও ইনবক্স একসাথে।',
    bullets: ['মেসেজ ট্যাব', 'লিড ট্যাব'],
  },
  t3_bookkeepingMargin: {
    emoji: '📊',
    title: 'লাভ মার্জিন',
    body: 'ঋণ পরিশোধের ক্ষমতা দেখাতে মোট লাভ ও হিসাব নিয়মিত আপডেট রাখুন — ক্রেডিট স্কোরে প্রভাব পড়ে।',
    featureId: 'bookkeeping',
    ctaLabel: 'হিসাব দেখুন',
  },

  t4_periodSummary: {
    emoji: '📊',
    title: 'পিরিয়ড সারাংশ',
    body: 'দৈনিক, সাপ্তাহিক, মাসিক — চিপ বদলে আয়, অর্ডার ও মেসেজ এক নজরে।',
    featureId: 'dashboard',
    ctaLabel: 'ড্যাশবোর্ড খুলুন',
  },
  t4_bestWorst: {
    emoji: '🏆',
    title: 'বেস্ট ও ওয়ার্স সেলার',
    body: 'কোন পণ্য বেশি বিক্রি, কোনটি কম — স্টক ও মার্কেটিং সিদ্ধান্ত নিন।',
    bullets: ['বেস্ট সেলার ইউনিট', 'ওয়ার্স সেলার কমাইতে অ্যাকশন'],
  },
  t4_peakHours: {
    emoji: '⏰',
    title: 'পিক আওয়ার',
    body: 'কোন সময়ে বেশি অর্ডার — স্টাফ ও বিজ্ঞাপন সেই সময়ে চালু রাখুন।',
    featureId: 'dashboard',
    ctaLabel: 'বিশ্লেষণ দেখুন',
  },
  t4_complaints: {
    emoji: '⚠️',
    title: 'অভিযোগ ট্র্যাকিং',
    body: 'খোলা, চলমান, সমাধান — সেবার মান ক্রেডিট স্কোরে যায়।',
    featureId: 'complaints',
    ctaLabel: 'অভিযোগ তালিকা',
  },
  t4_leadsScale: {
    emoji: '🎯',
    title: 'লিড ক্লোজিং সাপোর্ট',
    body: 'হট লিড অপেক্ষমাণ — AI পরামর্শ ও লিড বোর্ড দিয়ে ফলো-আপ করুন।',
    featureId: 'leads',
    ctaLabel: 'লিড দেখুন',
  },
  t4_reportsExport: {
    emoji: '📄',
    title: 'রিপোর্ট এক্সপোর্ট',
    body: 'ব্যবসা সারাংশ ও ক্রেডিট স্কোর (ঋণ থাকলে) ডাউনলোড/শেয়ার — টায়ার ৩+ এ সম্পূর্ণ রিপোর্ট।',
    bullets: ['ড্যাশবোর্ড রিপোর্ট', 'অ্যাকাউন্ট → ক্রেডিট স্কোর'],
    featureId: 'reports',
    ctaLabel: 'রিপোর্ট দেখুন',
    secondaryLabel: 'পরে',
  },

  loan: { emoji: '🏦', title: 'ব্যবসায়িক ঋণ', body: '' },
  credit: { emoji: '📈', title: 'ক্রেডিট স্কোর', body: '' },
  tabs: { emoji: '🧭', title: 'নিচের ট্যাব বার', body: '' },
  done: { emoji: '🎉', title: 'সব প্রস্তুত!', body: '' },
};

/** Full first-time onboarding per tier (spec order) */
export const FULL_ONBOARDING_FLOW: Record<UserTier, OnboardingStepId[]> = {
  0: ['welcome', 't0_firstTransaction', 't0_stockOptional', 't0_ngoReport', 'loan', 'credit', 'tabs', 'done'],
  1: [
    'welcome',
    't1_connectChannels',
    't1_autoReply',
    't1_firstMessage',
    't1_bookkeepingLink',
    't1_calendar',
    'loan',
    'credit',
    'tabs',
    'done',
  ],
  2: [
    'welcome',
    't2_orderPipeline',
    't2_inventoryLowStock',
    't2_courier',
    't2_websiteSoon',
    't2_bookkeepingHub',
    'loan',
    'credit',
    'tabs',
    'done',
  ],
  3: [
    'welcome',
    't3_leadScore',
    't3_kanban',
    't3_followUp',
    't3_messagesLeads',
    't3_bookkeepingMargin',
    'loan',
    'credit',
    'tabs',
    'done',
  ],
  4: [
    'welcome',
    't4_periodSummary',
    't4_bestWorst',
    't4_peakHours',
    't4_complaints',
    't4_leadsScale',
    't4_reportsExport',
    'loan',
    'credit',
    'tabs',
    'done',
  ],
};

/** Short upgrade path when user already onboarded a lower tier (2–3 thematic screens + done) */
export const UPGRADE_ONBOARDING_FLOW: Record<UserTier, OnboardingStepId[]> = {
  0: FULL_ONBOARDING_FLOW[0],
  1: ['whatsNew', 't1_connectChannels', 't1_autoReply', 'tabs', 'done'],
  2: ['whatsNew', 't2_orderPipeline', 't2_inventoryLowStock', 'tabs', 'done'],
  3: ['whatsNew', 't3_leadScore', 't3_kanban', 'tabs', 'done'],
  4: ['whatsNew', 't4_periodSummary', 't4_complaints', 'tabs', 'done'],
};

export function resolveOnboardingSteps(
  tier: UserTier,
  isUpgrade: boolean,
  loanAlreadySet: boolean,
  includeCredit: boolean,
): OnboardingStepId[] {
  const base = isUpgrade && tier > 0 ? UPGRADE_ONBOARDING_FLOW[tier] : FULL_ONBOARDING_FLOW[tier];
  return base.filter((id) => {
    if (id === 'loan' && loanAlreadySet) return false;
    if (id === 'credit' && !includeCredit) return false;
    return true;
  });
}
