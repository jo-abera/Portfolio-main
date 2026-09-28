/**
 * Creates any storage buckets defined in storageService that are missing in Supabase.
 * Uses SUPABASE_URL + service role key from backend/.env (via loadEnv).
 *
 * Usage: node scripts/ensureStorageBuckets.js
 */
import '../src/config/loadEnv.js';
import { supabaseAdmin } from '../src/config/supabase.js';
import { ALLOWED_BUCKETS } from '../src/services/storageService.js';

const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
if (listError) {
  console.error('Failed to list buckets:', listError.message);
  process.exit(1);
}

const existing = new Set((buckets ?? []).map((b) => b.name));

for (const name of ALLOWED_BUCKETS) {
  if (existing.has(name)) {
    console.log(`OK  ${name} (exists)`);
    continue;
  }
  const { error } = await supabaseAdmin.storage.createBucket(name, { public: true });
  if (error) {
    console.error(`FAIL ${name}:`, error.message);
    process.exitCode = 1;
  } else {
    console.log(`OK  ${name} (created)`);
  }
}
