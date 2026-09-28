/**
 * Updates social_links.platform check constraint (0006). Uses DATABASE_URL from backend/.env.
 * Usage: node scripts/applySocialPlatformsMigration.js
 */
import '../src/config/loadEnv.js';
import { prisma } from '../src/config/prisma.js';

await prisma.$executeRawUnsafe(
  'alter table social_links drop constraint if exists social_links_platform_check'
);
await prisma.$executeRawUnsafe(`
  alter table social_links add constraint social_links_platform_check check (
    platform in (
      'github','linkedin','instagram','twitter','facebook','whatsapp','telegram','email','website','other'
    )
  )
`);

console.log('social_links_platform_check updated (whatsapp, telegram, facebook allowed).');
await prisma.$disconnect();
