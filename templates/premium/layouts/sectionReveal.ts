/** Section motion complements each composition's own photographic entrance. */
export function sectionReveal(design: string) {
  const variants: Record<string, { opacity: number; x?: number; y?: number; rotate?: number; rotateX?: number; rotateY?: number; scale?: number; filter?: string }> = {
    cascade: { opacity: 0, y: 55 },
    herbarium: { opacity: 0, y: 25, rotate: -3 },
    diptych: { opacity: 0, x: -45 },
    triptych: { opacity: 0, y: -40, scale: .96 },
    postcard: { opacity: 0, x: -35, rotate: -5 },
    couture: { opacity: 0, scale: .9, rotateY: -10 },
    heritage: { opacity: 0, scale: .94, y: 35 },
    ledger: { opacity: 0, x: 40, rotate: 2 },
    "floral-jewel": { opacity: 0, scale: .82 },
    "silk-letter": { opacity: 0, rotateX: 12, y: 35 },
    orbit: { opacity: 0, y: 25, filter: "blur(7px)" },
    horizon: { opacity: 0, x: -65 },
    rosette: { opacity: 0, scale: .88, rotate: -4 },
    "light-curtain": { opacity: 0, y: -55 },
    staircase: { opacity: 0, y: 65, rotateY: 8 },
    "fashion-cover": { opacity: 0, x: 50, scale: .98 },
    heraldry: { opacity: 0, rotateX: 15, scale: .96 },
    theatre: { opacity: 0, scale: .9, filter: "blur(3px)" },
    "rose-album": { opacity: 0, rotateY: -12, y: 30 },
    scrapbook: { opacity: 0, y: -25, rotate: -7 },
    "riviera-magazine": { opacity: 0, x: 35, rotate: 1 },
    "gold-exhibition": { opacity: 0, scale: .92, y: 20 },
    "sky-panorama": { opacity: 0, y: 40, filter: "blur(4px)" },
  };
  return variants[design] ?? variants.cascade;
}
