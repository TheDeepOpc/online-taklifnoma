# Premium taklifnomalar — Edition II

Ko‘rish: http://localhost:3000/templates

Barcha 23 ta dizayn premium sifatida ishlaydi. Har biri alohida surat, hero maketi, bo‘limlar tartibi, grid va animatsiyaga ega. Galereya kartalari haqiqiy ochilgan shablonlarning previewlarini ko‘rsatadi.

## Manbalar

- `lib/templateDesigns.ts` — 23 ta maket, harakat, naqsh, mavzu effekti va bo‘limlar kompozitsiyasi.
- `layouts/HeroCompositions.tsx` — 23 ta alohida hero daraxti: triptix, diptix, jurnal, kollaj, pochta kartasi, muzli mozaika, teatr va boshqa maketlar.
- `layouts/BodyComposition.tsx` — bo‘limlarning har bir mavzuga xos tartibi va ustunlari. Admin to‘ldirmagan ixtiyoriy bo‘limlar avtomatik tushib qoladi.
- `layouts/SeasonalAtmosphere.tsx` — real alpha rasmlar bilan qor, yaproq, bulut, yulduz, gulbarg va milliy bezak animatsiyalari.
- `layouts/OrnamentalFrame.tsx` — oltin, kumush, islimiy, gulli va boshqa hoshiyalar.
- `shared/PremiumInvitation.tsx` — admin ma’lumotlari, kirish tugmasi, kalendar, sanoq, xarita, musiqa va qolgan umumiy xatti-harakatlar.

## Mavzuga xos harakatlar

- Qish: 46 ta turli tezlikdagi qor zarrasi, alohida kristall rasmi va muzli mozaika animatsiyasi.
- Kuz: generatsiya qilingan haqiqiy zarang yaprog‘i; 20 ta yaproq aylanish va shamol siljishi bilan tushadi. Kollajning kirish harakati ham alohida.
- Samo va Moviy osmon: miltillovchi yulduzlar; Moviy osmonda uchta real shaffof bulut qatlami turli tezlikda suzadi va scroll bilan parallax qiladi.
- Anor bog‘i: suzani, islimiy naqshlar, anorlar, asl karnay rasmlari va alohida yaratilgan surnay. Milliy bezaklar saqlanadi.
- Boshqa maketlar: gulbarglar, marvaridlar, oltin zarralar, yorug‘lik pardalari va boshqa mavzuga mos animatsiyalar.

Barcha maketlarda parallax bor. `prefers-reduced-motion` yoqilganda parallax va dekorativ harakatlar to‘xtaydi. Adminning jonli previewida kirish va musiqa ishlamaydi, shuning uchun forma qulflanmaydi.

## Rasmlar

Built-in `image_gen` bilan ushbu tahrir uchun 30 ta yangi asset yaratildi:

- `public/invitation-art/edition-2/` — 23 ta bir-biridan farq qiladigan premium fon.
- `public/invitation-art/effects/` — yaproq, qor kristalli, bulut, yulduz, oltin naqsh, islimiy naqsh va surnay uchun 7 ta shaffof asset.
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
