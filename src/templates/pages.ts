import { TemplateContext } from './types';
import { wrapPage, heroBlock, escapeHtml } from './layout';

export function buildFashionStoreHtml(ctx: TemplateContext): string {
  const name = ctx.businessName;
  const body = `
    ${heroBlock(
      'linear-gradient(145deg, #BE185D 0%, #D94F00 100%)',
      'ফ্যাশন স্টোর',
      name,
      ctx.tagline ?? 'নতুন কালেকশন · হোম ডেলিভারি সারা বাংলাদেশে',
    )}
    <div class="section">
      <div class="section-title">জনপ্রিয় পণ্য</div>
      <div class="grid">
        ${productCard('👗', 'কটন কুর্তি', '৳৮৫০')}
        ${productCard('🧣', 'জামদানি শাড়ি', '৳৩,২০০')}
        ${productCard('👜', 'হাতের ব্যাগ', '৳১,২০০')}
        ${productCard('🧥', 'শীতের জ্যাকেট', '৳২,৫০০')}
      </div>
      <a class="btn btn-primary" href="#">Facebook/Instagram এ অর্ডার করুন</a>
    </div>
    <div class="section">
      <div class="card">
        <div class="section-title" style="margin-bottom:0.5rem">কেন আমাদের?</div>
        <ul class="feature-list">
          <li>প্রিমিয়াম কাপড় ও হ্যান্ডমেইড ফিনিশ</li>
          <li>ঢাকার ভিতর ২৪ ঘণ্টায় ডেলিভারি</li>
          <li>সহজ রিটার্ন ও এক্সচেঞ্জ</li>
        </ul>
      </div>
    </div>`;
  return wrapPage('ফ্যাশন স্টোর', body, ctx);
}

export function buildProductLandingHtml(ctx: TemplateContext): string {
  const product = ctx.tagline?.includes('পণ্য') ? ctx.tagline : 'প্রিমিয়াম জামদানি শাড়ি';
  const body = `
    ${heroBlock(
      'linear-gradient(145deg, #1A7A4A 0%, #0E7490 100%)',
      'ল্যান্ডিং পেজ',
      product,
      nameSubtitle(ctx.businessName),
    )}
    <div class="section">
      <div class="card" style="text-align:center;padding:1.5rem">
        <div class="product-img" style="height:140px;font-size:3rem;margin-bottom:1rem">🎀</div>
        <div class="price" style="font-size:1.75rem;margin-bottom:0.25rem">৳৩,২০০</div>
        <div class="muted" style="margin-bottom:1rem">ফ্রি ডেলিভারি · ৭ দিন রিটার্ন</div>
        <a class="btn btn-secondary" href="#">এখনই অর্ডার করুন</a>
      </div>
      <div class="section-title">বৈশিষ্ট্য</div>
      <div class="card">
        <ul class="feature-list">
          <li>১০০% খাঁটি জামদানি কাপড়</li>
          <li>হাতে বোনা traditional design</li>
          <li>গিফট বক্সসহ প্যাকেজিং</li>
          <li>COD ও bKash পেমেন্ট</li>
        </ul>
      </div>
    </div>`;
  return wrapPage('পণ্য ল্যান্ডিং', body, ctx);
}

export function buildRestaurantMenuHtml(ctx: TemplateContext): string {
  const body = `
    ${heroBlock(
      'linear-gradient(145deg, #D97706 0%, #D94F00 100%)',
      'রেস্টুরেন্ট',
      ctx.businessName,
      ctx.tagline ?? 'তাজা খাবার · দ্রুত ডেলিভারি',
    )}
    <div class="section">
      <div class="section-title">🍛 মূল খাবার</div>
      <div class="card">
        ${menuRow('ভাত + মুরগির কারি', '৳১৮০')}
        ${menuRow('খিচুড়ি + ইলিশ ভাজা', '৳২২০')}
        ${menuRow('বিরিয়ানি (ফুল)', '৳২৫০')}
      </div>
      <div class="section-title">🥤 পানীয়</div>
      <div class="card">
        ${menuRow('লাচ্ছি', '৳৬০')}
        ${menuRow('লেবুর শরবত', '৳৪০')}
      </div>
      <a class="btn btn-primary" href="#">অর্ডার করুন (WhatsApp)</a>
    </div>`;
  return wrapPage('রেস্টুরেন্ট মেনু', body, ctx);
}

export function buildServiceBookingHtml(ctx: TemplateContext): string {
  const body = `
    ${heroBlock(
      'linear-gradient(145deg, #7C3AED 0%, #0E7490 100%)',
      'সার্ভিস বুকিং',
      ctx.businessName,
      ctx.tagline ?? 'অ্যাপয়েন্টমেন্ট ও হোম সার্ভিস',
    )}
    <div class="section">
      <div class="section-title">আমাদের সেবা</div>
      <div class="card">${serviceRow('💇', 'হেয়ার কাট ও স্টাইল', '৳৫০০ থেকে')}</div>
      <div class="card">${serviceRow('💆', 'ফেসিয়াল ও স্পা', '৳৮০০ থেকে')}</div>
      <div class="card">${serviceRow('🏠', 'হোম ভিজিট', '৳৩০০ অতিরিক্ত')}</div>
      <div class="section-title" style="margin-top:1rem">বুকিং ফর্ম</div>
      <div class="card">
        <div class="form-group"><label class="form-label">নাম</label><div class="form-input">আপনার নাম</div></div>
        <div class="form-group"><label class="form-label">ফোন</label><div class="form-input">01XXXXXXXXX</div></div>
        <div class="form-group"><label class="form-label">তারিখ ও সময়</label><div class="form-input">বেছে নিন</div></div>
        <a class="btn btn-secondary" href="#">বুকিং কনফার্ম</a>
      </div>
    </div>`;
  return wrapPage('সার্ভিস বুকিং', body, ctx);
}

function nameSubtitle(business: string): string {
  return `${business} · বিশ্বস্ত MSME`;
}

function productCard(emoji: string, name: string, price: string): string {
  return `<div class="card" style="margin-bottom:0;padding:0.75rem">
    <div class="product-img">${emoji}</div>
    <div class="name">${escapeHtml(name)}</div>
    <div class="price">${escapeHtml(price)}</div>
  </div>`;
}

function menuRow(name: string, price: string): string {
  return `<div class="menu-item"><div><div class="name">${escapeHtml(name)}</div></div><div class="price">${escapeHtml(price)}</div></div>`;
}

function serviceRow(emoji: string, name: string, price: string): string {
  return `<div style="display:flex;gap:0.75rem;align-items:center">
    <span style="font-size:1.5rem">${emoji}</span>
    <div style="flex:1"><div class="name">${escapeHtml(name)}</div><div class="muted">${escapeHtml(price)}</div></div>
  </div>`;
}
