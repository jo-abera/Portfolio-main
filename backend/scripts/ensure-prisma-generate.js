/**
 * Runs `prisma generate`. Uses placeholder DB URLs when unset (Render build
 * before env vars are configured, or local install without .env).
 */
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://build:build@127.0.0.1:5432/build?schema=public';
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

execSync('npx prisma generate', { stdio: 'inherit', cwd: root, env: process.env });
