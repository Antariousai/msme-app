import {
  seedTransactions,
  seedOrders,
  seedInventory,
  seedLeads,
  seedComplaints,
  Transaction,
} from '../data/seed';
import { bnTaka, toBn } from './helpers';

export type CreditGrade = 'excellent' | 'good' | 'fair' | 'needs_work';

export interface CreditFactor {
  id: string;
  label: string;
  emoji: string;
  /** 0–100 for this factor */
  points: number;
  weight: number;
  detail: string;
  tip?: string;
}

export interface BusinessCreditProfile {
  score: number;
  grade: CreditGrade;
  gradeLabel: string;
  gradeEmoji: string;
  factors: CreditFactor[];
  summary: string;
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

function gradeFromScore(score: number): Pick<BusinessCreditProfile, 'grade' | 'gradeLabel' | 'gradeEmoji'> {
  if (score >= 80) {
    return { grade: 'excellent', gradeLabel: 'উৎকৃষ্ট', gradeEmoji: '🌟' };
  }
  if (score >= 60) {
    return { grade: 'good', gradeLabel: 'ভালো', gradeEmoji: '✅' };
  }
  if (score >= 40) {
    return { grade: 'fair', gradeLabel: 'মাঝারি', gradeEmoji: '📊' };
  }
  return { grade: 'needs_work', gradeLabel: 'উন্নতি প্রয়োজন', gradeEmoji: '⚠️' };
}

/** MSME account credit score from in-app business signals (demo model). */
export function computeBusinessCreditScore(
  transactions: Transaction[] = seedTransactions,
): BusinessCreditProfile {
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const profit = income - expense;
  const marginPct = income > 0 ? (profit / income) * 100 : 0;

  const cashFlowPoints = clamp(
    marginPct >= 25 ? 95 : marginPct >= 15 ? 80 : marginPct >= 5 ? 60 : marginPct >= 0 ? 45 : 25,
  );

  const totalOrders = seedOrders.length;
  const delivered = seedOrders.filter((o) => o.status === 'delivered').length;
  const fulfillmentRate = totalOrders > 0 ? (delivered / totalOrders) * 100 : 50;
  const orderPoints = clamp(fulfillmentRate + (seedOrders.filter((o) => o.status === 'pending').length === 0 ? 10 : 0));

  const stockHealthy = seedInventory.filter((i) => i.stock > i.minStock).length;
  const inventoryPoints = clamp(
    seedInventory.length > 0 ? (stockHealthy / seedInventory.length) * 100 : 70,
  );

  const converted = seedLeads.filter((l) => l.status === 'converted').length;
  const qualified = seedLeads.filter((l) => l.status === 'qualified' || l.status === 'converted').length;
  const pipelinePoints = clamp(
    seedLeads.length > 0
      ? (converted / seedLeads.length) * 50 + (qualified / seedLeads.length) * 50
      : 55,
  );

  const openComplaints = seedComplaints.filter((c) => c.status !== 'resolved').length;
  const complaintPoints = clamp(100 - openComplaints * 35);

  const txnCount = transactions.length;
  const recordPoints = clamp(txnCount >= 5 ? 90 : txnCount >= 3 ? 75 : 50);

  const factors: CreditFactor[] = [
    {
      id: 'cashflow',
      label: 'নগদ প্রবাহ',
      emoji: '💵',
      points: cashFlowPoints,
      weight: 0.28,
      detail: `লাভ মার্জিন ${toBn(Math.round(marginPct))}% · ${bnTaka(profit)} মোট লাভ`,
      tip: marginPct < 15 ? 'খরচ কমিয়ে বা আয় বাড়িয়ে মার্জিন উন্নত করুন' : undefined,
    },
    {
      id: 'orders',
      label: 'অর্ডার পূরণ',
      emoji: '📦',
      points: orderPoints,
      weight: 0.2,
      detail: `${toBn(delivered)}/${toBn(totalOrders)} ডেলিভার্ড`,
      tip: fulfillmentRate < 60 ? 'অপেক্ষমাণ অর্ডার দ্রুত কনফার্ম করুন' : undefined,
    },
    {
      id: 'inventory',
      label: 'স্টক স্বাস্থ্য',
      emoji: '🏪',
      points: inventoryPoints,
      weight: 0.15,
      detail: `${toBn(stockHealthy)}/${toBn(seedInventory.length)} পণ্য পর্যাপ্ত স্টকে`,
      tip: inventoryPoints < 70 ? 'কম স্টক পণ্য রিফিল করুন' : undefined,
    },
    {
      id: 'pipeline',
      label: 'লিড ও রূপান্তর',
      emoji: '🎯',
      points: pipelinePoints,
      weight: 0.17,
      detail: `${toBn(converted)} রূপান্তর · ${toBn(qualified)} যোগ্য লিড`,
    },
    {
      id: 'service',
      label: 'গ্রাহক সেবা',
      emoji: '🤝',
      points: complaintPoints,
      weight: 0.1,
      detail: openComplaints === 0 ? 'খোলা অভিযোগ নেই' : `${toBn(openComplaints)} খোলা অভিযোগ`,
      tip: openComplaints > 0 ? 'অভিযোগ দ্রুত সমাধান করুন' : undefined,
    },
    {
      id: 'records',
      label: 'হিসাব রেকর্ড',
      emoji: '📒',
      points: recordPoints,
      weight: 0.1,
      detail: `${toBn(txnCount)} লেনদেন রেকর্ড`,
      tip: txnCount < 5 ? 'প্রতিদিন আয়-খরচ নোট করুন' : undefined,
    },
  ];

  const score = clamp(
    factors.reduce((sum, f) => sum + f.points * f.weight, 0),
  );

  const gradeMeta = gradeFromScore(score);

  const summary =
    score >= 80
      ? 'আপনার ব্যবসা ঋণ ও পার্টনার প্রোগ্রামের জন্য শক্তিশালী প্রোফাইল দেখাচ্ছে।'
      : score >= 60
        ? 'ভালো অবস্থান — কয়েকটি ক্ষেত্রে উন্নতি করলে স্কোর আরও বাড়বে।'
        : 'হিসাব, স্টক ও অর্ডার ট্র্যাকিং ধারাবাহিক করলে ক্রেডিট স্কোর দ্রুত উন্নত হবে।';

  return {
    score,
    ...gradeMeta,
    factors,
    summary,
  };
}

export function creditScoreColor(score: number): string {
  if (score >= 80) return '#14b8a6';
  if (score >= 60) return '#0e7490';
  if (score >= 40) return '#f59e0b';
  return '#fb7185';
}

/** Plain-text credit score report for sharing (demo). */
export function buildCreditScoreReport(businessName: string, profile: BusinessCreditProfile): string {
  const today = new Date().toLocaleDateString('en-GB');
  const lines = [
    'MSME ক্রেডিট স্কোর রিপোর্ট (ডেমো)',
    '────────────────────',
    `প্রতিষ্ঠান: ${businessName}`,
    `রিপোর্ট তারিখ: ${toBn(today)}`,
    `ক্রেডিট স্কোর: ${toBn(profile.score)}/১০০`,
    `মান: ${profile.gradeEmoji} ${profile.gradeLabel}`,
    '────────────────────',
    'স্কোর উপাদান:',
    ...profile.factors.map(
      (f) => `• ${f.label}: ${toBn(f.points)}/১০০ — ${f.detail}`,
    ),
    '────────────────────',
    profile.summary,
    '',
    'Antarious MSME · স্বয়ংক্রিয় বিশ্লেষণ',
  ];
  return lines.join('\n');
}
