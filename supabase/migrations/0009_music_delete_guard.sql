-- Musiqa o'chirilganda eski taklifnomalar buzilmasligi uchun himoya.
--
-- 1) `invitations.music_track_id` uchun indeks: taklifnomalar soni ko'payganda
--    "bu qo'shiq nechta taklifnomada ishlatilgan?" so'rovi va foreign key
--    tekshiruvi to'liq jadvalni skan qilmasin.
-- 2) Foreign key'ni oshkora `on delete restrict` qilamiz — ishlatilayotgan
--    qo'shiqni baza darajasida ham o'chirib bo'lmaydi (ilova kodidagi
--    tekshiruvdan tashqari ikkinchi himoya qatlami).

create index if not exists invitations_music_track_id_idx
  on invitations (music_track_id);

alter table invitations
  drop constraint if exists invitations_music_track_id_fkey;

alter table invitations
  add constraint invitations_music_track_id_fkey
  foreign key (music_track_id)
  references music_tracks (id)
  on delete restrict;

-- Dashboard ro'yxati `created_at desc` bo'yicha saralanadi.
create index if not exists invitations_created_at_idx
  on invitations (created_at desc);

-- Ommaviy sahifa so'rovi: slug + is_paid + status.
create index if not exists invitations_published_slug_idx
  on invitations (slug) where is_paid and status = 'published';
