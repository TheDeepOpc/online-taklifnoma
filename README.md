# Onlayn to'y taklifnomasi

Admin panel orqali narx darajasiga (150/200/250 ming so'm) qarab romantik, musiqali onlayn
to'y taklifnomalari yaratiladi va har biri o'ziga xos havola (`/t/slug`) orqali ulashiladi.

## 1. Supabase sozlash

1. [supabase.com](https://supabase.com) da yangi loyiha yarating.
2. Loyiha sozlamalaridan (Project Settings → API) `URL` va `anon public key` ni oling.
3. SQL Editor'da `supabase/migrations/0001_init.sql`, so'ng `0002_music_library.sql`
   fayllarini ketma-ket ishga tushiring — bu jadvallar (`invitations`, `music_tracks`),
   RLS siyosatlari, musiqa fayllari uchun Storage bucket (`music`) va uning siyosatlarini
   yaratadi.
4. Authentication → Users bo'limidan o'zingiz uchun admin foydalanuvchi (email + parol) qo'shing
   — admin panelga shu orqali kirasiz.

## 2. Musiqa fayllari

Admin panelning **Musiqalar** bo'limi (`/admin/music`) orqali mp3 fayl to'g'ridan-to'g'ri
Supabase Storage'ga (`music` bucket) yuklanadi, havolasi esa avtomatik `music_tracks`
jadvaliga yoziladi — qo'shimcha qo'lda sozlash shart emas.

## 3. Lokal ishga tushirish

```bash
cp .env.local.example .env.local
# .env.local faylini Supabase ma'lumotlaringiz bilan to'ldiring
npm install
npm run dev
```

- `/` — landing sahifa
- `/admin/login` — admin kirish
- `/admin/dashboard` — taklifnomalar ro'yxati, yaratish/tahrirlash/o'chirish
- `/t/[slug]` — mehmonlarga yuboriladigan ommaviy taklifnoma havolasi

## 4. Vercelga deploy qilish

1. Loyihani GitHub repositoriyaga push qiling.
2. [vercel.com](https://vercel.com) → "Import Project" → repositoriyani tanlang.
3. Environment Variables bo'limiga `.env.local` dagi uchta qiymatni qo'shing.
4. Deploy qiling.

Shundan so'ng har bir yangi taklifnoma faqat admin panelda yaratiladi — qo'shimcha deploy
kerak emas, u darhol `https://domeningiz.vercel.app/t/slug` manzilida jonli bo'ladi.
