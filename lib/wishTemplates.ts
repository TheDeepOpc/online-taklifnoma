/**
 * Tayyor tilak matnlari — admin "Qo'shimcha tilaklar"ni yozmasa, shulardan
 * biri ko'rsatiladi; formadagi "Tayyor matn" tugmasi ham shu ro'yxatdan oladi.
 * AI emas: oddiy, oldindan yozilgan matnlar to'plami.
 */
export interface WishTemplate {
  id: number;
  title: string;
  text: string;
}

export const WISH_TEMPLATES: WishTemplate[] = [
  {
    id: 1,
    title: "Yangi hayotning boshlanishi",
    text: "Hayotimizning eng go‘zal sahifalaridan biri ochilayotgan ushbu kunda sizni yonimizda ko‘rishni istaymiz. Bir-birimizga bo‘lgan muhabbat va ishonchni oila deb atalgan muqaddas rishta bilan bog‘lamoqdamiz. Oldimizda hali ko‘plab orzular, unutilmas lahzalar va birga bosib o‘tiladigan yo‘llar bor. Shu yo‘lning boshlanishida yaqinlarimizning mehrini his qilish biz uchun juda qadrli. Tashrifingiz, samimiy tabassumingiz va ezgu tilaklaringiz bayramimizga yanada fayz bag‘ishlaydi.",
  },
  {
    id: 2,
    title: "Ikki qalb, bir manzil",
    text: "Bir paytlar har birimizning o‘z yo‘limiz, o‘z orzularimiz va kelajak haqidagi o‘ylarimiz bor edi. Bugun esa bu yo‘llar bir manzilda tutashib, orzularimiz umumiy maqsadga aylanmoqda. Endi quvonchlarni birga kutib olishga, sinovlardan birga o‘tishga va har bir kunning qadriga birga yetishga ahd qildik. Muhabbatimizning oilaga aylanishiga guvoh bo‘lishingizni istaymiz. Ushbu unutilmas oqshomni biz bilan baham ko‘rishga taklif etamiz.",
  },
  {
    id: 3,
    title: "Ota-onalar duosi bilan",
    text: "Bugungi baxtimiz ortida bizni mehr bilan ulg‘aytirgan ota-onalarimizning mehnati, sabri va ezgu niyatlari bor. Ularning duosi va yaqinlarimizning qo‘llab-quvvatlashi bilan yangi oila qurish arafasidamiz. Xonadonimizda hurmat, mehr va totuvlik doimo hamroh bo‘lishini niyat qilamiz. Hayotimizdagi ushbu qadrli kunni siz bilan bir dasturxon atrofida nishonlashni istaymiz. Tashrif buyurib, quvonchimizga sherik bo‘lsangiz, boshimiz osmonga yetadi.",
  },
  {
    id: 4,
    title: "Oddiy kunlardagi baxt",
    text: "Biz uchun baxt faqat katta bayramlar va unutilmas sayohatlardan iborat emas. Baxt — tongni birga qarshi olish, kun davomida bir-birini eslash va kechqurun bir dasturxon atrofida uchrashishdir. Biz ana shunday oddiy, ammo qadrli lahzalarga boy hayotni birga qurishni istaymiz. Bugun shu niyatimizning ilk bayramiga sizni taklif qilamiz. Yaqinlarimiz davrasida aytilgan samimiy tilaklar yangi hayotimizning eng iliq xotiralaridan biri bo‘lib qoladi.",
  },
  {
    id: 5,
    title: "Muhabbat hikoyamiz",
    text: "Har bir muhabbat hikoyasining o‘z boshlanishi bo‘ladi. Bizning hikoyamiz ham bir uchrashuv, samimiy suhbat va asta-sekin yaqinlashgan ikki qalbdan boshlandi. Vaqt o‘tib, bir-birimizda eng yaqin do‘stimizni va kelajakdagi umr yo‘ldoshimizni topdik. Endi esa bu hikoyaning yangi sahifasini oila bo‘lib ochmoqdamiz. Eng baxtli kunimizda sizning ham yonimizda bo‘lishingizni istaymiz. Keling, ushbu go‘zal xotirani birgalikda yarataylik.",
  },
  {
    id: 6,
    title: "Bir dasturxon atrofida",
    text: "Oilaviy bayramning eng go‘zal tomoni — uzoq-yaqindagi qadrdonlarning bir joyga jam bo‘lishidir. Samimiy suhbatlar, tanish chehralar va chin yurakdan aytilgan tilaklar har qanday tantanani yanada qadrli qiladi. Biz ham hayotimizdagi ushbu quvonchli voqeani siz azizlar bilan nishonlashni niyat qildik. Dasturxonimiz atrofida siz uchun alohida joy, qalbimizda esa katta hurmat bor. Tashrifingiz bilan bayramimizni yanada fayzli qilishingizni kutamiz.",
  },
  {
    id: 7,
    title: "Bir umrga berilgan va’da",
    text: "Bugun biz bir-birimizga faqat baxtli kunlarda emas, hayotning barcha fasllarida yonma-yon bo‘lishga va’da bermoqdamiz. Bir-birimizni tinglash, tushunish, asrash va birga ulg‘ayishni tanladik. Kelajakdagi uyimizni mehrli suhbatlar, o‘zaro hurmat va birgalikda yaratilgan xotiralar bilan to‘ldirishni istaymiz. Ushbu niyatlarimizning boshlanishiga sizni guvoh bo‘lishga chorlaymiz. Biz uchun qadrli bo‘lgan insonlar davrasida bu kunning quvonchi yanada ortadi.",
  },
  {
    id: 8,
    title: "Esda qoladigan oqshom",
    text: "Ba’zi kunlar yillar o‘tsa ham qalbda o‘zining ilk iliqligini saqlab qoladi. Biz uchun ushbu bayram ana shunday unutilmas kunlardan biri bo‘lishiga ishonamiz. Undagi har bir tabassum, har bir quchoqlashuv va har bir samimiy tilak xotiramizda alohida o‘rin egallaydi. Shu xotiralar orasida sizning ham borligingizni istaymiz. Kundalik tashvishlardan bir oz uzoqlashib, quvonchimizga sherik bo‘lishingiz va ushbu oqshomni biz bilan o‘tkazishingizdan mamnun bo‘lamiz.",
  },
  {
    id: 9,
    title: "Yangi oilaning ilk bayrami",
    text: "Yangi oila — birgalikda quriladigan uy, baham ko‘riladigan orzular va kundan kunga mustahkamlanadigan ishonch demakdir. Biz ham o‘z oilamizning poydevorini muhabbat, sabr va o‘zaro hurmat bilan qo‘ymoqdamiz. Bu yo‘lda ota-onalarimizning o‘gitlari va yaqinlarimizning mehri bizga hamroh bo‘lishini istaymiz. Yangi oilamizning ilk bayramiga sizni samimiyat bilan taklif etamiz. Qadamingiz qutlug‘, tilaklaringiz esa kelajakdagi kunlarimizga chiroyli hamroh bo‘lsin.",
  },
  {
    id: 10,
    title: "Siz bilan to‘kis quvonch",
    text: "Quvonchni yaqin insonlar bilan baham ko‘rganda uning qadri yanada ortadi. Shu sababli hayotimizdagi ushbu muhim kunni sizsiz tasavvur qilish qiyin. Siz bilan ko‘rishish, dildan suhbatlashish va birga yangi xotiralar yaratish biz uchun katta baxt. Bayramimizga tashrif buyurib, oilamizning quvonchiga sherik bo‘lishingizni chin yurakdan istaymiz. Sizning borligingiz, mehringiz va yaxshi niyatingiz ushbu kunning eng qadrli tuhfasidir.",
  },
];

/**
 * Taklifnoma uchun barqaror "tasodifiy" tanlov: har bir taklifnomaga o'zining
 * matni tushadi, lekin sahifa har ochilganda (va server/brauzer o'rtasida)
 * almashib turmaydi.
 */
export function wishForSeed(seed: string): WishTemplate {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return WISH_TEMPLATES[Math.abs(hash) % WISH_TEMPLATES.length];
}

/** Formadagi "Tayyor matn" tugmasi — joriy matndan farqli tasodifiy matn. */
export function randomWish(currentText?: string | null): WishTemplate {
  const pool = WISH_TEMPLATES.filter((w) => w.text !== currentText);
  return pool[Math.floor(Math.random() * pool.length)];
}
