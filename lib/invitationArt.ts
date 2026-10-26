import type { ThemeDefinition } from "./themes";
import { premiumArtwork } from "./templateDesigns";

export type InvitationLayout = "winter" | "autumn" | "summer" | "gold" | "sky" | "estate" | "cinema" | "floral" | "editorial" | "royal" | "coastal" | "botanical";

export interface InvitationArt {
  title: string;
  subtitle: string;
  layout: InvitationLayout;
  bg: string;
  paper: string;
  ink: string;
  accent: string;
  muted: string;
}

export const INVITATION_ART: Record<string, InvitationArt> = {
  "eternal-vow": { title: "Vow", subtitle: "Birga — bugun, ertaga va abadiy", layout: "estate", bg: "#0e211d", paper: "#16312a", ink: "#f2ead8", accent: "#d3b575", muted: "#b7bdac" },
  "green-gold": { title: "Olivier", subtitle: "Muhabbatning eng go‘zal fasli", layout: "botanical", bg: "#f3f1e7", paper: "#fbf9ee", ink: "#364b3c", accent: "#8b9369", muted: "#74816e" },
  "swan-noir-classic": { title: "Swan", subtitle: "Sadoqatning oppoq timsoli", layout: "cinema", bg: "#151719", paper: "#202426", ink: "#f5f1e7", accent: "#c6c1ab", muted: "#a9acaa" },
  "royal-champagne": { title: "Champagne", subtitle: "Qalbimizning eng nafis tantanasi", layout: "royal", bg: "#f3edde", paper: "#fcf7eb", ink: "#53432d", accent: "#ab8d58", muted: "#8b7b62" },
  "navy-gazebo-blue": { title: "Azure", subtitle: "Ko‘l bo‘yidagi go‘zal va’da", layout: "coastal", bg: "#edf2f4", paper: "#f8fbfc", ink: "#2d4b68", accent: "#7d9db2", muted: "#718697" },
  "cocoa-blush": { title: "Velours", subtitle: "Iliqlik bilan yozilgan sevgi hikoyasi", layout: "floral", bg: "#f4e9e2", paper: "#fff7f0", ink: "#614136", accent: "#b88977", muted: "#9b7e72" },
  "milliy-anor": { title: "Anor", subtitle: "Qadriyatlar ila boshlangan yangi hayot", layout: "royal", bg: "#f4eade", paper: "#fff7eb", ink: "#692e32", accent: "#aa7852", muted: "#967564" },
  "garden-bloom": { title: "Jardin", subtitle: "Muhabbatimiz gullagan bog‘", layout: "botanical", bg: "#eff1e7", paper: "#fafbef", ink: "#3f503a", accent: "#8c986c", muted: "#7c8872" },
  "sacred-peony-gold": { title: "Pivoine", subtitle: "Beg‘ubor niyatlar, go‘zal taqdir", layout: "floral", bg: "#f5eee2", paper: "#fff9ef", ink: "#73604a", accent: "#b69a67", muted: "#9c8d76" },
  "ivory-swan-arch": { title: "Ivory", subtitle: "Sokin bir lahzadan abadiyatga", layout: "royal", bg: "#f5f0e8", paper: "#fffaf3", ink: "#6a594a", accent: "#b79d79", muted: "#988a7a" },
  "aurora-dream-night": { title: "Aurora", subtitle: "Yulduzlar guvoh bo‘lgan muhabbat", layout: "cinema", bg: "#15182b", paper: "#1f243b", ink: "#f0eafa", accent: "#baa7dc", muted: "#b1b0ce" },
  "amber-dawn-rose": { title: "Aube", subtitle: "Baxtimizning oltin tongi", layout: "estate", bg: "#f4e7dc", paper: "#fff5e8", ink: "#785444", accent: "#bb8c66", muted: "#a18674" },
  "bloom-pulse-rose": { title: "Roseraie", subtitle: "Har bir lahzada muhabbat", layout: "floral", bg: "#f7eaf0", paper: "#fff7fa", ink: "#78515d", accent: "#bd8a9a", muted: "#a1848d" },
  "lux-gold-night": { title: "Lumière", subtitle: "Oltin yog‘dudagi unutilmas oqshom", layout: "cinema", bg: "#20231e", paper: "#2b3028", ink: "#f2e7cf", accent: "#c4a36a", muted: "#bbb79f" },
  "imperial-noir-gold": { title: "Impérial", subtitle: "Muhabbatimizga munosib tantana", layout: "estate", bg: "#141715", paper: "#222923", ink: "#f0e3c6", accent: "#c4a26a", muted: "#b9ad93" },
  "editorial-plate-ink": { title: "Éditorial", subtitle: "Hayotimizning yangi sahifasi", layout: "editorial", bg: "#f2f0e9", paper: "#faf9f3", ink: "#282b29", accent: "#888b7e", muted: "#7c8077" },
  "regal-navy-gold": { title: "Royale", subtitle: "Ko‘nglimizdagi qirollik oqshomi", layout: "royal", bg: "#10283b", paper: "#18364c", ink: "#f4ead5", accent: "#c8ae76", muted: "#adb8ba" },
  "velvet-crown-noir": { title: "Couronne", subtitle: "Qalblarimizning eng go‘zal bayrami", layout: "estate", bg: "#26151d", paper: "#35212c", ink: "#f5e7da", accent: "#c4a077", muted: "#bc9eaa" },
};

export function invitationArtwork(theme: ThemeDefinition): string {
  return premiumArtwork(theme.id);
}
