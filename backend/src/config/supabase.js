import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Service-role client for Supabase Auth (admin session verify) and Storage uploads.
// Postgres reads/writes go through Prisma — not this client.
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
