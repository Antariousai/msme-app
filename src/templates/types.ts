export type WebTemplateId = 'wt1' | 'wt2' | 'wt3' | 'wt4';

export interface TemplateContext {
  businessName: string;
  phone?: string;
  tagline?: string;
}

export interface WebTemplateDef {
  id: WebTemplateId;
  name: string;
  desc: string;
  tag?: string;
  buildHtml: (ctx: TemplateContext) => string;
}
