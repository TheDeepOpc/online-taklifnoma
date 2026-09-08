-- Shaxsiy taklifnoma: mehmon ismi (ixtiyoriy, bo'lmasa umumiy "Aziz mehmon" ishlatiladi)
-- Matn o'lchami: admin taklifnoma matnlarini kichikroq qilib ko'rsatishni tanlashi mumkin

alter table invitations add column if not exists guest_name text;
alter table invitations add column if not exists text_size text not null default 'normal';
