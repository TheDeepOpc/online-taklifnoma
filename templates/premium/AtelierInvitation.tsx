"use client";

import { useRef, useState, type CSSProperties } from "react";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { useScrollLock } from "@/components/templates/useScrollLock";
import { premiumArtwork, templateDesign } from "@/lib/templateDesigns";
import type { PremiumProps } from "./shared/PremiumInvitation";
import { LuxuryInvitationGate } from "./layouts/LuxuryInvitationGate";
import { SeasonalAtmosphere } from "./layouts/SeasonalAtmosphere";
import { AtelierHero } from "./layouts/AtelierHero";
import { AtelierDetails } from "./layouts/AtelierDetails";
import styles from "./layouts/AtelierDetails.module.css";

const editions: Record<string, { title: string; subtitle: string }> = {
  "atelier-opera-rubis": { title: "Opéra Rubis", subtitle: "Muhabbatimizning buyuk premyerasi" },
  "atelier-samarqand-palace": { title: "Samarqand", subtitle: "Qadriyatlar bilan bezalgan yangi hayot" },
  "atelier-cristal-celeste": { title: "Cristal Céleste", subtitle: "Osmon kabi cheksiz muhabbat" },
  "atelier-lettre-royale": { title: "Lettre Royale", subtitle: "Qalbimizdan yo‘llangan eng aziz maktub" },
  "atelier-jardin-de-verre": { title: "Jardin de Verre", subtitle: "Muhabbat gullagan go‘zal kun" },
  "atelier-album-heritage": { title: "Héritage", subtitle: "Birgalikda yozilayotgan abadiy hikoya" },
  "atelier-tresor-eternel": { title: "Trésor Éternel", subtitle: "Muhabbat — eng aziz xazinamiz" },
};

/** These seven editions have their own invitation layouts, beyond their covers. */
export function AtelierInvitation({ invitation, musicTrack, theme, previewMode = false }: PremiumProps) {
  const [opened, setOpened] = useState(previewMode);
  const [revealing, setRevealing] = useState(previewMode);
  const musicRef = useRef<MusicPlayerHandle>(null);
  useScrollLock(!opened && !previewMode);
  const edition = editions[theme.id];
  const design = templateDesign(theme.id);
  const src = premiumArtwork(theme.id);
  const kind = design.hero.replace("atelier-", "");
  const palette = Object.fromEntries([...Object.entries(theme.colors), ...Object.entries(theme.fonts)].map(([key, value]) => [`--${key}`, value])) as CSSProperties;

  return <div className={`${styles.root} ${styles[kind]}`} style={palette} data-invitation-theme={theme.id} data-design={design.hero} data-invitation-locked={!opened ? "true" : undefined} data-atelier-layout={kind}>
    <SeasonalAtmosphere effect={design.effect} previewMode={previewMode || !opened} />
    {!opened && design.gate && <LuxuryInvitationGate scene={design.gate} invitation={invitation} hasMusic={!!musicTrack} onActivate={() => { musicRef.current?.play(); setRevealing(true); }} onOpened={() => setOpened(true)} />}
    <div inert={!opened ? true : undefined}>
      <AtelierHero p={{ invitation, design, src, ...edition, previewMode, opened: revealing || opened }} />
      <AtelierDetails invitation={invitation} kind={kind} src={src} title={edition.title} previewMode={previewMode} />
    </div>
    {musicTrack && !previewMode && <MusicPlayer ref={musicRef} src={musicTrack.file_url} hidden={!opened} buttonStyle={{ background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--gold)" }} />}
  </div>;
}
