import { UserTier } from '../auth/AuthContext';

export interface Beneficiary {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  location: string;
  tier: UserTier;
  /** 0–100 MSME credit score */
  score: number;
  gradeLabel: string;
  gradeEmoji: string;
  /** Short insight for PO dashboard */
  insight: string;
  monthlyIncome: number;
  monthlyExpense: number;
  orderCount: number;
  leadCount: number;
  openComplaints: number;
}

/** Demo beneficiaries — aligned with MSME demo accounts */
export const seedBeneficiaries: Beneficiary[] = [
  {
    id: 'u1',
    name: 'রাহেলা বেগম',
    businessName: 'রাহেলা বুটিক হাউস',
    phone: '01700000000',
    location: 'মিরপুর ১০, ঢাকা',
    tier: 0,
    score: 62,
    gradeLabel: 'ভালো',
    gradeEmoji: '✅',
    insight: 'নিয়মিত হিসাব রাখছেন — স্টক ট্র্যাকিং বাড়ালে স্কোর উঠবে',
    monthlyIncome: 10300,
    monthlyExpense: 1250,
    orderCount: 0,
    leadCount: 0,
    openComplaints: 0,
  },
  {
    id: 'u2',
    name: 'মোঃ ফয়সাল',
    businessName: 'ফয়সাল ইলেকট্রনিক্স',
    phone: '01800000001',
    location: 'আগ্রাবাদ, চট্টগ্রাম',
    tier: 1,
    score: 71,
    gradeLabel: 'ভালো',
    gradeEmoji: '✅',
    insight: 'মেসেজ রিপ্লাই ভালো — অর্ডার কনফার্ম রেট বাড়ানো যায়',
    monthlyIncome: 10300,
    monthlyExpense: 1250,
    orderCount: 0,
    leadCount: 0,
    openComplaints: 0,
  },
  {
    id: 'u3',
    name: 'সুমাইয়া আক্তার',
    businessName: 'সুমাইয়া ফ্যাশন',
    phone: '01900000002',
    location: 'জিন্দাবাজার, সিলেট',
    tier: 2,
    score: 84,
    gradeLabel: 'উৎকৃষ্ট',
    gradeEmoji: '🌟',
    insight: 'অর্ডার ও ইনভেন্টরি ভালো — মডেল উপকারভোগী',
    monthlyIncome: 18500,
    monthlyExpense: 3200,
    orderCount: 5,
    leadCount: 0,
    openComplaints: 0,
  },
  {
    id: 'u4',
    name: 'করিম সাহেব',
    businessName: 'করিম এন্টারপ্রাইজ',
    phone: '01700000003',
    location: 'বোয়ালিয়া, রাজশাহী',
    tier: 3,
    score: 58,
    gradeLabel: 'মাঝারি',
    gradeEmoji: '📊',
    insight: 'লিড ফলো-আপ দুর্বল — ২টি হট লিড অপেক্ষমাণ',
    monthlyIncome: 22000,
    monthlyExpense: 4100,
    orderCount: 5,
    leadCount: 4,
    openComplaints: 1,
  },
  {
    id: 'u5',
    name: 'নাসরিন পারভিন',
    businessName: 'নাসরিন টেক্সটাইল',
    phone: '01800000004',
    location: 'ময়মনসিংহ',
    tier: 4,
    score: 89,
    gradeLabel: 'উৎকৃষ্ট',
    gradeEmoji: '🌟',
    insight: 'ড্যাশবোর্ড ও রিপোর্টিং শক্তিশালী — প্রসারের উপযুক্ত',
    monthlyIncome: 72000,
    monthlyExpense: 12000,
    orderCount: 5,
    leadCount: 4,
    openComplaints: 1,
  },
];

export function getBeneficiaryById(id: string): Beneficiary | undefined {
  return seedBeneficiaries.find((b) => b.id === id);
}
