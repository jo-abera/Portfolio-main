-- Optional hero background video URL (used by admin UI; safe if column already exists)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_video_url text;
