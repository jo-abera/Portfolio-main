/**
 * Runs `prisma generate`. Uses placeholder DB URLs when unset (Render build).
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://build:build@127.0.0.1:5432/build?schema=public';
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

const prismaCli = join(root, 'node_modules', 'prisma', 'build', 'index.js');
if (!existsSync(prismaCli)) {
  console.error('ensure-prisma-generate: run npm install first (prisma package missing).');
  process.exit(1);
}

const result = spawnSync(process.execPath, [prismaCli, 'generate'], {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
