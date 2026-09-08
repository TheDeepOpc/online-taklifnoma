// Sayt tuzilmasi — bosh sahifa va footer'dagi barcha matn/dinamik miqdorlar shu yerda
// yagona strukturda saqlanadi. Default qiymatlar DB'da biror bo'lim to'lmay qolganda
// ishlatiladi; admin paneli ("Sayt tuzilmasi") bu strukturni to'liq tahrirlaydi.

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface HowStep {
  n: string;
  title: string;
  body: string;
}

export interface FeatureItem {
  icon: FeatureIconKey;
  title: string;
  body: string;
}

export interface GiftOffer {
  id: string;
  guests: number | null;
  free: number | null;
  icon: FeatureIconKey;
  title: string;
  featured?: boolean;
  note: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteContent {
  hero: {
    badge: string;
    title1: string;
    title2: string;
    title3: string;
    subtitle: string;
    description: string;
    ctaPrimary: string;
    ctaPrimaryHref: string;
    ctaSecondary: string;
    scrollHint: string;
  };
  stats: StatItem[];
  designs: {
    title: string;
    accent: string;
    subtitle: string;
  };
  how: {
    script: string;
    title: string;
    accent: string;
    subtitle: string;
    steps: HowStep[];
  };
  features: {
    script: string;
    title: string;
    accent: string;
    items: FeatureItem[];
  };
  gift: {
    script: string;
    title: string;
    accent: string;
    subtitle: string;
    offerCountSuffix: string;
    unlimitedLabel: string;
    freeCountSuffix: string;
    loveLabel: string;
    payLabel: string;
    getLabel: string;
    customLabel: string;
    badge: string;
    offers: GiftOffer[];
  };
  pricing: {
    script: string;
    title: string;
    subtitle: string;
    popularBadge: string;
    accessNote: string;
    cta: string;
    ctaHref: string;
  };
  contact: {
    script: string;
    title: string;
    accent: string;
    subtitle: string;
    phoneLabel: string;
    phone: string;
    phoneHref: string;
    telegramLabel: string;
    telegramHref: string;
    whatsappLabel: string;
    whatsappHref: string;
  };
  modal: {
    title: string;
    body: string;
    hint: string;
  };
  footer: {
    brand: string;
    brandAccent: string;
    brandSuffix: string;
    tagline: string;
    productTitle: string;
    productLinks: NavLink[];
    companyTitle: string;
    companyLinks: NavLink[];
    socialTitle: string;
    rights: string;
    madeWith: string;
  };
}

export const FEATURE_ICON_KEYS = [
  "music",
  "timer",
  "images",
  "map",
  "heart",
  "globe",
  "users",
  "gift",
  "phone",
  "sparkles",
] as const;

export type FeatureIconKey = (typeof FEATURE_ICON_KEYS)[number];

export const SITE_CONTENT_KEY = "home";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    badge: "Sevgi hikoyangizning raqamli davomi",
    title1: "Sizning eng go‘zal",
    title2: "kuningiz",
    title3: "havolada:",
    subtitle: "— bir nafis havola, millionlarga arzigulik his-tuyg‘u —",
    description:
      "Mehmonlaringiz chindan ham ochib ko‘radigan onlayn to‘y taklifnomasini yarating. O‘z musiqasi, sanoq taymeri va xotira galereyasi bilan — hammasi bitta havolada.",
    ctaPrimary: "Dizaynlarni ko‘rish",
    ctaPrimaryHref: "/#designs",
    ctaSecondary: "Boshlash",
    scrollHint: "Pastga suring",
  },
  stats: [
    { value: 18, suffix: "+", label: "jonli dizayn" },
    { value: 3, suffix: "", label: "narx darajasi" },
    { value: 15, suffix: "", label: "daqiqada tayyor" },
  ],
  designs: {
    title: "Har biri —",
    accent: "jonli dizayn",
    subtitle: "Quyidagilar rasm emas — haqiqiy ishlaydigan taklifnomalar. Ustiga bosing va his qiling.",
  },
  how: {
    script: "qanday ishlaydi?",
    title: "Uch qadamda",
    accent: "tayyor",
    subtitle: "Sizdan uslub tanlovi — qolgan sehrni biz qilamiz.",
    steps: [
      {
        n: "01",
        title: "Uslubni tanlang",
        body: "18 ta jonli dizayn orasidan yurak qarorini qiling — har biri bir ko‘rinishda ko‘nglingizni zabt etadi.",
      },
      {
        n: "02",
        title: "Tafsilotlarni ayting",
        body: "Ismlar, sana, manzil, rasm va musiqani bizga ishoning — qolganini biz hal qilamiz.",
      },
      {
        n: "03",
        title: "Havolani ulashing",
        body: "Nafis havolani mehmonlaringizga yuboring — ular sizning sevgingizni his qiladi.",
      },
    ],
  },
  features: {
    script: "har bir taklifnomada",
    title: "Sehrning",
    accent: "tarkibi",
    items: [
      { icon: "music", title: "Jonli musiqa", body: "Har bir taklifnoma mehmonning birinchi bosishidayoq o‘z ohangida ochiladi." },
      { icon: "timer", title: "Sanoq taymer", body: "To‘yga qolgan kun, soat va daqiqa — jonli, har bir mehmon oldida." },
      { icon: "images", title: "Xotira galereyasi", body: "Sizning eng aziz suratlaringiz nafis va jozibali tarzda joylashtiriladi." },
      { icon: "map", title: "Google Maps", body: "Mehmon bitta bosishda to‘yxonangizga qulay yo‘l topadi." },
      { icon: "heart", title: "Shaxsiy uslub", body: "Har bir juftlik uchun alohida, faqat sizga mos dizayn yaratamiz." },
      { icon: "globe", title: "Doimiy havola", body: "Taklifnoma oila-uchun.uz domenida saqlanadi — hech qachon o‘chmaydi." },
    ],
  },
  gift: {
    script: "sovg'amiz bor",
    title: "Maxsus",
    accent: "tuhfa",
    subtitle: "Mehmonlaringiz ko‘p bo‘lsa — do‘stona yon beramiz: har ikkitadan bittasi bizdan.",
    offerCountSuffix: "ta taklifnoma",
    unlimitedLabel: "Cheksiz",
    freeCountSuffix: "tasi BEPUL",
    loveLabel: "sevgi bilan",
    payLabel: "To‘laysiz",
    getLabel: "Olasiz",
    customLabel: "Maxsus aloqa",
    badge: "Eng qulay",
    offers: [
      {
        id: "10",
        guests: 10,
        free: 5,
        icon: "heart",
        title: "Shinam to‘y",
        note: "Ya'ni 10 ta taklifnoma buyurtma qilsangiz — 5 tasini bepul tayyorlab beramiz.",
      },
      {
        id: "20",
        guests: 20,
        free: 10,
        icon: "gift",
        title: "Katta bayram",
        featured: true,
        note: "Ya'ni 20 ta taklifnoma buyurtma qilsangiz — 10 tasini bepul tayyorlab beramiz.",
      },
      {
        id: "all",
        guests: null,
        free: null,
        icon: "users",
        title: "Har bir mehmon uchun",
        note: "Har bir mehmoningiz uchun shaxsiy taklifnoma — barchasi bitta nafis uslubda.",
      },
    ],
  },
  pricing: {
    script: "sinchlash narxlari",
    title: "Tariflar",
    subtitle: "Har bir daraja o‘zidan pastdagi barcha dizaynlarga kirish beradi.",
    popularBadge: "Ommabop",
    accessNote: "{count} ta dizaynga kirish",
    cta: "Dizaynlarni ko‘rish",
    ctaHref: "/#designs",
  },
  contact: {
    script: "gaplashamizmi?",
    title: "Sevgingizni",
    accent: "raqamlashtiramiz",
    subtitle: "Savolingiz bormi yoki darhol boshlamoqchimisiz — biz bir qo‘ng‘iroq narida turibmiz.",
    phoneLabel: "Telefon",
    phone: "+998 99 917 99 27",
    phoneHref: "tel:+998999179927",
    telegramLabel: "Telegram",
    telegramHref: "https://t.me/998999179927",
    whatsappLabel: "WhatsApp",
    whatsappHref: "https://wa.me/998999179927",
  },
  modal: {
    title: "Biz bilan bog‘laning",
    body: "Taklifnomangizni yaratish uchun quyidagi raqamga qo‘ng‘iroq qiling",
    hint: "yoki Telegram / WhatsApp orqali yozing",
  },
  footer: {
    brand: "Oila",
    brandAccent: "-",
    brandSuffix: "Uchun",
    tagline: "Sevganlaringiz uchun onlayn to'y taklifnomasini yarating — har bir havola sevgi hikoyasidir.",
    productTitle: "Mahsulot",
    productLinks: [
      { label: "Dizaynlar", href: "/#designs" },
      { label: "Narxlar", href: "/#pricing" },
      { label: "Qanday ishlaydi", href: "/#how" },
    ],
    companyTitle: "Kompaniya",
    companyLinks: [
      { label: "Biz haqimizda", href: "#" },
      { label: "Maxfiylik siyosati", href: "#" },
      { label: "Foydalanish shartlari", href: "#" },
    ],
    socialTitle: "Ijtimoiy tarmoqlar",
    rights: "© 2026 Oila-Uchun. Barcha huquqlar himoyalangan.",
    madeWith: "made with love",
  },
};

// DB'dan kelgan (to'liq yoki qisman) qiymatni default bilan chuqur birlashtiradi.
// Massivlar bo'lsa — DB to'liq ustun turadi, obyektlar bo'lsa — maydonma-maydon.
export function mergeSiteContent<T>(value: unknown, base: T): T {
  if (!value || typeof value !== "object" || Array.isArray(value)) return base;

  const out = { ...base } as Record<string, unknown>;

  Object.keys(value).forEach((key) => {
    const raw = (value as Record<string, unknown>)[key];
    if (raw === undefined || raw === null) return;

    const baseValue = (base as Record<string, unknown>)[key];
    if (baseValue !== undefined && typeof baseValue === "object" && baseValue !== null && !Array.isArray(baseValue)) {
      if (typeof raw === "object" && !Array.isArray(raw)) {
        out[key] = mergeSiteContent(raw, baseValue as never);
        return;
      }
    }
    out[key] = raw;
  });

  return out as T;
}