# Premium taklifnomalar — Edition II

Ko‘rish: http://localhost:3000/templates

Barcha 23 ta dizayn premium sifatida ishlaydi. Har biri alohida surat, hero maketi, bo‘limlar tartibi, grid va animatsiyaga ega. Galereya kartalari haqiqiy ochilgan shablonlarning previewlarini ko‘rsatadi.

## Manbalar

- `lib/templateDesigns.ts` — 23 ta maket, harakat, naqsh, mavzu effekti va bo‘limlar kompozitsiyasi.
- `layouts/HeroCompositions.tsx` — 23 ta alohida hero daraxti: triptix, diptix, jurnal, kollaj, pochta kartasi, atirgulli albom, teatr va boshqa maketlar.
- `layouts/BodyComposition.tsx` — bo‘limlarning har bir mavzuga xos tartibi va ustunlari. Admin to‘ldirmagan ixtiyoriy bo‘limlar avtomatik tushib qoladi.
- `layouts/SeasonalAtmosphere.tsx` — real alpha rasmlar bilan yaproq, bulut, yulduz, gulbarg va milliy bezak animatsiyalari.
- `layouts/OrnamentalFrame.tsx` — oltin, kumush, islimiy, gulli va boshqa hoshiyalar.
- `shared/PremiumInvitation.tsx` — admin ma’lumotlari, kirish tugmasi, kalendar, sanoq, xarita, musiqa va qolgan umumiy xatti-harakatlar.

## Mavzuga xos harakatlar

- Qish: 46 ta turli tezlikdagi qor zarrasi, alohida kristall rasmi va atirgulli albom animatsiyasi.
- Kuz: generatsiya qilingan haqiqiy zarang yaprog‘i; 20 ta yaproq aylanish va shamol siljishi bilan tushadi. Kollajning kirish harakati ham alohida.
- Samo va Moviy osmon: miltillovchi yulduzlar; Moviy osmonda uchta real shaffof bulut qatlami turli tezlikda suzadi va scroll bilan parallax qiladi.
- Anor bog‘i: suzani, islimiy naqshlar, anorlar, asl karnay rasmlari va alohida yaratilgan surnay. Milliy bezaklar saqlanadi.
- Boshqa maketlar: gulbarglar, marvaridlar, oltin zarralar, yorug‘lik pardalari va boshqa mavzuga mos animatsiyalar.

Barcha maketlarda parallax bor. `prefers-reduced-motion` yoqilganda parallax va dekorativ harakatlar to‘xtaydi. Adminning jonli previewi alohida telefon oynasida haqiqiy kirish tugmasi, musiqa, parallax va mavsumiy effektlar bilan ishlaydi. Faqat preview ichidagi scroll qulflanadi. Saqlanmagan o‘zgarishlar ham darhol ko‘rinadi; “Qayta ochish” tugmasi kirish holatini tiklaydi.

## Rasmlar

Built-in `image_gen` bilan ushbu tahrir uchun 30 ta yangi asset yaratildi:

- `public/invitation-art/edition-2/` — 23 ta bir-biridan farq qiladigan premium fon.
- `public/invitation-art/effects/` — yaproq, bordo atirgul bargi, bulut, yulduz, oltin naqsh, islimiy naqsh va surnay uchun 7 ta shaffof asset.
- `edition-2-image-prompts.json` — barcha promptlar va yakuniy fayllar manifesti.

Fonlar dekorativ san’at rasmlari; to‘yxona haqida haqiqiy ma’lumot admin kiritgan nom va manzildan olinadi. Juftlik suratlari adminning muqova va galereya maydonlaridan keladi.

## Ochilish va admin

Har bir shablonda `Taklifnomani ochish` tugmasi bor. Bosilguncha asosiy sahifa inert, scroll qulflangan va audio ijro qilinmaydi. Tugma bosilganda admin tanlagan musiqa bevosita shu hodisada boshlanadi, sahifa va scroll ochiladi.

Ismlar, shaxsiy mehmon nomi, sana, vaqt, suratlar, kun dasturi, tilaklar, to‘yona va xarita mavjud admin formasidan keladi. Mehmon ma’lumot kiritmaydi. Haqiqiy taklifnoma `/t/[slug]` orqali ochiladi, shaxsiy `?mehmon=...` havolalari ham ishlaydi.

## Tekshirish

```sh
npm run lint
npm run build
npm run shots
```

`npm run shots` ochilish tugmasini bosib, shablonning haqiqiy ko‘rinishini `public/template-shots/` ichiga saqlaydi. Boshqa port uchun `BASE_URL=http://localhost:3456 npm run shots` ishlatiladi.

## Asosiy reklama sahifasi

Video fon o‘rniga built-in `image_gen` bilan tayyorlangan ikkita to‘y surati ishlatiladi: `public/home-art/love-story.webp` va `public/home-art/wedding-details.webp`. `home-image-prompts.json` promptlar va fayllarni saqlaydi. Ijtimoiy tarmoqlardagi havola uchun `app/opengraph-image.tsx` va `app/twitter-image.tsx` rasmli kartochka yaratadi; ishlab chiqarish domeni `NEXT_PUBLIC_SITE_URL` orqali beriladi.

Barcha demo taklifnomalarda Sardor va Soliha ismlari ishlatiladi. Naqsh va ramkalar surat yoki aniq kartochka ichiga biriktirilgan.
