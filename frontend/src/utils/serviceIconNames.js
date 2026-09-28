const normalize = (s) =>
  String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

/** Lucide icon names inferred from service title when Icon field is empty. */
const TITLE_TO_LUCIDE = {
  websitedevelopment: 'Globe',
  webdevelopment: 'Globe',
  frontenddevelopment: 'Layout',
  frontend: 'Layout',
  backenddevelopment: 'Server',
  backend: 'Server',
  fullstackwebdevelopment: 'Layers',
  fullstackdevelopment: 'Layers',
  fullstack: 'Layers',
  mobiledevelopment: 'Smartphone',
  appdevelopment: 'Smartphone',
  uiuxdesign: 'Palette',
  uiux: 'Palette',
  design: 'Palette',
  devops: 'Cloud',
  cloud: 'Cloud',
  consulting: 'MessageSquare',
  maintenance: 'Wrench',
  seo: 'Search',
  ecommerce: 'ShoppingCart',
  api: 'Plug',
  database: 'Database',
};

export function resolveServiceLucideName(title, iconField) {
  const trimmed = iconField?.trim();
  if (trimmed && !/^https?:\/\//i.test(trimmed)) return trimmed;

  const key = normalize(title);
  if (TITLE_TO_LUCIDE[key]) return TITLE_TO_LUCIDE[key];

  if (key.includes('fullstack')) return 'Layers';
  if (key.includes('frontend')) return 'Layout';
  if (key.includes('backend')) return 'Server';
  if (key.includes('website') || key.includes('web')) return 'Globe';
  if (key.includes('mobile') || key.includes('app')) return 'Smartphone';
  if (key.includes('design') || key.includes('ui')) return 'Palette';

  return null;
}
