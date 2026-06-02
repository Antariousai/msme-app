import { Beneficiary } from '../data/beneficiaries';
import { BusinessCreditProfile } from './creditScore';
import { bnTaka, toBn } from './helpers';

export function buildBeneficiaryAnalyticsProfile(b: Beneficiary): BusinessCreditProfile {
  const profit = b.monthlyIncome - b.monthlyExpense;
  const marginPct = b.monthlyIncome > 0 ? (profit / b.monthlyIncome) * 100 : 0;

  return {
    score: b.score,
    grade: b.score >= 80 ? 'excellent' : b.score >= 60 ? 'good' : b.score >= 40 ? 'fair' : 'needs_work',
    gradeLabel: b.gradeLabel,
    gradeEmoji: b.gradeEmoji,
    summary: b.insight,
    factors: [
      {
        id: 'cash',
        label: 'নগদ প্রবাহ',
        emoji: '💵',
        points: Math.min(100, Math.round(marginPct * 2.5)),
        weight: 0.25,
        detail: `মাসিক আয় ${bnTaka(b.monthlyIncome)} · ব্যয় ${bnTaka(b.monthlyExpense)}`,
        tip: marginPct < 15 ? 'খরচ কমিয়ে মার্জিন বাড়ান' : undefined,
      },
      {
        id: 'orders',
        label: 'অর্ডার পূরণ',
        emoji: '📦',
        points: Math.min(100, b.orderCount * 18 + 40),
        weight: 0.2,
        detail: `${toBn(b.orderCount)} সক্রিয় অর্ডার`,
      },
      {
        id: 'pipeline',
        label: 'লিড পাইপলাইন',
        emoji: '🎯',
        points: Math.min(100, b.leadCount * 15 + 35),
        weight: 0.2,
        detail: `${toBn(b.leadCount)} লিড ট্র্যাক করা`,
        tip: b.leadCount > 0 ? 'হট লিডে আজ ফলো-আপ করুন' : undefined,
      },
      {
        id: 'complaints',
        label: 'অভিযোগ ব্যবস্থাপনা',
        emoji: '⚠️',
        points: Math.max(20, 100 - b.openComplaints * 35),
        weight: 0.15,
        detail: b.openComplaints === 0 ? 'খোলা অভিযোগ নেই' : `${toBn(b.openComplaints)} খোলা অভিযোগ`,
      },
      {
        id: 'records',
        label: 'হিসাব রেকর্ড',
        emoji: '📒',
        points: Math.min(100, 50 + b.tier * 10),
        weight: 0.2,
        detail: `প্যাকেজ: টিয়ার ${toBn(b.tier)}`,
      },
    ],
  };
}

export function buildBeneficiaryReport(
  b: Beneficiary,
  profile: BusinessCreditProfile,
): string {
  const today = new Date().toLocaleDateString('en-GB');
  const profit = b.monthlyIncome - b.monthlyExpense;

  return [
    'উপকারভোগী বিশ্লেষণ রিপোর্ট (PO)',
    '────────────────────',
    `নাম: ${b.name}`,
    `প্রতিষ্ঠান: ${b.businessName}`,
    `ঠিকানা: ${b.location}`,
    `মোবাইল: ${b.phone}`,
    `রিপোর্ট তারিখ: ${toBn(today)}`,
    '────────────────────',
    `ক্রেডিট স্কোর: ${toBn(profile.score)}/১০০`,
    `মান: ${profile.gradeEmoji} ${profile.gradeLabel}`,
    `মাসিক আয়: ${bnTaka(b.monthlyIncome)}`,
    `মাসিক ব্যয়: ${bnTaka(b.monthlyExpense)}`,
    `মোট লাভ: ${bnTaka(profit)}`,
    '────────────────────',
    'স্কোর উপাদান:',
    ...profile.factors.map((f) => `• ${f.label}: ${toBn(f.points)}/১০০ — ${f.detail}`),
    '────────────────────',
    `পরামর্শ: ${b.insight}`,
    '',
    'Antarious PO পোর্টাল · ডেমো রিপোর্ট',
  ].join('\n');
}
