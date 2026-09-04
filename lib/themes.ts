import type { PriceTier } from "./types";

export type ThemeFamily =
  | "gold-coin"
  | "panel-parallax"
  | "envelope-calendar"
  | "door-arabic"
  | "video-hero"
  | "swan-noir"
  | "lace-oval"
  | "royal-frame"
  | "vine-frame";

export interface ThemeDefinition {
  id: string;
  name: string;
  family: ThemeFamily;
  minPriceTier: PriceTier;
  /** CSS custom-property name (without "--") -> value, applied as inline style on the root element. */
  colors: Record<string, string>;
  /** CSS custom-property name (without "--") -> value, e.g. "theme-script-font": "var(--font-great-vibes)". */
  fonts: Record<string, string>;
  /** gold-coin only: optional floating decoration emoji. */
  decorationEmoji?: string;
  /** panel-parallax only: which backdrop decoration to render. */
  backdrop?: "glow" | "sunburst";
  /** panel-parallax only: card style for section blocks. */
  panel?: "card" | "bordered";
  /** panel-parallax only: which SVG monogram to render. */
  monogram?: "rings" | "fan";
  /** envelope-calendar only: which hero layout to render. */
  heroStyle?: "photo-pair" | "photo-single" | "ornament";
}

const PRICE_TIER_ORDER: Record<PriceTier, number> = {
  "150000": 0,
  "200000": 1,
  "250000": 2,
};

const GOLD_COIN_FONTS = {
  "theme-script-font": "var(--font-great-vibes)",
  "theme-body-font": "var(--font-bodoni-moda)",
  "theme-label-font": "var(--font-cinzel)",
};

export const THEME_PRESETS: ThemeDefinition[] = [
  {
    id: "gold-classic",
    name: "Oltin klassik",
    family: "gold-coin",
    minPriceTier: "150000",
    decorationEmoji: "✨",
    colors: {
      cream: "#f6efe2",
      paper: "#fbf7ec",
      gold: "#b08c4f",
      "gold-light": "#e3cf9c",
      ink: "#3a2f22",
      "ink-soft": "#6b5f4d",
      "panel-a-1": "#caa06a",
      "panel-a-2": "#7a5a3a",
      "panel-a-3": "#4a3320",
      "panel-b-1": "#e7cba0",
      "panel-b-2": "#a9825a",
      "panel-b-3": "#6b4c30",
      "hero-from": "#3d2c1c",
      "hero-via": "#6b4e30",
      "hero-to": "#3d2c1c",
    },
    fonts: GOLD_COIN_FONTS,
  },
  {
    id: "emerald-garden",
    name: "Zumrad bog'",
    family: "gold-coin",
    minPriceTier: "150000",
    decorationEmoji: "🌿",
    colors: {
      cream: "#eef2ea",
      paper: "#f6f9f3",
      gold: "#8a9a5a",
      "gold-light": "#c3d3a0",
      ink: "#233022",
      "ink-soft": "#4f5f49",
      "panel-a-1": "#7a9a6a",
      "panel-a-2": "#3a5a3a",
      "panel-a-3": "#1f331f",
      "panel-b-1": "#c3d3a0",
      "panel-b-2": "#7a9a6a",
      "panel-b-3": "#3a5a3a",
      "hero-from": "#1c2a1c",
      "hero-via": "#3a4e30",
      "hero-to": "#1c2a1c",
    },
    fonts: GOLD_COIN_FONTS,
  },
  {
    id: "midnight-navy",
    name: "Tungi lojuvard",
    family: "gold-coin",
    minPriceTier: "200000",
    colors: {
      cream: "#eef1f6",
      paper: "#f5f7fb",
      gold: "#c9a227",
      "gold-light": "#e6cf7a",
      ink: "#1c2333",
      "ink-soft": "#4a5468",
      "panel-a-1": "#3a4a6c",
      "panel-a-2": "#1c2440",
      "panel-a-3": "#0e1428",
      "panel-b-1": "#5a6a8c",
      "panel-b-2": "#2c3a5c",
      "panel-b-3": "#16203a",
      "hero-from": "#0e1428",
      "hero-via": "#2c3a5c",
      "hero-to": "#0e1428",
    },
    fonts: GOLD_COIN_FONTS,
  },
  {
    id: "rose-blush",
    name: "Pushti orzu",
    family: "gold-coin",
    minPriceTier: "200000",
    decorationEmoji: "🌸",
    colors: {
      cream: "#f9eef0",
      paper: "#fdf6f7",
      gold: "#c98a93",
      "gold-light": "#f0c9cf",
      ink: "#4a2e33",
      "ink-soft": "#7a5a5f",
      "panel-a-1": "#d99aa3",
      "panel-a-2": "#8a4a52",
      "panel-a-3": "#5a2e33",
      "panel-b-1": "#f0c9cf",
      "panel-b-2": "#c98a93",
      "panel-b-3": "#8a4a52",
      "hero-from": "#3a2226",
      "hero-via": "#7a4a50",
      "hero-to": "#3a2226",
    },
    fonts: GOLD_COIN_FONTS,
  },
  {
    id: "lavender-dream",
    name: "Binafsha orzu",
    family: "gold-coin",
    minPriceTier: "250000",
    colors: {
      cream: "#f3eef6",
      paper: "#faf7fb",
      gold: "#a888c9",
      "gold-light": "#d6c3ea",
      ink: "#332a3d",
      "ink-soft": "#5f5468",
      "panel-a-1": "#9a7ac0",
      "panel-a-2": "#5a3a80",
      "panel-a-3": "#331f4a",
      "panel-b-1": "#c3a8e0",
      "panel-b-2": "#9a7ac0",
      "panel-b-3": "#5a3a80",
      "hero-from": "#241a30",
      "hero-via": "#4a3560",
      "hero-to": "#241a30",
    },
    fonts: GOLD_COIN_FONTS,
  },
  {
    id: "violet-night",
    name: "Binafsha tun",
    family: "panel-parallax",
    minPriceTier: "150000",
    backdrop: "glow",
    panel: "card",
    monogram: "rings",
    colors: {
      "bg-start": "#2a0f1c",
      "bg-mid": "#341226",
      "bg-end": "#190a12",
      "accent-glow": "rgba(122,33,56,0.55)",
      "glow-1": "rgba(190,100,120,0.38)",
      "glow-2": "rgba(201,162,90,0.22)",
      ivory: "#f7f0e6",
      "ivory-deep": "#efe3cf",
      ink: "#2c1c20",
      "ink-soft": "#5a4247",
      champagne: "#d9bd88",
      gold: "#c9a25a",
      "gold-dim": "#a9895a",
    },
    fonts: {
      "theme-script-font": "var(--font-italiana)",
      "theme-body-font": "var(--font-eb-garamond)",
      "theme-label-font": "var(--font-eb-garamond)",
    },
  },
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
    id: "burgundy-envelope",
    name: "Burgundiya konvert",
    family: "envelope-calendar",
    minPriceTier: "150000",
    heroStyle: "photo-pair",
    colors: {
      paper: "#f4eee4",
      "paper-card": "#fffaf2",
      ink: "#2c1210",
      "ink-soft": "#6b4a46",
      accent: "#c21612",
      gold: "#e6c472",
      "gold-deep": "#9b6f34",
      "envelope-start": "#7f1d2d",
      "envelope-mid": "#932b39",
      "envelope-end": "#4b1020",
      "envelope-text": "#fff4ea",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-cinzel)",
    },
  },
  {
    id: "navy-envelope",
    name: "Lojuvard konvert",
    family: "envelope-calendar",
    minPriceTier: "200000",
    heroStyle: "photo-single",
    colors: {
      paper: "#eef1f6",
      "paper-card": "#f8fafc",
      ink: "#1c315e",
      "ink-soft": "#3a4a6c",
      accent: "#1c315e",
      gold: "#d7bc82",
      "gold-deep": "#9b8148",
      "envelope-start": "#1c315e",
      "envelope-mid": "#243f78",
      "envelope-end": "#0e1830",
      "envelope-text": "#fff4ea",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-cinzel)",
    },
  },
  {
    id: "desert-ornament",
    name: "Sahro bezaklari",
    family: "door-arabic",
    minPriceTier: "150000",
    decorationEmoji: "🌸",
    colors: {
      sand: "#f2e8d5",
      "sand-deep": "#e8d9b8",
      ink: "#3a2a1c",
      "ink-soft": "#6b5540",
      gold: "#b6851e",
      terracotta: "#a94b3c",
      "door-start": "#c98a5a",
      "door-mid": "#a9663f",
      "door-end": "#6b3f26",
      seal: "#8a2f22",
    },
    fonts: {
      "theme-script-font": "var(--font-playfair)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-cinzel)",
    },
  },
  {
    id: "emerald-door",
    name: "Zumrad eshik",
    family: "door-arabic",
    minPriceTier: "250000",
    decorationEmoji: "🌿",
    colors: {
      sand: "#eef2ea",
      "sand-deep": "#dde6d4",
      ink: "#1f331f",
      "ink-soft": "#4a5f45",
      gold: "#8a9a5a",
      terracotta: "#5a7a4a",
      "door-start": "#3a5a3a",
      "door-mid": "#2a4530",
      "door-end": "#152819",
      seal: "#c9a25a",
    },
    fonts: {
      "theme-script-font": "var(--font-playfair)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-cinzel)",
    },
  },
  {
    id: "ivory-gold",
    name: "Fil suyagi va oltin",
    family: "door-arabic",
    minPriceTier: "200000",
    decorationEmoji: "✨",
    colors: {
      sand: "#fbfaf3",
      "sand-deep": "#eee9e5",
      ink: "#4a4643",
      "ink-soft": "#57524f",
      gold: "#b9903e",
      terracotta: "#f2d88f",
      "door-start": "#eee9e5",
      "door-mid": "#d9cfa8",
      "door-end": "#b9903e",
      seal: "#4a4643",
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
    id: "lace-rosewood",
    name: "Rozvud to'r",
    family: "lace-oval",
    minPriceTier: "200000",
    colors: {
      dark: "#3a1f18",
      "dark-deep": "#2a1610",
      cream: "#f4ead8",
      "cream-deep": "#e9dcc2",
      ink: "#3a2a20",
      "ink-soft": "#6b5a4a",
      gold: "#b98a4f",
      "gold-deep": "#8a6538",
    },
    fonts: {
      "theme-script-font": "var(--font-beau-rivage)",
      "theme-body-font": "var(--font-dm-sans)",
      "theme-label-font": "var(--font-dm-sans)",
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
    id: "vine-navy",
    name: "To'q ko'k tokzor",
    family: "vine-frame",
    minPriceTier: "200000",
    colors: {
      cream: "#f7f3ea",
      ink: "#1c3a5e",
      "ink-soft": "#4a5f7a",
    },
    fonts: {
      "theme-script-font": "var(--font-great-vibes)",
      "theme-body-font": "var(--font-cormorant)",
      "theme-label-font": "var(--font-montserrat)",
      "theme-display-font": "var(--font-cormorant)",
    },
  },
];

export function getTheme(id: string): ThemeDefinition {
  return THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[0];
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
