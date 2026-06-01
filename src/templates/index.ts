import { WebTemplateDef } from './types';
import {
  buildFashionStoreHtml,
  buildProductLandingHtml,
  buildRestaurantMenuHtml,
  buildServiceBookingHtml,
} from './pages';

export const WEB_TEMPLATES: WebTemplateDef[] = [
  {
    id: 'wt1',
    name: 'ফ্যাশন স্টোর',
    desc: 'পোশাক ও অ্যাকসেসরিজ ক্যাটালগ',
    tag: 'জনপ্রিয়',
    buildHtml: buildFashionStoreHtml,
  },
  {
    id: 'wt2',
    name: 'একক পণ্য ল্যান্ডিং',
    desc: 'এক পণ্যের ফোকাসড সেলস পেজ',
    tag: 'নতুন',
    buildHtml: buildProductLandingHtml,
  },
  {
    id: 'wt3',
    name: 'রেস্টুরেন্ট মেনু',
    desc: 'খাবারের মেনু ও অর্ডার ফর্ম',
    buildHtml: buildRestaurantMenuHtml,
  },
  {
    id: 'wt4',
    name: 'সার্ভিস বুকিং',
    desc: 'অ্যাপয়েন্টমেন্ট ও সেবা বুকিং',
    buildHtml: buildServiceBookingHtml,
  },
];

export function getWebTemplateById(id: string): WebTemplateDef | undefined {
  return WEB_TEMPLATES.find((t) => t.id === id);
}

export type { WebTemplateId, TemplateContext, WebTemplateDef } from './types';
