-- Xotira galereyasi: admin 1-5 ta rasm yuklashi mumkin (ixtiyoriy)

alter table invitations add column if not exists gallery_photo_urls text[] not null default '{}';
