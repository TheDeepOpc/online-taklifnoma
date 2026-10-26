# Signature premium taklifnomalar

Ko‘rish: http://localhost:3000/templates

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
