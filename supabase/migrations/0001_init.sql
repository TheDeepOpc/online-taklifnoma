-- Onlayn to'y taklifnomasi platformasi uchun boshlang'ich sxema

create extension if not exists "pgcrypto";

create type price_tier as enum ('150000', '200000', '250000');
create type invitation_status as enum ('draft', 'published');

create table music_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text not null,
  min_price_tier price_tier not null default '150000',
  created_at timestamptz not null default now()
);

create table invitations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  groom_name text not null,
  bride_name text not null,
  wedding_date date not null,
  wedding_time time not null,
  venue_name text not null,
  venue_address text not null,
  venue_map_url text,
  price_tier price_tier not null default '150000',
  template_id text not null default 'basic',
  music_track_id uuid references music_tracks(id),
  custom_message text,
  cover_photo_url text,
  is_paid boolean not null default false,
  status invitation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index invitations_slug_idx on invitations (slug);

-- updated_at avtomatik yangilanishi uchun
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger invitations_set_updated_at
  before update on invitations
  for each row
  execute function set_updated_at();

-- Row Level Security: admin (autentifikatsiyadan o'tgan foydalanuvchi) hammasini boshqaradi,
-- ommaviy (anon) foydalanuvchi faqat to'langan va e'lon qilingan taklifnomani o'qiy oladi.
alter table invitations enable row level security;
alter table music_tracks enable row level security;

create policy "Admin full access to invitations"
  on invitations for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Public can read published paid invitations"
  on invitations for select
  using (is_paid = true and status = 'published');

create policy "Admin full access to music_tracks"
  on music_tracks for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Public can read music_tracks"
  on music_tracks for select
  using (true);

-- Namuna musiqalar (haqiqiy mp3 fayllarni /public/music papkasiga yoki
-- Supabase Storage'ga joylashtirib, file_url manzillarini shu yerga moslang)
insert into music_tracks (title, file_url, min_price_tier) values
  ('Romantik pianino', '/music/romantic-piano.mp3', '150000'),
  ('Nafis torlar', '/music/gentle-strings.mp3', '200000'),
  ('Premium orkestr', '/music/premium-orchestra.mp3', '250000');
