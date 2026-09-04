import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Cormorant_Garamond,
  Great_Vibes,
  Cinzel,
  Bodoni_Moda,
  EB_Garamond,
  Italiana,
  Poiret_One,
  Montserrat,
  Allura,
  Beau_Rivage,
  DM_Sans,
  Dancing_Script,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  weight: ["400", "600"],
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const italiana = Italiana({
  variable: "--font-italiana",
  weight: "400",
  subsets: ["latin"],
});

const poiretOne = Poiret_One({
  variable: "--font-poiret-one",
  weight: "400",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const allura = Allura({
  variable: "--font-allura",
  weight: "400",
  subsets: ["latin"],
});

const beauRivage = Beau_Rivage({
  variable: "--font-beau-rivage",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onlayn to'y taklifnomasi",
  description: "To'y taklifnomangizni onlayn yarating va ulashing",
};

const FONT_VARIABLES = [
  geistSans.variable,
  geistMono.variable,
  playfair.variable,
  cormorant.variable,
  greatVibes.variable,
  cinzel.variable,
  bodoniModa.variable,
  ebGaramond.variable,
  italiana.variable,
  poiretOne.variable,
  montserrat.variable,
  allura.variable,
  beauRivage.variable,
  dmSans.variable,
  dancingScript.variable,
].join(" ");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${FONT_VARIABLES} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
