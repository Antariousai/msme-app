export type LoanLenderId =
  | 'brac'
  | 'grameen'
  | 'dbbl'
  | 'bkash'
  | 'nagad'
  | 'ngo'
  | 'cooperative'
  | 'other';

export interface LoanLenderOption {
  id: LoanLenderId;
  label: string;
  emoji: string;
}

export const LOAN_LENDERS: LoanLenderOption[] = [
  { id: 'brac', label: 'ব্র্যাক ব্যাংক', emoji: '🏦' },
  { id: 'grameen', label: 'গ্রামীণ ব্যাংক', emoji: '🌾' },
  { id: 'dbbl', label: 'ডাচ-বাংলা ব্যাংক', emoji: '🏛️' },
  { id: 'bkash', label: 'bKash / মোবাইল ফাইন্যান্স', emoji: '📱' },
  { id: 'nagad', label: 'নগদ / ডিজিটাল ঋণ', emoji: '💳' },
  { id: 'ngo', label: 'এনজিও / মাইক্রোফাইন্যান্স', emoji: '🤝' },
  { id: 'cooperative', label: 'সমবায় / স্থানীয় সংস্থা', emoji: '👥' },
  { id: 'other', label: 'অন্যান্য', emoji: '📋' },
];

export const getLoanLenderLabel = (id: LoanLenderId | undefined): string | undefined =>
  LOAN_LENDERS.find((l) => l.id === id)?.label;
