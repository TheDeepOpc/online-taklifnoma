-- "Qo'shimcha tilaklar" bo'limi: admin yozmasa taklifnomada tayyor matnlardan biri chiqadi

alter table invitations add column if not exists wishes_title text;
alter table invitations add column if not exists wishes_text text;
