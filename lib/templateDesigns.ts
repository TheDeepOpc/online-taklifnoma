export type SectionId = "letter" | "portrait" | "quote" | "date" | "venue" | "schedule" | "gallery" | "wishes" | "gift" | "footer";
export type Atmosphere = "rosepetals" | "leaves" | "clouds" | "stars" | "petals" | "pearls" | "pollen" | "gold" | "heritage";
export type Ornament = "gold" | "uzbek" | "floral" | "silver" | "botanical" | "pearl";
export type GateScene = "mirror" | "suzani" | "sky" | "royal" | "garden" | "autumn" | "eternity";
export const GATE_ART_PLATES: Record<GateScene, string> = {
  mirror: "opera-rubis", suzani: "samarqand-palace", sky: "celestial-crystal", royal: "royal-correspondence",
  garden: "jardin-de-verre", autumn: "amber-heirloom", eternity: "emerald-treasury",
};
export const ATELIER_SCENES: Record<string, GateScene> = {
  "atelier-opera-rubis": "mirror", "atelier-samarqand-palace": "suzani", "atelier-cristal-celeste": "sky",
  "atelier-lettre-royale": "royal", "atelier-jardin-de-verre": "garden", "atelier-album-heritage": "autumn", "atelier-tresor-eternel": "eternity",
};
export interface TemplateDesign {
  hero: string;
  motion: string;
  effect: Atmosphere;
  ornament: Ornament;
  groups: SectionId[][];
  columns: string;
  gate?: GateScene;
}

const end: SectionId[][] = [["wishes"], ["gift"], ["footer"]];
export const TEMPLATE_DESIGNS: Record<string, TemplateDesign> = {
  "eternal-vow": { hero: "cascade", motion: "waterfall", effect: "gold", ornament: "gold", columns: "1.15fr .85fr", groups: [["quote"],["letter","portrait"],["date"],["venue"],["gallery","schedule"],...end] },
  "green-gold": { hero: "herbarium", motion: "pressed-leaf", effect: "pollen", ornament: "botanical", columns: ".85fr 1.15fr", groups: [["letter"],["portrait","quote"],["venue"],["date"],["schedule","gallery"],...end] },
  "swan-noir-classic": { hero: "diptych", motion: "reflection", effect: "pearls", ornament: "pearl", columns: "1fr 1fr", groups: [["portrait"],["letter"],["quote","venue"],["date"],["gallery"],["schedule"],...end] },
  "royal-champagne": { hero: "triptych", motion: "chandelier", effect: "gold", ornament: "gold", columns: "1.35fr .65fr", groups: [["letter"],["date"],["portrait","quote"],["schedule"],["venue"],["gallery"],...end] },
  "navy-gazebo-blue": { hero: "postcard", motion: "postcard-turn", effect: "clouds", ornament: "silver", columns: "1fr 1.25fr", groups: [["venue"],["letter"],["date"],["quote","portrait"],["gallery","schedule"],...end] },
  "cocoa-blush": { hero: "couture", motion: "silk-fold", effect: "petals", ornament: "floral", columns: "1.2fr 1fr", groups: [["portrait","letter"],["date"],["gallery"],["quote","venue"],["schedule"],...end] },
  "milliy-anor": { hero: "heritage", motion: "suzani-unfold", effect: "heritage", ornament: "uzbek", columns: "1fr 1fr", groups: [["letter"],["date"],["venue","schedule"],["portrait"],["quote"],["gallery"],...end] },
  "garden-bloom": { hero: "ledger", motion: "garden-sway", effect: "pollen", ornament: "botanical", columns: ".75fr 1.25fr", groups: [["letter","portrait"],["gallery"],["date"],["quote"],["venue","schedule"],...end] },
  "sacred-peony-gold": { hero: "floral-jewel", motion: "peony-bloom", effect: "petals", ornament: "floral", columns: "1.25fr .75fr", groups: [["quote"],["letter"],["portrait"],["date"],["schedule","venue"],["gallery"],...end] },
  "ivory-swan-arch": { hero: "silk-letter", motion: "letter-lift", effect: "pearls", ornament: "pearl", columns: "1fr 1.1fr", groups: [["letter"],["portrait"],["date"],["quote","gallery"],["venue"],["schedule"],...end] },
  "aurora-dream-night": { hero: "orbit", motion: "aurora-wave", effect: "stars", ornament: "silver", columns: ".8fr 1.2fr", groups: [["quote"],["date"],["letter","portrait"],["gallery"],["venue"],["schedule"],...end] },
  "amber-dawn-rose": { hero: "horizon", motion: "sunrise-strips", effect: "pollen", ornament: "gold", columns: "1.3fr .7fr", groups: [["letter"],["quote"],["portrait","gallery"],["date"],["schedule"],["venue"],...end] },
  "bloom-pulse-rose": { hero: "rosette", motion: "rose-pulse", effect: "petals", ornament: "floral", columns: "1fr .9fr", groups: [["portrait","quote"],["letter"],["gallery"],["date"],["venue"],["schedule"],...end] },
  "lux-gold-night": { hero: "light-curtain", motion: "gold-cascade", effect: "gold", ornament: "gold", columns: ".9fr 1.1fr", groups: [["quote"],["portrait"],["letter"],["date"],["venue","gallery"],["schedule"],...end] },
  "imperial-noir-gold": { hero: "staircase", motion: "ascending-marble", effect: "gold", ornament: "gold", columns: "1.4fr .6fr", groups: [["letter"],["date"],["quote"],["schedule","portrait"],["venue"],["gallery"],...end] },
  "editorial-plate-ink": { hero: "fashion-cover", motion: "editorial-cut", effect: "pearls", ornament: "silver", columns: ".7fr 1.3fr", groups: [["portrait"],["letter","quote"],["gallery"],["venue"],["date"],["schedule"],...end] },
  "regal-navy-gold": { hero: "heraldry", motion: "heraldic-rise", effect: "gold", ornament: "gold", columns: "1.1fr .9fr", groups: [["date"],["letter"],["portrait","venue"],["quote"],["schedule"],["gallery"],...end] },
  "velvet-crown-noir": { hero: "theatre", motion: "velvet-curtain", effect: "gold", ornament: "gold", columns: "1fr 1.3fr", groups: [["quote"],["letter"],["date"],["portrait"],["gallery","venue"],["schedule"],...end] },
  "premium-bardoviy-atirgul": { hero: "rose-album", motion: "rose-album-open", effect: "rosepetals", ornament: "gold", columns: "1fr 1fr", groups: [["letter","portrait"],["quote"],["date"],["gallery"],["schedule","venue"],...end] },
  "premium-kuz": { hero: "scrapbook", motion: "autumn-tumble", effect: "leaves", ornament: "gold", columns: "1.2fr .8fr", groups: [["portrait","gallery"],["letter"],["quote"],["date"],["venue","schedule"],...end] },
  "premium-yoz": { hero: "riviera-magazine", motion: "sea-breeze", effect: "petals", ornament: "floral", columns: ".9fr 1.25fr", groups: [["letter"],["venue","portrait"],["gallery"],["date"],["quote"],["schedule"],...end] },
  "premium-tilla-hayot": { hero: "gold-exhibition", motion: "living-gold", effect: "gold", ornament: "gold", columns: "1.3fr 1fr", groups: [["quote"],["date"],["portrait","letter"],["venue"],["schedule"],["gallery"],...end] },
  "premium-moviy-osmon": { hero: "sky-panorama", motion: "cloud-drift", effect: "clouds", ornament: "silver", columns: "1fr 1.2fr", groups: [["letter"],["quote"],["date"],["gallery","portrait"],["schedule"],["venue"],...end] },
  "atelier-opera-rubis": { hero: "atelier-opera", motion: "stage-arrival", effect: "rosepetals", ornament: "gold", gate: "mirror", columns: "1fr 1fr", groups: [["quote"],["letter"],["date"],["portrait","gallery"],["venue"],["schedule"],...end] },
  "atelier-samarqand-palace": { hero: "atelier-palace", motion: "palace-procession", effect: "heritage", ornament: "uzbek", gate: "suzani", columns: ".8fr 1.2fr", groups: [["letter"],["venue"],["date","schedule"],["portrait"],["quote"],["gallery"],...end] },
  "atelier-cristal-celeste": { hero: "atelier-crystal", motion: "crystal-refraction", effect: "clouds", ornament: "silver", gate: "sky", columns: "1.2fr .8fr", groups: [["date"],["quote"],["letter","portrait"],["gallery"],["venue"],["schedule"],...end] },
  "atelier-lettre-royale": { hero: "atelier-letter", motion: "royal-correspondence", effect: "pearls", ornament: "pearl", gate: "royal", columns: "1fr 1fr", groups: [["letter"],["portrait"],["gallery","quote"],["date"],["venue","schedule"],...end] },
  "atelier-jardin-de-verre": { hero: "atelier-conservatory", motion: "conservatory-light", effect: "pollen", ornament: "botanical", gate: "garden", columns: "1.1fr .9fr", groups: [["portrait"],["letter","date"],["gallery"],["venue"],["quote","schedule"],...end] },
  "atelier-album-heritage": { hero: "atelier-album", motion: "heirloom-pages", effect: "leaves", ornament: "gold", gate: "autumn", columns: "1fr 1fr", groups: [["gallery"],["letter","portrait"],["quote"],["schedule"],["date"],["venue"],...end] },
  "atelier-tresor-eternel": { hero: "atelier-treasury", motion: "treasury-unfold", effect: "gold", ornament: "gold", gate: "eternity", columns: ".85fr 1.15fr", groups: [["quote"],["date"],["letter"],["portrait","venue"],["gallery"],["schedule"],...end] },
};

export function templateDesign(id: string): TemplateDesign {
  return TEMPLATE_DESIGNS[id] ?? TEMPLATE_DESIGNS["eternal-vow"];
}

export function premiumArtwork(id: string): string {
  const scene = ATELIER_SCENES[id];
  return scene ? `/invitation-art/atelier-scenes/${GATE_ART_PLATES[scene]}.webp` : `/invitation-art/edition-2/${id}.webp`;
}

export function invitationGateArtwork(id: string): string | null {
  const scene = ATELIER_SCENES[id];
  return scene ? `/invitation-art/gates/atelier/${GATE_ART_PLATES[scene]}.webp` : null;
}
