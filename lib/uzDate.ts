// Node serverida "uz-UZ" uchun to'liq ICU ma'lumoti bo'lmasligi mumkin (Intl fallback
// qiladi, masalan "Dekabr" o'rniga "M12"), brauzerda esa to'liq ishlaydi — bu server va
// mijoz orasida hydration nomuvofiqligiga olib keladi. Shu sababli oy/hafta kuni
// nomlarini Intl orqali emas, qo'lda belgilangan ro'yxatdan olamiz — ikkalasida ham
// bir xil natija kafolatlanadi.

const MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

const WEEKDAYS = [
  "Yakshanba",
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
];

export function uzMonthName(date: Date): string {
  return MONTHS[date.getMonth()];
}

export function uzWeekdayName(date: Date): string {
  return WEEKDAYS[date.getDay()];
}

export function uzMonthYear(date: Date): string {
  return `${uzMonthName(date)}, ${date.getFullYear()}`;
}

export function uzFullDate(date: Date): string {
  return `${date.getDate()} ${uzMonthName(date)}, ${date.getFullYear()}`;
}
