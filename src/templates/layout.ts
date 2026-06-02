import { TemplateContext } from './types';

/** Ocean CSS tokens for HTML email/web templates — studio "ocean" mood */
export const OCEAN_CSS = {
  primary: '#0e7490',
  primary2: '#22b8cf',
  accent: '#155e75',
  income: '#14b8a6',
  expense: '#fb7185',
  bg: '#ecfeff',
  bg2: '#f0fdfa',
  card: '#ffffff',
  ink: '#083344',
  muted: '#5f8a96',
  chip: '#cffafe',
  ai: '#0891b2',
  brand: '#0e7490',
  border: '#a5f3fc',
  heroGradient: 'linear-gradient(135deg,#0e7490,#0891b2 55%,#22d3ee)',
  radius: '20px',
};

const BASE_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Baloo Da 2', 'Noto Sans Bengali', system-ui, sans-serif;
    background: ${OCEAN_CSS.bg};
    color: ${OCEAN_CSS.ink};
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
    color: ${OCEAN_CSS.ink};
  }
  .card {
    background: ${OCEAN_CSS.card};
    border-radius: ${OCEAN_CSS.radius};
    padding: 1rem;
    margin-bottom: 0.75rem;
    border: 1px solid ${OCEAN_CSS.border};
    box-shadow: 0 4px 12px rgba(14,116,144,0.06);
  }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .product-img {
    height: 88px;
    border-radius: 12px;
    background: linear-gradient(135deg, ${OCEAN_CSS.chip} 0%, ${OCEAN_CSS.bg2} 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  .price { font-weight: 700; color: ${OCEAN_CSS.primary}; font-size: 0.95rem; }
  .name { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.2rem; }
  .muted { font-size: 0.75rem; color: ${OCEAN_CSS.muted}; }
  .btn {
    display: block;
    width: 100%;
    text-align: center;
    padding: 0.85rem 1rem;
    border-radius: ${OCEAN_CSS.radius};
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    border: none;
    margin-top: 0.5rem;
  }
  .btn-primary { background: ${OCEAN_CSS.primary}; color: #fff; }
  .btn-secondary { background: ${OCEAN_CSS.income}; color: #fff; }
  .footer {
    text-align: center;
    padding: 1.5rem 1rem 2rem;
    font-size: 0.7rem;
    color: ${OCEAN_CSS.muted};
  }
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.65rem 0;
    border-bottom: 1px solid ${OCEAN_CSS.border};
  }
  .menu-item:last-child { border-bottom: none; }
  .form-group { margin-bottom: 0.85rem; }
  .form-label { font-size: 0.75rem; color: ${OCEAN_CSS.muted}; margin-bottom: 0.25rem; display: block; }
  .form-input {
    width: 100%;
    padding: 0.65rem 0.75rem;
    border: 1.5px solid ${OCEAN_CSS.border};
    border-radius: 12px;
    font-size: 0.85rem;
    background: ${OCEAN_CSS.chip};
  }
  .feature-list { list-style: none; }
  .feature-list li {
    padding: 0.4rem 0 0.4rem 1.25rem;
    position: relative;
    font-size: 0.85rem;
    color: ${OCEAN_CSS.muted};
  }
  .feature-list li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: ${OCEAN_CSS.income};
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
  <link href="https://fonts.googleapis.com/css2?family=Tiro+Bangla:ital@0;1&display=swap" rel="stylesheet" />
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="page">
    ${body}
    <div class="footer">
      ${escapeHtml(ctx.businessName)} · ${escapeHtml(phone)}<br/>
      Antarious MSME · ওশান টেমপ্লেট
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
