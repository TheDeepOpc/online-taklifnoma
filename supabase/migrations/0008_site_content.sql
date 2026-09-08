-- Sayt tuzilmasi: bosh sahifadagi barcha matn/dinamik qiymatlar admin panelidan
-- tahrirlanishi uchun key-value xotira. Har bir bo'rim bitta satr — `key` identifikator,
-- `value` esa to'liq JSONB struktura.

create table if not exists site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop policy if exists "Public can read site content" on site_content;
create policy "Public can read site content"
  on site_content for select
  using (true);

drop policy if exists "Admin can insert site content" on site_content;
create policy "Admin can insert site content"
  on site_content for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Admin can update site content" on site_content;
create policy "Admin can update site content"
  on site_content for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Bosh sahifa materiali default qiymatlarni keyin lib/siteContent.ts da
-- merge qilib oladi, shu sababli tabel strukturasi bo'sh qoldiriladi.