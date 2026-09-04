-- Ikkinchi rasm (photo-pair hero uchun) va sovg'a karta raqami (ixtiyoriy)

alter table invitations add column if not exists second_photo_url text;
alter table invitations add column if not exists gift_card_number text;
