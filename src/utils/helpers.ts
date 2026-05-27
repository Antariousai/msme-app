export const toBn = (n: number | string): string => {
  const bnDigits: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
    '.': '.', ',': ',',
  };
  return String(n).replace(/[0-9.,]/g, (d) => bnDigits[d] ?? d);
};

export const bnTaka = (amount: number): string => `৳${toBn(amount.toLocaleString('en-IN'))}`;

export const formatDate = (date: Date): string => {
  const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুলা', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
  return `${toBn(date.getDate())} ${months[date.getMonth()]}`;
};

export const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${toBn(hours)}:${toBn(mins)} ${ampm}`;
};

export const getDayName = (date: Date): string => {
  const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
  return days[date.getDay()];
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'শুভ সকাল';
  if (hour < 17) return 'শুভ দুপুর';
  return 'শুভ সন্ধ্যা';
};

export const calcProfit = (revenue: number, expense: number): number => revenue - expense;

export const calcGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const tierIncludes = (userTier: number, requiredTier: number): boolean => {
  return userTier >= requiredTier;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const STORAGE_KEYS = {
  AUTH_USER: 'antarious:auth:user',
  USER_TIER: 'antarious:user:tier',
  BOOKKEEPING: 'antarious:bookkeeping',
  ORDERS: 'antarious:orders',
  LEADS: 'antarious:leads',
  INVENTORY: 'antarious:inventory',
};
