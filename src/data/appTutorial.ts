import { UserTier } from '../auth/AuthContext';
import { FeatureId, getFeatureById, getPrimaryTabIds } from '../navigation/features';

export type TutorialTarget = 'home' | 'account' | FeatureId;

export interface AppTutorialStep {
  id: string;
  emoji: string;
  title: string;
  body: string;
  bullets?: string[];
  target: TutorialTarget;
  /** Shown on coach card — what user will see on that screen */
  screenPreview?: string;
}

const homeStep = (tier: UserTier): AppTutorialStep => {
  const previews: Record<UserTier, string> = {
    0: 'আজকের আয়-খরচ, ➕ আয় / ➖ খরচ, দ্রুত লিঙ্ক',
    1: 'মেসেজ সারাংশ, AI টিপস, আয়-খরচ বাটন',
    2: 'সক্রিয় অর্ডার, স্টক সতর্কতা, AI পরামর্শ',
    3: 'লিড সারাংশ, হট লিড, ক্লোজিং টিপ',
    4: 'এন্টারপ্রাইজ সারাংশ, পিরিয়ড, লিড সাপোর্ট',
  };
  return {
    id: 'home',
    emoji: '🏠',
    title: 'হোম ড্যাশবোর্ড',
    body: 'প্রতিদিন এখান থেকে শুরু করুন — সারাংশ ও দ্রুত কাজ এক জায়গায়।',
    screenPreview: previews[tier],
    target: 'home',
  };
};

const accountStep: AppTutorialStep = {
  id: 'account',
  emoji: '👤',
  title: 'অ্যাকাউন্ট',
  body: 'প্রোফাইল, সেটিংস, ঋণ তথ্য, সব ফিচার লিস্ট ও সাইন আউট।',
  screenPreview: 'সেটিংস · প্যাকেজ · ব্যবসায়িক ঋণ',
  target: 'account',
};

function featureStep(
  id: FeatureId,
  emoji: string,
  title: string,
  body: string,
  bullets?: string[],
  screenPreview?: string,
): AppTutorialStep {
  return { id, emoji, title, body, bullets, screenPreview, target: id };
}

const TIER_TUTORIAL_BODY: Record<UserTier, AppTutorialStep[]> = {
  0: [
    homeStep(0),
    featureStep(
      'bookkeeping',
      '📝',
      'হিসাব রক্ষা',
      'আয়-খরচ লিখুন, মোট লাভ দেখুন, এনজিও রিপোর্ট পাঠান।',
      ['লেনদেন তালিকা', 'সরল স্টক (টায়ার ০)'],
      'স্ট্যাট কার্ড · লেনদেন · রিপোর্ট',
    ),
    featureStep(
      'inventory',
      '📦',
      'পণ্য মজুদ',
      'পণ্য যোগ করুন, স্টক আপডেট করুন।',
      ['ক্যাটাগরি ফিল্টার', 'স্টক ইনফ্লো'],
      'তালিকা · কম স্টক সতর্কতা',
    ),
    accountStep,
  ],
  1: [
    homeStep(1),
    featureStep(
      'messages',
      '💬',
      'মেসেজ ইনবক্স',
      'Facebook ও Instagram মেসেজ এক জায়গায়।',
      ['অটো রিপ্লাই', 'অনুমোদন অপেক্ষমাণ'],
      'ইনবক্স · স্ট্যাটাস ফিল্টার',
    ),
    featureStep(
      'comments',
      '💭',
      'কমেন্ট',
      'পোস্টের মন্তব্য দেখুন ও উত্তর দিন।',
      undefined,
      'প্ল্যাটফর্ম ফিল্টার',
    ),
    featureStep(
      'bookkeeping',
      '📝',
      'হিসাব রক্ষা',
      'বিক্রির পর ➕ আয় যোগ করুন — লাভ ট্র্যাক রাখুন।',
      ['জার্নাল · বিশ্লেষণ (টায়ার ১+)'],
      'আয়-ব্যয় · ক্যালেন্ডার লিঙ্ক',
    ),
    featureStep(
      'calendar',
      '📅',
      'ক্যালেন্ডার',
      'বাজার, মেলা, ফলো-আপ ইভেন্ট।',
      undefined,
      'মাস ভিউ · ইভেন্ট ট্যাপ',
    ),
    accountStep,
  ],
  2: [
    homeStep(2),
    featureStep(
      'orders',
      '📋',
      'অর্ডার',
      'সব চ্যানেলের অর্ডার — স্ট্যাটাস ও ফিল্টার।',
      ['অপেক্ষমাণ → কনফার্ম → শিপ'],
      'তালিকা · এক্সপ্যান্ড ডিটেইল',
    ),
    featureStep(
      'inventory',
      '📦',
      'মজুদ',
      'স্টক ট্র্যাক, কম স্টক সতর্কতা।',
      undefined,
      'ক্যাটাগরি · স্টক যোগ',
    ),
    featureStep(
      'courier',
      '🛵',
      'কুরিয়ার',
      'Pathao, RedX, Steadfast ট্র্যাকিং।',
      undefined,
      'ট্র্যাকিং আইডি · স্ট্যাটাস',
    ),
    featureStep(
      'bookkeeping',
      '📝',
      'হিসাব (হাব)',
      'ট্যাব বারে নেই — হোমের ➕ আয়/খরচ বা অ্যাকাউন্ট হাব থেকে খুলুন।',
      undefined,
      'মোডাল/হাব থেকে খোলা',
    ),
    accountStep,
  ],
  3: [
    homeStep(3),
    featureStep(
      'leads',
      '🎯',
      'লিড ও CRM',
      'স্কোর, কানবান, স্টেজ পরিবর্তন, কল।',
      ['হট লিড ৭০+', 'AI ক্লোজিং'],
      'কানবান · মোবাইল অ্যাকর্ডিয়ন',
    ),
    featureStep(
      'messages',
      '💬',
      'মেসেজ',
      'ইনবক্স থেকে গ্রাহক ধরে রাখুন।',
      undefined,
      'FB + IG একত্র',
    ),
    featureStep(
      'bookkeeping',
      '📝',
      'হিসাব',
      'মার্জিন ও লাভ — ঋণ স্কোরের জন্য গুরুত্বপূর্ণ।',
      undefined,
      'লাভ · জার্নাল',
    ),
    accountStep,
  ],
  4: [
    homeStep(4),
    featureStep(
      'dashboard',
      '📊',
      'ড্যাশবোর্ড',
      'দৈনিক/সাপ্তাহিক/মাসিক, বেস্ট-ওয়ার্স, পিক আওয়ার।',
      ['পিরিয়ড চিপ', 'রিপোর্ট এক্সপোর্ট'],
      'ইনসাইট চার্ট',
    ),
    featureStep(
      'leads',
      '🎯',
      'লিড',
      'স্কেলে ফলো-আপ ও ক্লোজিং সাপোর্ট।',
      undefined,
      'হট লিড · কানবান',
    ),
    featureStep(
      'complaints',
      '⚠️',
      'অভিযোগ',
      'খোলা/চলমান/সমাধান — সেবার মান।',
      undefined,
      'টিকিট তালিকা',
    ),
    featureStep(
      'bookkeeping',
      '📝',
      'হিসাব ও রিপোর্ট',
      'লাভ ট্র্যাক ও ব্যবসা রিপোর্ট শেয়ার।',
      undefined,
      'এক্সপোর্ট বাটন',
    ),
    accountStep,
  ],
};

/** Shorter tutorial when upgrading tier */
const UPGRADE_TUTORIAL_EXTRA: Partial<Record<UserTier, AppTutorialStep[]>> = {
  1: [
    featureStep('messages', '💬', 'নতুন: মেসেজ', 'সোশ্যাল ইনবক্স এখন সক্রিয়।', undefined, 'অপেক্ষমাণ মেসেজ'),
    featureStep('comments', '💭', 'নতুন: কমেন্ট', 'পোস্ট মডারেশন।', undefined, 'কমেন্ট তালিকা'),
  ],
  2: [
    featureStep('orders', '📋', 'নতুন: অর্ডার', 'মাল্টি-চ্যানেল অর্ডার।', undefined, 'ফিল্টার'),
    featureStep('courier', '🛵', 'নতুন: কুরিয়ার', 'ডেলিভারি ট্র্যাক।', undefined, 'ট্র্যাকিং'),
  ],
  3: [
    featureStep('leads', '🎯', 'নতুন: লিড', 'CRM ও স্কোরিং।', undefined, 'কানবান'),
  ],
  4: [
    featureStep('dashboard', '📊', 'নতুন: ড্যাশবোর্ড', 'বিশ্লেষণ কেন্দ্র।', undefined, 'পিরিয়ড সারাংশ'),
    featureStep('complaints', '⚠️', 'নতুন: অভিযোগ', 'সেবা ট্র্যাকিং।', undefined, 'স্ট্যাটাস'),
  ],
};

export function getAppTutorialSteps(tier: UserTier, isUpgrade: boolean): AppTutorialStep[] {
  if (isUpgrade && tier > 0 && UPGRADE_TUTORIAL_EXTRA[tier]) {
    return [homeStep(tier), ...UPGRADE_TUTORIAL_EXTRA[tier]!, accountStep];
  }
  return TIER_TUTORIAL_BODY[tier];
}

export function getTutorialTargetLabel(target: TutorialTarget, tier: UserTier): string {
  if (target === 'home') return 'হোম';
  if (target === 'account') return 'অ্যাকাউন্ট';
  const feat = getFeatureById(target);
  return feat?.label ?? target;
}

/** Tab order hint for tutorial progress */
export function getTutorialTabOrder(tier: UserTier): TutorialTarget[] {
  const tabs = getPrimaryTabIds(tier);
  return ['home', ...tabs, 'account'];
}
