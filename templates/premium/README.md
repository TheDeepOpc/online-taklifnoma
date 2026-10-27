# Premium taklifnomalar — Edition II

Ko‘rish: http://localhost:3000/templates

Avvalgi 23 ta dizayn o‘z holatida saqlanadi. Qo‘shimcha 7 ta Atelier shabloni bilan jami 30 ta dizayn bor. Har biri alohida surat, hero maketi, bo‘limlar tartibi, grid va animatsiyaga ega. Galereya kartalari avvalgi 23 shablonning ochilgan ko‘rinishini, Atelier kolleksiyasining esa kirish sahifasini ko‘rsatadi.

## Manbalar

- `lib/templateDesigns.ts` — 30 ta maket, harakat, naqsh, mavzu effekti va bo‘limlar kompozitsiyasi.
- `layouts/HeroCompositions.tsx` — avvalgi 23 ta hero daraxti; yangi yettita kompozitsiya `AtelierHero.tsx` ichida: triptix, diptix, jurnal, kollaj, pochta kartasi, atirgulli albom, teatr va boshqa maketlar.
- `layouts/BodyComposition.tsx` — avvalgi 23 shablon bo‘limlari tartibi va ustunlari.
- `AtelierInvitation.tsx`, `layouts/AtelierDetails.tsx` — yangi yettita shablonning mustaqil taklifnoma maketlari: opera dasturi/chipta, saroy peshtoqi/mozaika, osmon orbitasi/billur kartochka, shaxsiy maktub/pochta kartasi, botanika hikoyasi/oranjereya, albom/jurnal, zargarlik sertifikati/zumrad lavha. Ular `PremiumInvitation` yoki eski `BodyComposition` orqali render qilinmaydi. Admin to‘ldirmagan ixtiyoriy bo‘limlar avtomatik tushib qoladi.
- `layouts/SeasonalAtmosphere.tsx` — real alpha rasmlar bilan yaproq, bulut, yulduz, gulbarg va milliy bezak animatsiyalari.
- `layouts/OrnamentalFrame.tsx` — oltin, kumush, islimiy, gulli va boshqa hoshiyalar.
- `shared/PremiumInvitation.tsx` — admin ma’lumotlari, kirish tugmasi, kalendar, sanoq, xarita, musiqa va qolgan umumiy xatti-harakatlar.

## Mavzuga xos harakatlar

- Bardoviy atirgul / Rose Noire: bordo atirgullar, albom maketi va generatsiya qilingan shaffof atirgul barglarining aylanib tushishi. Eski `premium-qish` havolalari shu mavzuga yo‘naltiriladi.
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

Video fon o‘rniga built-in `image_gen` bilan tayyorlangan beshta to‘y va muhabbat surati ishlatiladi: `public/home-art/love-story.webp` va `public/home-art/wedding-details.webp`, shuningdek `rose-ceremony.webp`, `uzbek-garden.webp`, `love-letter.webp`. `home-image-prompts.json` promptlar va fayllarni saqlaydi. Ijtimoiy tarmoqlardagi havola uchun `app/opengraph-image.tsx` va `app/twitter-image.tsx` rasmli kartochka yaratadi; ishlab chiqarish domeni `NEXT_PUBLIC_SITE_URL` orqali beriladi.

Barcha demo taklifnomalarda Sardor va Soliha ismlari ishlatiladi. Naqsh va ramkalar surat yoki aniq kartochka ichiga biriktirilgan.

## Qo‘shimcha Atelier kolleksiyasi — 7 ta yangi shablon

Avvalgi 23 ta ID, tasvir, ranglar, maket va ochilish sahifalari saqlanadi. Yangi shablonlar alohida `atelier-*` ID bilan ro‘yxatdan o‘tgan va 250 000 so‘mlik kolleksiyaga kiradi. Galereyada “Yangi · Atelier 7” bo‘limi mavjud.

- `/templates/atelier-opera-rubis` — to‘rli mato modelida buklanadigan va yonlarga yig‘iladigan baxmal parda; opera sahnasi.
- `/templates/atelier-samarqand-palace` — sharnirlaridan ochiladigan o‘ymakor ikki eshik; Samarqand saroyi va hovlisi.
- `/templates/atelier-cristal-celeste` — alohida billur eshiklar, marvarid va bulutlar; osmon saroyi.
- `/templates/atelier-lettre-royale` — alohida konvert qopqog‘i, cho‘ntagi va ko‘tariladigan maktub.
- `/templates/atelier-jardin-de-verre` — alohida suriladigan bronza va shisha eshiklar; gulli oranjereya.
- `/templates/atelier-album-heritage` — o‘z o‘qidan ochiladigan charm muqova, old va ichki yuza; ochilgan albom sahifalari.
- `/templates/atelier-tresor-eternel` — sharniridan ko‘tariladigan zargarlik qutisi qopqog‘i; zumrad baxmal xazina.

Har bir shablonda alohida hero kompozitsiyasi, bo‘limlar tartibi, grid va ranglar bor. Rasmlar bitta butun qatlam sifatida surilmaydi: fon joyida turadi, alohida material qismlari harakatlanadi. Parda WebGL to‘rida buklamalar, tebranish va mato yig‘ilishi bilan chiziladi; WebGL mavjud bo‘lmasa canvas varianti ishlaydi. Ochilish tugmasi bosilguncha scroll qulflanadi; musiqa bosish hodisasida boshlanadi. Harakat kamaytirilgan rejimda darhol ochiladi.

Manbalar: `atelierPresets.ts`, `AtelierInvitation.tsx`, `layouts/AtelierHero.tsx`, `layouts/LuxuryInvitationGate.tsx`, `layouts/MechanicalOpeningScene.tsx`, `layouts/FabricCurtain.tsx`.

Rasmlar built-in `image_gen` bilan yaratilgan:

- `public/invitation-art/gates/atelier/` — yopiq sahna rasmlari va `parts/` ichida 8 ta shaffof material qismi.
- `public/invitation-art/atelier-scenes/` — yangi yettita shablonning ochilgan sahna rasmlari.
- `atelier-gate-image-prompts.json` va `atelier-mechanical-assets.json` — promptlar va barcha fayllar manifestlari.


Atelier matnlari ekran kengligi va yuklangan shrift bo‘yicha qayta o‘lchanadi. Uzun ism-familiya so‘z o‘rtasidan bo‘linmaydi; iframe kengligi o‘zgarsa ham shrift qayta moslanadi. Hero matni faqat tugma bosilgach, materiallar ochilishi ichida ketma-ket ko‘rinadi. Ochilish davomida holat va progress ko‘rinadi, fon bilan sahifa orasida bo‘sh kadr yo‘q. Ochilgan sahifada sana va manzilga o‘tish tugmalari mavjud.
