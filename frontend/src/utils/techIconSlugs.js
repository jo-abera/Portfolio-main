const normalize = (s) =>
  String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\.js$/i, 'js')
    .replace(/[^a-z0-9+]/g, '');

/** Maps normalized skill/icon text → simple-icons slug (https://simpleicons.org) */
const SLUG_ALIASES = {
  html: 'html5',
  html5: 'html5',
  css: 'css',
  css3: 'css',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  react: 'react',
  reactjs: 'react',
  reactnative: 'react',
  nextjs: 'nextdotjs',
  next: 'nextdotjs',
  vue: 'vuedotjs',
  vuejs: 'vuedotjs',
  angular: 'angular',
  svelte: 'svelte',
  node: 'nodedotjs',
  nodejs: 'nodedotjs',
  express: 'express',
  expressjs: 'express',
  nestjs: 'nestjs',
  python: 'python',
  django: 'django',
  fastapi: 'fastapi',
  java: 'openjdk',
  spring: 'springboot',
  php: 'php',
  laravel: 'laravel',
  go: 'go',
  golang: 'go',
  rust: 'rust',
  csharp: 'csharp',
  dotnet: 'dotnet',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  mysql: 'mysql',
  mongodb: 'mongodb',
  mongo: 'mongodb',
  redis: 'redis',
  supabase: 'supabase',
  prisma: 'prisma',
  firebase: 'firebase',
  aws: 'amazonwebservices',
  azure: 'microsoftazure',
  gcp: 'googlecloud',
  docker: 'docker',
  kubernetes: 'kubernetes',
  git: 'git',
  github: 'github',
  gitlab: 'gitlab',
  figma: 'figma',
  tailwind: 'tailwindcss',
  tailwindcss: 'tailwindcss',
  vite: 'vite',
  webpack: 'webpack',
  graphql: 'graphql',
  linux: 'linux',
};

export function resolveTechIconSlug(skillName, iconField) {
  const fromField = normalize(iconField);
  if (fromField) {
    if (SLUG_ALIASES[fromField]) return SLUG_ALIASES[fromField];
    if (/^[a-z0-9]+$/.test(fromField)) return fromField;
  }
  const fromName = normalize(skillName);
  return SLUG_ALIASES[fromName] || null;
}

/** Single neutral tone — no per-brand colors (Simple Icons CDN hex, no `#`). */
export const TECH_ICON_MONO_COLOR = 'a3a3a3';

export function techIconUrl(slug) {
  if (!slug) return null;
  return `https://cdn.simpleicons.org/${encodeURIComponent(slug)}/${TECH_ICON_MONO_COLOR}`;
}
