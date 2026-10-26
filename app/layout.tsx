import type { Metadata } from "next";
import {
  Geist,
  Playfair_Display,
  Cormorant_Garamond,
  Great_Vibes,
  Cinzel,
  Bodoni_Moda,
  Poiret_One,
  Montserrat,
  Allura,
  Beau_Rivage,
  DM_Sans,
  Dancing_Script,
  Imperial_Script,
  Ovo,
  Newsreader,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

// Quyidagi shriftlar faqat taklifnoma shablonlarida kerak: `preload: false` —
// har sahifada oldindan yuklanmaydi, shablon ularni ishlatganda yuklanadi.
// (Ilgari 21 ta shrift har sahifada preload qilinardi: ~28 so'rov / ~930 KB.)
const greatVibes = Great_Vibes({
  preload: false,
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  preload: false,
  variable: "--font-cinzel",
  weight: ["400", "600"],
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  preload: false,
  variable: "--font-bodoni-moda",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const poiretOne = Poiret_One({
  preload: false,
  variable: "--font-poiret-one",
  weight: "400",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  preload: false,
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const allura = Allura({
  preload: false,
  variable: "--font-allura",
  weight: "400",
  subsets: ["latin"],
});

const beauRivage = Beau_Rivage({
  preload: false,
  variable: "--font-beau-rivage",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  preload: false,
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

const imperialScript = Imperial_Script({
  preload: false,
  variable: "--font-imperial-script",
  weight: "400",
  subsets: ["latin"],
});

const ovo = Ovo({
  preload: false,
  variable: "--font-ovo",
  weight: "400",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  preload: false,
  variable: "--font-newsreader",
  weight: ["200", "300", "400", "500"],
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  preload: false,
  variable: "--font-dancing-script",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) } : {}),
  title: "Oila-Uchun — nafis onlayn to‘y taklifnomalari",
  description: "Muhabbatingizga mos onlayn taklifnoma: alohida dizaynlar, sevimli musiqa, suratlar va har bir mehmonga shaxsiy havola. To‘yingiz uchun nafis boshlanish.",
  openGraph: {
    title: "Oila-Uchun — bir havola, bir umrga xotira",
    description: "To‘yingizga mos nafis dizayn, musiqa va shaxsiy murojaat. Taklifnomalar kolleksiyasini jonli ko‘ring.",
    siteName: "Oila-Uchun",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oila-Uchun — nafis onlayn taklifnomalar",
    description: "Bir havola. Bir umrga xotira. To‘yingizga mos taklifnomani tanlang.",
  },
};

const FONT_VARIABLES = [
  geistSans.variable,
  playfair.variable,
  cormorant.variable,
  greatVibes.variable,
  cinzel.variable,
  bodoniModa.variable,
  poiretOne.variable,
  montserrat.variable,
  allura.variable,
  beauRivage.variable,
  dmSans.variable,
  dancingScript.variable,
  imperialScript.variable,
  ovo.variable,
  newsreader.variable,
].join(" ");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${FONT_VARIABLES} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
