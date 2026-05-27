import { generateId } from '../utils/helpers';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
}

export interface Message {
  id: string;
  platform: 'facebook' | 'instagram';
  sender: string;
  preview: string;
  time: string;
  unread: boolean;
  status: 'new' | 'replied' | 'escalated' | 'confirmed';
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  items: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  source: 'facebook' | 'instagram' | 'website';
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  address: string;
  score: number;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  lastContact: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  unit: string;
  lastInflow: string;
}

export interface CourierShipment {
  id: string;
  orderId: string;
  customer: string;
  courier: string;
  trackingId: string;
  status: 'pending' | 'picked' | 'in_transit' | 'delivered';
}

export interface Complaint {
  id: string;
  customer: string;
  issue: string;
  status: 'open' | 'in_progress' | 'resolved';
  date: string;
}

export const seedTransactions: Transaction[] = [
  { id: generateId(), type: 'income', amount: 3500, category: 'বিক্রয়', note: '৩টি শাড়ি', date: '2026-05-27' },
  { id: generateId(), type: 'expense', amount: 800, category: 'কাঁচামাল', note: 'কাপড় ক্রয়', date: '2026-05-27' },
  { id: generateId(), type: 'income', amount: 1200, category: 'বিক্রয়', note: 'লাঞ্জ কম্বো', date: '2026-05-26' },
  { id: generateId(), type: 'expense', amount: 450, category: 'পরিবহন', note: 'রিকশা ভাড়া', date: '2026-05-26' },
  { id: generateId(), type: 'income', amount: 5600, category: 'বিক্রয়', note: 'হাট দিবস', date: '2026-05-25' },
];

export const seedMessages: Message[] = [
  { id: 'm1', platform: 'facebook', sender: 'সাবিনা আক্তার', preview: 'এই ড্রেসটা কি সাইজ M আছে?', time: '১০ মিনিট', unread: true, status: 'new' },
  { id: 'm2', platform: 'instagram', sender: 'তানিয়া রহমান', preview: 'অর্ডার কনফার্ম করুন ০১৭XXXXXXXX', time: '৩০ মিনিট', unread: true, status: 'new' },
  { id: 'm3', platform: 'facebook', sender: 'মোঃ রফিক', preview: 'ডেলিভারি চার্জ কত?', time: '১ ঘণ্টা', unread: false, status: 'replied' },
  { id: 'm4', platform: 'instagram', sender: 'নুসরাত জাহান', preview: 'পণ্য পেয়েছি, ধন্যবাদ!', time: '২ ঘণ্টা', unread: false, status: 'confirmed' },
];

export const seedOrders: Order[] = [
  { id: 'ORD-1042', customer: 'সাবিনা আক্তার', phone: '01711223344', items: 'কটন কুর্তি x1', amount: 850, status: 'pending', source: 'facebook', date: '2026-05-27' },
  { id: 'ORD-1041', customer: 'তানিয়া রহমান', phone: '01822334455', items: 'শাড়ি x2', amount: 3200, status: 'confirmed', source: 'instagram', date: '2026-05-26' },
  { id: 'ORD-1040', customer: 'ফারহানা ইসলাম', phone: '01933445566', items: 'লাঞ্জ সেট x1', amount: 1200, status: 'shipped', source: 'website', date: '2026-05-25' },
];

export const seedLeads: Lead[] = [
  { id: 'L001', name: 'আয়েশা সিদ্দিকা', phone: '01611223344', address: 'মিরপুর-১০, ঢাকা', score: 92, source: 'Facebook Ad', status: 'qualified', lastContact: 'আজ' },
  { id: 'L002', name: 'রুবেল হোসেন', phone: '01722334455', address: 'আgrabad, Ctg', score: 78, source: 'Website', status: 'contacted', lastContact: 'গতকাল' },
  { id: 'L003', name: 'মাহমুদা বegum', phone: '01833445566', address: 'Zindabazar, Sylhet', score: 55, source: 'Instagram DM', status: 'new', lastContact: '২ দিন আগে' },
  { id: 'L004', name: 'সোহেল রানা', phone: '01944556677', address: 'Boalia, Rajshahi', score: 34, source: 'Facebook', status: 'lost', lastContact: '১ সপ্তাহ আগে' },
];

export const seedInventory: InventoryItem[] = [
  { id: 'i1', name: 'কটন কুর্তি', sku: 'KT-001', stock: 24, minStock: 10, unit: 'পিস', lastInflow: '২৫ মে' },
  { id: 'i2', name: 'জামদানি শাড়ি', sku: 'SD-012', stock: 8, minStock: 5, unit: 'পিস', lastInflow: '২০ মে' },
  { id: 'i3', name: 'লাঞ্জ সেট', sku: 'LZ-005', stock: 3, minStock: 8, unit: 'সেট', lastInflow: '১৫ মে' },
  { id: 'i4', name: 'স্কার্ফ', sku: 'SC-003', stock: 45, minStock: 15, unit: 'পিস', lastInflow: '২২ মে' },
];

export const seedCouriers: CourierShipment[] = [
  { id: 'c1', orderId: 'ORD-1040', customer: 'ফারহানা ইসলাম', courier: 'Pathao', trackingId: 'PA-882934', status: 'in_transit' },
  { id: 'c2', orderId: 'ORD-1038', customer: 'নাজমা খাতুন', courier: 'RedX', trackingId: 'RX-441022', status: 'delivered' },
  { id: 'c3', orderId: 'ORD-1041', customer: 'তানিয়া রহমান', courier: 'Steadfast', trackingId: 'SF-773821', status: 'pending' },
];

export const seedComplaints: Complaint[] = [
  { id: 'cp1', customer: 'রিমা আক্তার', issue: 'সাইজ ভুল পাঠানো হয়েছে', status: 'open', date: '২৬ মে' },
  { id: 'cp2', customer: 'জাহিদ হাসান', issue: 'ডেলিভারি দেরি', status: 'in_progress', date: '২৫ মে' },
  { id: 'cp3', customer: 'সুমাইয়া', issue: 'রিফান্ড অনুরোধ', status: 'resolved', date: '২৩ মে' },
];

export const aiSuggestions = {
  finance: [
    { title: 'খরচ কমান', message: 'গত সপ্তাহে পরিবহন খরচ ৩২% বেড়েছে। স্থানীয় কুরিয়ার ব্যবহার করলে ৳৪৫০ সাশ্রয় হতে পারে।' },
    { title: 'লাভ বাড়ান', message: 'শাড়ি ক্যাটাগরিতে ৪৫% মার্জিন — এই সপ্তাহে প্রচার বাড়ালে আয় বাড়তে পারে।' },
  ],
  performance: [
    { title: 'পিক সময়', message: 'সন্ধ্যা ৭–৯টায় সবচেয়ে বেশি মেসেজ আসে। এই সময়ে সক্রিয় থাকুন।' },
    { title: 'বেস্ট সেলার', message: 'কটন কুর্তি গত ৩০ দিনে সর্বোচ্চ বিক্রি — স্টক বাড়ান।' },
  ],
  leads: [
    { title: 'হট লিড', message: 'আয়েশা সিদ্দিকা (স্কোর ৯২) — আজ কল করলে রূপান্তর সম্ভাবনা ৮৫%।' },
    { title: 'আপসেল', message: 'তানিয়া রহমান শাড়ি কিনেছেন — ম্যাচিং স্কার্ফ অফার করুন।' },
  ],
};

export const calendarEvents = [
  { id: 'e1', title: 'হাট দিবস — মিরপুর', date: '২৮ মে', type: 'market' },
  { id: 'e2', title: 'স্টক রিফিল', date: '২৯ মে', type: 'inventory' },
  { id: 'e3', title: 'FB লাইভ সেল', date: '৩০ মে', type: 'promo' },
  { id: 'e4', title: 'মাসিক হিসাব', date: '৩১ মে', type: 'finance' },
];

export const brandCaptions = [
  'নতুন কালেকশন! প্রিমিয়াম কটন কুর্তি — মাত্র ৳৮৫০। DM করুন অর্ডার করতে।',
  'ঈদ স্পেশাল অফার — ২টি কিনলে ১টি ফ্রি! সীমিত সময়।',
  'আপনার স্টাইল, আমাদের ডিজাইন। হোম ডেলিভারি সারা বাংলাদেশে।',
];

export const hostingSuggestions = [
  { name: 'Hostinger', price: '৳১৯৯/মাস', note: 'শুরুর জন্য সেরা' },
  { name: 'Namecheap', price: '৳২৪৯/মাস', note: 'ডোমেইন + হোস্টিং' },
  { name: 'ExonHost (BD)', price: '৳৩৫০/মাস', note: 'বাংলাদেশি সাপোর্ট' },
];
