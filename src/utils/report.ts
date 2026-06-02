import { Platform, Share } from 'react-native';
import { bnTaka, toBn } from './helpers';

export type ReportPeriod = 'weekly' | 'monthly';

export const periodLabel = (p: ReportPeriod): string =>
  p === 'weekly' ? 'সাপ্তাহিক' : 'মাসিক';

export interface ReportInput {
  businessName: string;
  period: ReportPeriod;
  income: number;
  expense: number;
  /** Optional named lines, e.g. category or product breakdown */
  breakdown?: { label: string; amount: number }[];
  /** Optional free-text notes (e.g. for an NGO recipient) */
  recipient?: string;
}

/** Builds a plain-text business summary suitable for sharing or download. */
export function buildBusinessReport(input: ReportInput): string {
  const { businessName, period, income, expense, breakdown, recipient } = input;
  const profit = income - expense;
  const margin = income > 0 ? Math.round((profit / income) * 100) : 0;
  const today = new Date().toLocaleDateString('en-GB');

  const lines: string[] = [
    `${businessName}`,
    `${periodLabel(period)} ব্যবসা রিপোর্ট`,
    recipient ? `প্রাপক: ${recipient}` : '',
    `তারিখ: ${toBn(today)}`,
    '────────────────────',
    `মোট আয়:   ${bnTaka(income)}`,
    `মোট ব্যয়:  ${bnTaka(expense)}`,
    `মোট লাভ:   ${bnTaka(profit)}`,
    `লাভ মার্জিন: ${toBn(margin)}%`,
  ];

  if (breakdown && breakdown.length > 0) {
    lines.push('────────────────────', 'বিস্তারিত:');
    breakdown.forEach((b) => lines.push(`• ${b.label}: ${bnTaka(b.amount)}`));
  }

  lines.push('────────────────────', 'Antarious MSME অ্যাপ দ্বারা তৈরি');
  return lines.filter((l) => l !== '').join('\n');
}

/**
 * Shares a report. Uses the native Share sheet on iOS/Android and a
 * file download on web. Returns true if the share was initiated.
 */
export async function shareReport(title: string, content: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch {
      return false;
    }
  }

  try {
    await Share.share({ title, message: content });
    return true;
  } catch {
    return false;
  }
}
