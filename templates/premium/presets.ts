import type { ThemeDefinition } from "@/lib/themes";

export const PREMIUM_THEMES: ThemeDefinition[] = [
  {
    id: "premium-qish", name: "Qish · Cristal", family: "premium-qish", minPriceTier: "250000",
    collection: "signature", description: "Qor sukunati, billur arkalar va kumush yog‘dusi.",
    colors: { bg: "#edf2f5", paper: "#f5f7f8", ink: "#243c4a", gold: "#94abb9", accent: "#627f92", "ink-soft": "#657780" },
    fonts: { "theme-display-font": "var(--font-cormorant)", "theme-script-font": "var(--font-imperial-script)", "theme-body-font": "var(--font-dm-sans)" },
  },
  {
    id: "premium-kuz", name: "Kuz · Amber", family: "premium-kuz", minPriceTier: "250000",
    collection: "signature", description: "Kuzgi saroy, misrang yaproqlar va iliq muhabbat.",
    colors: { bg: "#251a17", paper: "#34231d", ink: "#f5e7d2", gold: "#d6a36f", accent: "#d6a36f", "ink-soft": "#c7ae96" },
    fonts: { "theme-display-font": "var(--font-bodoni-moda)", "theme-script-font": "var(--font-allura)", "theme-body-font": "var(--font-dm-sans)" },
  },
  {
    id: "premium-yoz", name: "Yoz · Riviera", family: "premium-yoz", minPriceTier: "250000",
    collection: "signature", description: "Dengiz nafasi, oppoq gullar va quyoshli bog‘.",
    colors: { bg: "#f7f5eb", paper: "#fffdf5", ink: "#344c42", gold: "#a5a779", accent: "#75876b", "ink-soft": "#7e8774" },
    fonts: { "theme-display-font": "var(--font-cormorant)", "theme-script-font": "var(--font-great-vibes)", "theme-body-font": "var(--font-dm-sans)" },
  },
  {
    id: "premium-tilla-hayot", name: "Tilla va Hayot · Éternité", family: "premium-tilla-hayot", minPriceTier: "250000",
    collection: "signature", description: "Zumrad saroy, tirik novdalar va oltin abadiyat.",
    colors: { bg: "#0b211c", paper: "#122c24", ink: "#f4ead3", gold: "#d4b574", accent: "#d4b574", "ink-soft": "#b6bba2" },
    fonts: { "theme-display-font": "var(--font-cinzel)", "theme-script-font": "var(--font-imperial-script)", "theme-body-font": "var(--font-dm-sans)" },
  },
  {
    id: "premium-moviy-osmon", name: "Moviy osmon · Céleste", family: "premium-moviy-osmon", minPriceTier: "250000",
    collection: "signature", description: "Bulutlar ustidagi oq arkalar va cheksiz moviylik.",
    colors: { bg: "#eef4fb", paper: "#f8faff", ink: "#344f72", gold: "#98b5d5", accent: "#7d9fc7", "ink-soft": "#738ba6" },
    fonts: { "theme-display-font": "var(--font-bodoni-moda)", "theme-script-font": "var(--font-beau-rivage)", "theme-body-font": "var(--font-dm-sans)" },
  },
];
