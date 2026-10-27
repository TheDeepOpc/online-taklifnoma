import { THEME_PRESETS, getUnlockedThemes } from "@/lib/themes";
import type { SiteContent } from "@/lib/siteContent";
import { PRICE_TIER_LABELS, type PriceTier } from "@/lib/types";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://oila-uchun.uz").replace(/\/$/, "");
export const SITE_NAME = "Oila-Uchun";

/** Asosiy kalit so'z sarlavha boshida; 59 belgi — Google qisqartirmaydi. */
export const HOME_TITLE = "Onlayn to‘y taklifnomasi — elektron taklifnoma | Oila-Uchun";
/** ~157 belgi: qidiruv so'zlari tabiiy holda, oxirida harakatga chaqiruv. */
export const HOME_DESCRIPTION = `Onlayn to‘y taklifnomasi yarating: ${THEME_PRESETS.length} ta zamonaviy dizayn, musiqa, suratlar, xarita va har bir mehmonga shaxsiy havola. Telegram va WhatsApp orqali yuboring.`;

/**
 * Saytning umumiy ulashish rasmi (`app/opengraph-image.tsx`). Sahifa o'z
 * `openGraph`'ini bersa, ildizdagi rasm meros o'tmaydi — shuning uchun aniq beriladi.
 */
export const SITE_SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Oila-Uchun — onlayn to‘y taklifnomalari",
};

export const KEYWORDS = [
  "onlayn to‘y taklifnomasi",
  "to‘yga taklifnoma",
  "toyga taklifnoma",
  "elektron taklifnoma",
  "elektron to‘y taklifnomasi",
  "zamonaviy taklifnoma sayti",
  "to‘y taklifnomasi yaratish",
  "to‘yga taklifnoma yozish",
  "taklifnoma qilish",
  "online taklifnoma",
];

const PRICE_TIERS: { tier: PriceTier; name: string }[] = [
  { tier: "150000", name: "Essential" },
  { tier: "200000", name: "Elegance" },
  { tier: "250000", name: "Signature" },
];

/** Bosh sahifadagi savol-javoblar: sahifada ko'rinadi va FAQPage JSON-LD'ga ham kiradi. */
export const HOME_FAQ: [question: string, answer: string][] = [
  ["Onlayn to‘y taklifnomasi nima?", "Onlayn (elektron) to‘y taklifnomasi — qog‘oz o‘rniga mehmonlarga havola orqali yuboriladigan taklifnoma sahifasi. Unda ismlaringiz, to‘y sanasi va vaqti, to‘yxona xaritasi, musiqa va suratlaringiz jamlanadi."],
  ["To‘yga taklifnoma qanday qilinadi?", `Kolleksiyadagi ${THEME_PRESETS.length} ta dizayndan birini tanlaysiz va ismlar, sana, vaqt hamda manzilni bizga yuborasiz. Biz taklifnomani tayyorlab, mehmonlarga yuboriladigan havolani beramiz.`],
  ["Mehmonlar ilova o‘rnatishi kerakmi?", "Yo‘q. Havola telefon yoki kompyuter brauzerida ochiladi. Taklifnomani Telegram va WhatsApp orqali yuborishingiz mumkin."],
  ["Taklifnomani tayyorlash uchun nimalar kerak?", "Ismlar, to‘y sanasi, vaqti va manzilini yuborasiz. Istasangiz, sevimli rasmlaringiz, musiqa va alohida tilaklaringizni ham qo‘shamiz."],
  ["To‘yga taklifnoma matnini qanday yozish mumkin?", "Taklif so‘zlarini o‘zingiz yozishingiz yoki tayyor nafis matnlardan foydalanishingiz mumkin. Taklifnomaga to‘y dasturi va mehmonlarga tilaklar ham qo‘shiladi."],
  ["Har bir mehmon uchun alohida murojaat bo‘ladimi?", "Ha. Bitta taklifnomani har bir mehmoningizning ismi yozilgan shaxsiy havola bilan yuborish mumkin."],
  ["Elektron taklifnoma narxi qancha?", `Uchta tarif bor: ${PRICE_TIERS.map(({ tier }) => PRICE_TIER_LABELS[tier].replace(" so'm", "")).join(", ").replace(/, (?=[^,]*$)/, " va ")} so‘m. Tarif qancha yuqori bo‘lsa, shuncha ko‘p dizayn ochiladi.`],
  ["Musiqa qachon boshlanadi?", "Mehmon «Taklifnomani ochish» tugmasini bosganda siz tanlagan musiqa boshlanadi. Uni to‘xtatish va qayta yoqish tugmasi ham bor."],
];

/**
 * Bosh sahifa uchun Schema.org: tashkilot, sayt, xizmat (narxlari bilan) va
 * savol-javoblar. Kontakt ma'lumotlari admin tahrirlaydigan matnlardan olinadi.
 */
export function homeJsonLd(contact: SiteContent["contact"]) {
  const organizationId = `${SITE_URL}/#organization`;
  const telephone = contact.phoneHref.replace(/^tel:/, "");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        alternateName: "Oila Uchun",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-icon.png`, width: 180, height: 180 },
        image: `${SITE_URL}/opengraph-image`,
        description: HOME_DESCRIPTION,
        areaServed: { "@type": "Country", name: "O‘zbekiston" },
        ...(telephone
          ? { contactPoint: { "@type": "ContactPoint", telephone, contactType: "customer service", availableLanguage: "uz" } }
          : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: HOME_DESCRIPTION,
        inLanguage: "uz",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#service`,
        name: "Onlayn to‘y taklifnomasi",
        serviceType: "Elektron to‘y taklifnomasi yaratish",
        description: HOME_DESCRIPTION,
        url: SITE_URL,
        provider: { "@id": organizationId },
        areaServed: { "@type": "Country", name: "O‘zbekiston" },
        offers: PRICE_TIERS.map(({ tier, name }) => ({
          "@type": "Offer",
          name,
          description: `${getUnlockedThemes(tier).length} ta dizayn, musiqa, sanoq taymeri, xarita va shaxsiy mehmon havolalari`,
          price: tier,
          priceCurrency: "UZS",
          url: `${SITE_URL}/#pricing`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: HOME_FAQ.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };
}

/** JSON-LD'ni `<script>` ichiga xavfsiz joylash (`</script>` bilan yorib chiqib bo'lmasin). */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
