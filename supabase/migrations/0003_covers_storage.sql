-- Admin panelidan muqova rasm yuklash uchun

insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

create policy "Public can read cover photos"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "Admin can upload cover photos"
  on storage.objects for insert
  with check (bucket_id = 'covers' and auth.role() = 'authenticated');

create policy "Admin can delete cover photos"
  on storage.objects for delete
  using (bucket_id = 'covers' and auth.role() = 'authenticated');
