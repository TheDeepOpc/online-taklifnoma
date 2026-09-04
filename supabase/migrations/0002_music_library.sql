-- Admin panelidan mp3 fayl yuklab, musiqa kutubxonasini boshqarish uchun

alter table music_tracks add column if not exists storage_path text;

insert into storage.buckets (id, name, public)
values ('music', 'music', true)
on conflict (id) do nothing;

create policy "Public can read music files"
  on storage.objects for select
  using (bucket_id = 'music');

create policy "Admin can upload music files"
  on storage.objects for insert
  with check (bucket_id = 'music' and auth.role() = 'authenticated');

create policy "Admin can delete music files"
  on storage.objects for delete
  using (bucket_id = 'music' and auth.role() = 'authenticated');
