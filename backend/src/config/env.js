import './loadEnv.js';

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

const missing = [];
if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
if (!process.env.DIRECT_URL) missing.push('DIRECT_URL');
if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
if (!supabaseServiceRoleKey) {
  missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY');
}
if (!process.env.ADMIN_EMAIL) missing.push('ADMIN_EMAIL');

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missing.join(', ')}. Copy .env.example to backend/.env and fill them in.`
  );
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  // Comma-separated list so multiple local dev servers (e.g. Vite falling
  // back to 5174 when 5173 is taken) can all reach the API at once.
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()),
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey,
  adminEmail: process.env.ADMIN_EMAIL.toLowerCase(),
};
