# Signature premium taklifnomalar

Ko‘rish: http://localhost:3000/templates

Galereyada endi barcha 23 ta shablon mavjud: 5 ta Signature va 18 ta Atelier. Eski oilalarning komponent nomlari saqlangan, ularning ko‘rinishi `CollectionInvitation.tsx` va `lib/invitationArt.ts` orqali yangidan qurilgan. Har bir mavzuning alohida rasmi, palitrasi, kompozitsiyasi va tipografik yo‘nalishi bor.

| Mavzu | Komponent | Namuna |
| --- | --- | --- |
| Qish — Cristal | `Qish.tsx` | `/templates/premium-qish` |
| Kuz — Amber | `Kuz.tsx` | `/templates/premium-kuz` |
| Yoz — Riviera | `Yoz.tsx` | `/templates/premium-yoz` |
| Tilla va Hayot — Éternité | `TillaHayot.tsx` | `/templates/premium-tilla-hayot` |
| Moviy osmon — Céleste | `MoviyOsmon.tsx` | `/templates/premium-moviy-osmon` |

Har bir mavzuning mustaqil kirish komponenti va kompozitsiyasi bor. Umumiy ma’lumotlarni chiqarish, kalendar, animatsiyali ochilish, vaqt sanog‘i va musiqa `shared/PremiumInvitation.tsx` ichida. Har bir kompozitsiyaning alohida CSS qoidalari `shared/PremiumInvitation.module.css` ichida.

## Admin bilan ishlash

Mavzular `lib/themes.ts` va `components/templates/TemplateRenderer.tsx` orqali mavjud tizimga ulangan. Admin yangi taklifnoma yaratishda 250 000 so‘mlik yuqori tarifni tanlaydi, so‘ng `SIGNATURE · PREMIUM` belgili mavzuni tanlaydi. Yangi tarif yoki baza ustuni talab qilinmaydi.

Ismlar, mehmon nomi, sana, vaqt, manzil, Google Maps havolasi, tilaklar, kun dasturi, muqova, galereya va to‘yona raqami mavjud admin formasi orqali kiritiladi. Bo‘sh ixtiyoriy bo‘limlar ko‘rsatilmaydi. `second_photo_url` ushbu beshta dizaynda ishlatilmaydi: asosiy juftlik surati va beshtagacha galereya rasmi qo‘llanadi.

Musiqa admin kutubxonasidagi `MusicTrack.file_url` orqali keladi. Mehmon «Taklifnomani ochish»ni bosganda mavjud `MusicPlayer` bevosita ishga tushadi. Musiqa tanlanmagan bo‘lsa, audio tugmasi chiqmaydi. Mijoz ma’lumot kiritmaydi; faqat ko‘radi, musiqani boshqaradi va manzilni ochadi.

Real taklifnoma faqat `is_paid = true` va `status = published` bo‘lganda `/t/[slug]` orqali ochiladi. Shaxsiy `?mehmon=...` havolalari mavjud umumiy mexanizm orqali ishlaydi.

## Rasmlar va animatsiyalar

Beshta original fon built-in `image_gen` bilan yaratildi. Yakuniy fayllar `public/premium-assets/` ichida, promptlar esa `image-prompts.json` ichida saqlangan. Tashqi rasm manziliga bog‘liqlik yo‘q. Fonlar dekorativ: to‘yxonaning haqiqiy surati sifatida belgilanmagan.

Qish: qor va billur arka. Kuz: yaproq animatsiyasi va asimmetrik kompozitsiya. Yoz: gulbarglar va yorug‘ botanika. Tilla va Hayot: zumrad fon, oltin zarralar va qo‘sh arka. Moviy osmon: nurli yulduzchalar, oq arkalar va moviy bulutlar.

`prefers-reduced-motion` yoqilganda dekorativ animatsiyalar to‘xtaydi. Galereya previewlari haqiqiy shablonlarning WebP skrinshotlari; mavjud `npm run shots` bu beshta mavzuni ham qamrab oladi.

## Barcha shablonlarda kirish va parallax

23 ta shablonning har birida rasmli kirish sahifasi va `Taklifnomani ochish` tugmasi mavjud. Tugma bosilmaguncha sahifaning o‘zi ko‘rinmaydi va unga fokus berib bo‘lmaydi. Musiqa tugmasi yashirin, audio ijro etilmaydi; sahifa touch, wheel, klaviatura va programmatik scroll uchun qulflangan. Tugma bosilganda audio foydalanuvchi hodisasining o‘zida boshlanadi va scroll ochiladi.

250 minglik va Signature mavzularida uchta mustaqil rasm qatlami parallax bilan harakatlanadi: asosiy ekran, oraliq muhabbat sahnasi va manzil bo‘limi. `ParallaxScene` transform orqali ishlaydi. Operatsion tizimning animatsiyani kamaytirish sozlamasi jonli kuzatiladi va parallaxni o‘chiradi. Adminning kichik preview oynasida kirish ekrani, ovoz va parallax ishlamaydi; forma tahrirlash uchun ochiq qoladi.

Atelier uchun 18 ta yangi original fon built-in `image_gen` bilan yaratildi: yakuniy fayllar `public/invitation-art/`, to‘liq promptlar `atelier-image-prompts.json` ichida. Signature rasmlari `public/premium-assets/` ichida. Admin yuklagan juftlik suratlari bu dekorativ fonlardan alohida chiqariladi. Oqqush mavzusida ikkinchi surat ham qo‘llanadi.
