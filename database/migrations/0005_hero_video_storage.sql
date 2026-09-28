-- Hero background video bucket (admin upload → site_settings.hero_video_url).
-- Safe to re-run.

insert into storage.buckets (id, name, public)
values ('hero-video', 'hero-video', true)
on conflict (id) do nothing;

create policy "public_read_hero_video"
  on storage.objects for select to anon
  using (bucket_id = 'hero-video');
