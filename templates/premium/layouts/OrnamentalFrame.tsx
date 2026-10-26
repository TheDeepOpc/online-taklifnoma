import type { Ornament } from "@/lib/templateDesigns";
import styles from "./OrnamentalFrame.module.css";

const sources: Record<Ornament, string> = {
  gold: "/invitation-art/effects/gold-filigree.webp",
  silver: "/invitation-art/effects/gold-filigree.webp",
  uzbek: "/invitation-art/effects/uzbek-naqsh.webp",
  floral: "/imported-assets/sacred-peony/bouquet-left.webp",
  botanical: "/imported-assets/garden-bouquet/corner-bouquet.webp",
  pearl: "/imported-assets/swan-noir/pearl.png",
};

export function OrnamentalFrame({ kind, design }: { kind: Ornament; design: string }) {
  return <div aria-hidden="true" className={`${styles.frame} ${styles[kind]} ${styles[design] ?? ""}`} data-ornament={kind}>
    {[0, 1, 2, 3].map(i => (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img key={i} src={sources[kind]} alt="" className={styles[`corner${i}`]} loading="eager" />
    ))}
  </div>;
}
