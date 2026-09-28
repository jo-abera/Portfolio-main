-- Hero background video URL (admin Website Content). Safe to re-run.
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_video_url text;
