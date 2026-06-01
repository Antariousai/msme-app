import { TemplateContext } from './types';

const BASE_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Noto Sans Bengali', system-ui, sans-serif;
    background: #F7F5F2;
    color: #1A1A1A;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  .page { max-width: 480px; margin: 0 auto; min-height: 100vh; }
  .hero {
    padding: 2rem 1.25rem;
    color: #fff;
    text-align: center;
  }
  .hero h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.35rem; }
  .hero p { font-size: 0.9rem; opacity: 0.92; }
  .badge {
    display: inline-block;
    background: rgba(255,255,255,0.2);
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    font-size: 0.7rem;
    margin-bottom: 0.75rem;
  }
  .section { padding: 1.25rem; }
  .section-title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.85rem;
    color: #1A1A1A;
  }
  .card {
    background: #fff;
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    border: 1px solid #E5E0D8;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .product-img {
    height: 88px;
    border-radius: 8px;
    background: linear-gradient(135deg, #EDE9E4 0%, #E5E0D8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  .price { font-weight: 700; color: #D94F00; font-size: 0.95rem; }
  .name { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.2rem; }
  .muted { font-size: 0.75rem; color: #6B6560; }
  .btn {
    display: block;
    width: 100%;
    text-align: center;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    border: none;
    margin-top: 0.5rem;
  }
  .btn-primary { background: #D94F00; color: #fff; }
  .btn-secondary { background: #1A7A4A; color: #fff; }
  .footer {
    text-align: center;
    padding: 1.5rem 1rem 2rem;
    font-size: 0.7rem;
    color: #A09890;
  }
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.65rem 0;
    border-bottom: 1px solid #F0EDE8;
  }
  .menu-item:last-child { border-bottom: none; }
  .form-group { margin-bottom: 0.85rem; }
  .form-label { font-size: 0.75rem; color: #6B6560; margin-bottom: 0.25rem; display: block; }
  .form-input {
    width: 100%;
    padding: 0.65rem 0.75rem;
    border: 1.5px solid #E5E0D8;
    border-radius: 8px;
    font-size: 0.85rem;
    background: #fff;
  }
  .feature-list { list-style: none; }
  .feature-list li {
    padding: 0.4rem 0 0.4rem 1.25rem;
    position: relative;
    font-size: 0.85rem;
    color: #6B6560;
  }
  .feature-list li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #1A7A4A;
    font-weight: 700;
  }
`;

export function wrapPage(title: string, body: string, ctx: TemplateContext): string {
  const phone = ctx.phone ?? '01XXXXXXXXX';
  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <title>${escapeHtml(title)} — ${escapeHtml(ctx.businessName)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="page">
    ${body}
    <div class="footer">
      ${escapeHtml(ctx.businessName)} · ${escapeHtml(phone)}<br/>
      Antarious MSME টেমপ্লেট প্রিভিউ
    </div>
  </div>
</body>
</html>`;
}

export function heroBlock(
  gradient: string,
  badge: string,
  title: string,
  subtitle: string,
): string {
  return `
    <div class="hero" style="background: ${gradient};">
      <div class="badge">${escapeHtml(badge)}</div>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(subtitle)}</p>
    </div>`;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
