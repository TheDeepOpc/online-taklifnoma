-- Kun dasturi (mehmonlarni kutib olish, nikoh marosimi va h.k.) — admin tahrirlaydi

alter table invitations add column if not exists schedule_items jsonb not null default '[]';
