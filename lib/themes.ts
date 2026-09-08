import type { PriceTier } from "./types";

export type ThemeFamily =
  | "panel-parallax"
  | "video-hero"
  | "swan-noir"
  | "royal-frame"
  | "navy-gazebo"
  | "blush-portrait"
  | "milliy-ornament"
  | "garden-bouquet"
  | "sacred-peony"
  | "ivory-envelope"
  | "aurora-dream"
  | "amber-dawn"
  | "bloom-pulse"
  | "lux-gold"
  | "imperial-gold"
  | "editorial-plate"
  | "regal-envelope"
  | "velvet-crown";

export interface ThemeDefinition {
  id: string;
  name: string;
  family: ThemeFamily;
  minPriceTier: PriceTier;
  /** CSS custom-property name (without "--") -> value, applied as inline style on the root element. */
  colors: Record<string, string>;
  /** CSS custom-property name (without "--") -> value, e.g. "theme-script-font": "var(--font-great-vibes)". */
  fonts: Record<string, string>;
  /** panel-parallax only: which backdrop decoration to render. */
  backdrop?: "glow" | "sunburst";
  /** panel-parallax only: card style for section blocks. */
  panel?: "card" | "bordered";
  /** panel-parallax only: which SVG monogram to render. */
  monogram?: "rings" | "fan";
}

const PRICE_TIER_ORDER: Record<PriceTier, number> = {
  "150000": 0,
  "200000": 1,
  "250000": 2,
};

export const THEME_PRESETS: ThemeDefinition[] = [
  {
    id: "eternal-vow",
    name: "Men bilan butun umr birga bo'lasanmi?",
    family: "panel-parallax",
    minPriceTier: "250000",
    backdrop: "sunburst",
    panel: "bordered",
    monogram: "fan",
    colors: {
      "bg-start": "#050505",
      "bg-mid": "#0e0e0e",
      "bg-end": "#062820",
      "accent-glow": "rgba(12,61,46,0.65)",
      "glow-1": "rgba(205,163,73,0.2)",
      "glow-2": "rgba(12,61,46,0.3)",
      ivory: "#f3ead3",
      "ivory-deep": "#e7dcbc",
      ink: "#f3ead3",
      "ink-soft": "#e7dcbc",
      champagne: "#e9c876",
      gold: "#cda349",
      "gold-dim": "#8a6f34",
      "panel-tint-1": "rgba(12,61,46,0.18)",
      "panel-tint-2": "rgba(0,0,0,0.1)",
    },
    fonts: {
      "theme-script-font": "var(--font-poiret-one)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-poiret-one)",
    },
  },
  {
    id: "green-gold",
    name: "Yashil oltin",
    family: "video-hero",
    minPriceTier: "150000",
    colors: {
      bg: "#f5efe7",
      ink: "#2d4034",
      "ink-soft": "#7a8c82",
      "ink-muted": "#9aaa9f",
      gold: "#b5935b",
      pink: "#c4687a",
      dark: "#722020",
      "bg-card": "#f5efe7",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-montserrat)",
      "theme-display-font": "var(--font-playfair)",
    },
  },
  {
    id: "swan-noir-classic",
    name: "Oqqush va marvarid",
    family: "swan-noir",
    minPriceTier: "250000",
    colors: {
      black: "#0a0a0a",
      cream: "#f7f3ea",
      "cream-deep": "#ece5d3",
      ink: "#2c2620",
      "ink-soft": "#6b6154",
      gold: "#b9985a",
      "gold-deep": "#8a7040",
      pearl: "#e9e2d2",
    },
    fonts: {
      "theme-script-font": "var(--font-allura)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-poiret-one)",
    },
  },
  {
    id: "royal-champagne",
    name: "Qirollik shampani",
    family: "royal-frame",
    minPriceTier: "200000",
    colors: {
      cream: "#f7f0e0",
      "cream-deep": "#efe4c8",
      paper: "#fbf7ec",
      ink: "#2c2418",
      "ink-soft": "#6b5f48",
      gold: "#b9903e",
      "gold-deep": "#8a6a2c",
    },
    fonts: {
      "theme-script-font": "var(--font-dancing-script)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-cormorant)",
      "theme-display-font": "var(--font-bodoni-moda)",
    },
  },
  {
    id: "navy-gazebo-blue",
    name: "Lojuvard gazebo",
    family: "navy-gazebo",
    minPriceTier: "150000",
    colors: {
      bg: "#f7f4ee",
      primary: "#26486b",
      border: "#26486b2e",
      white: "#ffffff",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-montserrat)",
      "theme-label-font": "var(--font-montserrat)",
    },
  },
  {
    id: "cocoa-blush",
    name: "Kakao va pushti",
    family: "blush-portrait",
    minPriceTier: "200000",
    colors: {
      cream: "#fbf3df",
      "cream-deep": "#f4e9de",
      "paper-card": "#fbf3df",
      dark: "#3d1d13",
      ink: "#3f2b24",
      "ink-soft": "#6c5948",
      gold: "#764d2b",
      "gold-deep": "#4c3022",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-dm-sans)",
      "theme-label-font": "var(--font-dm-sans)",
    },
  },
  {
    id: "milliy-anor",
    name: "Anor bog'i",
    family: "milliy-ornament",
    minPriceTier: "200000",
    colors: {
      paper: "#f4eee4",
      "paper-card": "#fffaf2",
      ink: "#5f211f",
      "ink-soft": "#8a4a44",
      accent: "#c21612",
      gold: "#e6c472",
      "gold-deep": "#9b6f34",
      "envelope-start": "#7f1d2d",
      "envelope-end": "#4b1020",
      "envelope-text": "#fff4ea",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-cormorant)",
    },
  },
  {
    id: "garden-bloom",
    name: "Bog' gulzori",
    family: "garden-bouquet",
    minPriceTier: "200000",
    colors: {
      paper: "#eef3e8",
      "card-bg": "rgba(248,251,243,0.88)",
      "card-border": "rgba(124,145,96,0.32)",
      ink: "#2c3324",
      "ink-soft": "#5f6b52",
      accent: "#54683c",
      "accent-deep": "#3f5233",
      "accent-text": "#f4f6ef",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-cormorant)",
    },
  },
  {
    id: "sacred-peony-gold",
    name: "Muqaddas gulchambar",
    family: "sacred-peony",
    minPriceTier: "200000",
    colors: {
      cream: "#f9f0e0",
      "cream-soft": "#f6f1e8",
      parchment: "#efe4d2",
      gold: "#a67d2b",
      "gold-light": "#b48c3d",
      ink: "#6c513f",
      "ink-soft": "#846f61",
      stone: "#8c7666",
      hairline: "rgba(166, 125, 43, 0.35)",
    },
    fonts: {
      "theme-script-font": "var(--font-imperial-script)",
      "theme-body-font": "var(--font-ovo)",
      "theme-label-font": "var(--font-cinzel)",
    },
  },
  {
    id: "ivory-swan-arch",
    name: "Fil suyagi konvert",
    family: "ivory-envelope",
    minPriceTier: "250000",
    colors: {
      cream: "#f9f0e0",
      ink: "#6c513f",
      "ink-soft": "#846f61",
      gold: "#a67d2b",
      "gold-light": "#b48c3d",
      "gold-amp": "#a07b33",
      diamond: "#8c7666",
      spine: "#9c8575",
      wine: "#5a0f1b",
      "closing-bg": "#e8ddcf",
    },
    fonts: {
      "theme-script-font": "var(--font-imperial-script)",
      "theme-name-font": "var(--font-beau-rivage)",
      "theme-body-font": "var(--font-newsreader)",
      "theme-num-font": "var(--font-ovo)",
      "theme-label-font": "var(--font-cinzel)",
    },
  },
  {
    id: "aurora-dream-night",
    name: "Shimoliy shafaq",
    family: "aurora-dream",
    minPriceTier: "250000",
    colors: {
      "bg-base": "#1a1530",
      "bg-1": "#1a1530",
      "bg-2": "#2a1f4a",
      "bg-3": "#1d1640",
      "bg-4": "#0f0a25",
      "blob-1": "#ff9ec0",
      "blob-2": "#b8a3ff",
      "blob-3": "#88e5d3",
      "blob-4": "#d4ecff",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-montserrat)",
    },
  },
  {
    id: "amber-dawn-rose",
    name: "Anbar tongi",
    family: "amber-dawn",
    minPriceTier: "200000",
    colors: {
      ink: "#1f2937",
      "ink-soft": "#6b7280",
      accent: "#1976d2",
      "accent-deep": "#1565c0",
      rose: "#f43f5e",
    },
    fonts: {
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-montserrat)",
      "theme-display-font": "var(--font-playfair)",
    },
  },
  {
    id: "bloom-pulse-rose",
    name: "Pushti bahor",
    family: "bloom-pulse",
    minPriceTier: "200000",
    colors: {
      bg: "#f9f1e7",
      ink: "#3b3b3b",
      "ink-soft": "#6b6b6b",
      accent: "#1976d2",
      "bg-amber": "rgba(255,251,235,0.95)",
      "bg-rose": "rgba(255,241,242,0.95)",
      "bg-pink": "rgba(253,242,248,0.95)",
      "blob-rose": "rgba(254,205,213,0.35)",
      "blob-amber": "rgba(253,230,138,0.35)",
      "blob-pink": "rgba(251,207,232,0.35)",
      "blob-rose-solid": "#fb7185",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-display-font": "var(--font-playfair)",
      "theme-label-font": "var(--font-montserrat)",
    },
  },
  {
    id: "lux-gold-night",
    name: "Zarhal kecha",
    family: "lux-gold",
    minPriceTier: "250000",
    colors: {
      "bg-1": "#45463f",
      "bg-2": "#30322d",
      "bg-3": "#21231f",
      gold: "#c9a96e",
      "gold-light": "#f5e0a0",
      "gold-deep": "#a07840",
      ink: "#f4ead8",
      "cta-ink": "#1a0e00",
    },
    fonts: {
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-montserrat)",
      "theme-display-font": "var(--font-playfair)",
    },
  },
  {
    id: "imperial-noir-gold",
    name: "Imperial oltin",
    family: "imperial-gold",
    minPriceTier: "250000",
    colors: {
      bg: "#1a1a1a",
      "bg-card": "#2a2a2a",
      ink: "#e6ddc8",
      "ink-soft": "#9b9b9b",
      gold: "#c9a96e",
      "gold-deep": "#9b8347",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-montserrat)",
    },
  },
  {
    id: "editorial-plate-ink",
    name: "Nashr varag'i",
    family: "editorial-plate",
    minPriceTier: "250000",
    colors: {
      ink: "#1a1a1a",
      cream: "#f8f5f0",
      "cream-deep": "#f0e8df",
    },
    fonts: {
      "theme-body-font": "var(--font-cormorant)",
      "theme-display-font": "var(--font-playfair)",
    },
  },
  {
    id: "regal-navy-gold",
    name: "Zodagon konvert",
    family: "regal-envelope",
    minPriceTier: "250000",
    colors: {
      paper: "#f4eee4",
      "paper-card": "#fffaf2",
      "ink-navy": "#1c315e",
      "ink-navy-soft": "#314b7a",
      "line-strong": "#5f211f",
      shadow: "rgba(58,25,24,0.12)",
      "bg-page-start": "#fdf8f0",
      "bg-page-end": "#ece4d9",
      "card-border": "rgba(122,47,43,0.18)",
      "ornament-text": "#f6f9f2",
      "ornament-shadow": "rgba(15,37,26,0.36)",
      "gold-soft": "rgba(215,188,130,0.95)",
      "gold-strong": "rgba(215,188,130,0.98)",
      "envelope-bg-start": "#3d64b4",
      "envelope-bg-end": "#2f519b",
      "envelope-panel-top-start": "#3a60ad",
      "envelope-panel-top-end": "#2f4f98",
      "envelope-panel-side-start": "#4168b7",
      "envelope-panel-side-mid": "#385eac",
      "envelope-panel-side-end": "#30539d",
      "envelope-panel-bottom-start": "#436bbb",
      "envelope-panel-bottom-mid": "#3a61b0",
      "envelope-panel-bottom-end": "#3258a4",
      "envelope-edge-gold": "#e6c472",
      "envelope-edge-gold-light": "#f8e6ad",
      "envelope-edge-gold-deep": "#9b6f34",
      "envelope-shadow-top": "rgba(14,28,64,0.28)",
      "envelope-shadow-side": "rgba(13,24,56,0.22)",
      "envelope-shadow-bottom": "rgba(11,22,52,0.24)",
      "envelope-stage-glow": "rgba(184,209,255,0.2)",
      "envelope-text": "#f6f8ff",
      "envelope-text-soft": "rgba(246,248,255,0.92)",
      "envelope-seal-text": "#262626",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-display-font": "var(--font-playfair)",
      "theme-label-font": "var(--font-dm-sans)",
    },
  },
  {
    id: "velvet-crown-noir",
    name: "Baxmal va zar",
    family: "velvet-crown",
    minPriceTier: "250000",
    colors: {
      "bg-deep": "#0a0307",
      ink: "#f4eee0",
      "ink-soft": "#c9b0a0",
      gold: "#d4a87c",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-display-font": "var(--font-cinzel)",
    },
  },
];

export function getTheme(id: string): ThemeDefinition {
  return THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[0];
}

// Har bir family komponenti cover/second rasmni haqiqatda ishlatadimi — admin
// formasida shu maydonlarni faqat tegishli mavzular uchun ko'rsatish uchun.
const FAMILIES_WITH_COVER_PHOTO = new Set<ThemeFamily>([
  "video-hero",
  "swan-noir",
  "navy-gazebo",
  "milliy-ornament",
  "imperial-gold",
  "editorial-plate",
]);
const FAMILIES_WITH_SECOND_PHOTO = new Set<ThemeFamily>(["swan-noir"]);

export function familySupportsCoverPhoto(family: ThemeFamily): boolean {
  return FAMILIES_WITH_COVER_PHOTO.has(family);
}

export function familySupportsSecondPhoto(family: ThemeFamily): boolean {
  return FAMILIES_WITH_SECOND_PHOTO.has(family);
}

export function getUnlockedThemes(priceTier: PriceTier): ThemeDefinition[] {
  const order = PRICE_TIER_ORDER[priceTier];
  return THEME_PRESETS.filter((t) => PRICE_TIER_ORDER[t.minPriceTier] <= order);
}

export function isThemeUnlocked(themeId: string, priceTier: PriceTier): boolean {
  const theme = THEME_PRESETS.find((t) => t.id === themeId);
  if (!theme) return false;
  return PRICE_TIER_ORDER[theme.minPriceTier] <= PRICE_TIER_ORDER[priceTier];
}
