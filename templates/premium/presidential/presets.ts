import type { ThemeDefinition } from "@/lib/themes";

export const PRESIDENTIAL_THEMES: ThemeDefinition[] = [
  {
    id: "prizidentiskiy-ivory",
    name: "PRIZIDENTISKIY · I",
    family: "presidential",
    minPriceTier: "250000",
    collection: "signature",
    description: "Fil suyagi rangidagi qog‘oz, qora serif yozuv va mutanosib bo‘shliqlar. Jiddiy, kamtarin taklifnoma.",
    colors: { bg: "#f5f3ed", paper: "#fcfbf7", ink: "#222723", gold: "#777c71", accent: "#777c71", "ink-soft": "#666d64", line: "#d6d8cf" },
    fonts: { "theme-display-font": "var(--font-cormorant)", "theme-body-font": "var(--font-dm-sans)" },
  },
  {
    id: "prizidentiskiy-navy",
    name: "PRIZIDENTISKIY · II",
    family: "presidential",
    minPriceTier: "250000",
    collection: "signature",
    description: "To‘q ko‘k, iliq oq yozuvlar va tartibli sahifa kompozitsiyasi. Vazmin va rasmiy uslub.",
    colors: { bg: "#122132", paper: "#192a3d", ink: "#f1eee5", gold: "#a7adb4", accent: "#a7adb4", "ink-soft": "#bac1c8", line: "#3b4a59" },
    fonts: { "theme-display-font": "var(--font-newsreader)", "theme-body-font": "var(--font-dm-sans)" },
  },
];
