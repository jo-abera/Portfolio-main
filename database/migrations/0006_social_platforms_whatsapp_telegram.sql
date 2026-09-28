-- Extend social_links.platform (facebook, whatsapp, telegram). Safe to re-run.

alter table social_links drop constraint if exists social_links_platform_check;

alter table social_links add constraint social_links_platform_check check (
  platform in (
    'github',
    'linkedin',
    'instagram',
    'twitter',
    'facebook',
    'whatsapp',
    'telegram',
    'email',
    'website',
    'other'
  )
);
