"use client";

import { ArrowDown, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { ParallaxScene } from "@/components/templates/ParallaxScene";
import { uzMonthName } from "@/lib/uzDate";
import type { HeroProps } from "./HeroCompositions";
import { OrnamentalFrame } from "./OrnamentalFrame";
import styles from "./AtelierHero.module.css";

function Names({ p }: { p: HeroProps }) {
  return <h1 className={styles.names}><span data-fit-name>{p.invitation.groom_name}</span><em>&</em><span data-fit-name>{p.invitation.bride_name}</span></h1>;
}
function DateStamp({ p }: { p: HeroProps }) {
  const [y, m, d] = p.invitation.wedding_date.split("-");
  return <div className={styles.date}><strong>{d}</strong><span>{uzMonthName(new Date(Number(y), Number(m) - 1, Number(d)))}<small>{y} · {p.invitation.wedding_time.slice(0, 5)}</small></span></div>;
}
export function AtelierHero({ p }: { p: HeroProps }) {
  const kind = p.design.hero.replace("atelier-", "");
  const monogram = p.invitation.groom_name[0] + p.invitation.bride_name[0];
  return <header className={`${styles.hero} ${styles[kind]}`} data-hero-composition={p.design.hero} data-hero-animation={p.design.motion} data-open={p.opened || p.previewMode}>
    <ParallaxScene src={p.src} label={`${p.title} — onlayn to‘y taklifnomasi dizayni`} className={styles.background} enabled={!p.previewMode} priority />
    <div className={styles.shade} />
    <div className={styles.edition}><span>{p.title}</span><small>THE WEDDING EDITION · III</small></div>
    {kind === "opera" && <>
      <div className={`${styles.heading} ${styles.operaCopy}`}><span className={styles.eyebrow}>SIZ TAKLIF ETILGAN BUYUK PREMYERA</span><Names p={p} /><i className={styles.rule} /><p>{p.subtitle}</p></div>
      <div className={styles.metadata}><DateStamp p={p} /><span className={styles.sideNote}>Bir sahna.<br />Bir umrga va’da.</span></div>
    </>}
    {kind === "palace" && <>
      <div className={styles.crest}><span>{monogram}</span><small>QADRIYATLARDAN — ABADIYATGA</small></div>
      <div className={`${styles.heading} ${styles.palacePaper}`}><OrnamentalFrame kind="uzbek" design="atelier-palace" /><span className={styles.eyebrow}>NIKOH TO‘YIMIZGA MARHAMAT</span><Names p={p} /><i className={styles.rule} /><DateStamp p={p} /><p>{p.subtitle}</p></div>
    </>}
    {kind === "crystal" && <>
      <div className={`${styles.heading} ${styles.crystalTitle}`}><Sparkles size={25} strokeWidth={.7} /><span className={styles.eyebrow}>IKKI QALB UCHUN BIR OSMON</span><Names p={p} /><p>{p.subtitle}</p></div>
      <div className={`${styles.metadata} ${styles.crystalCalendar}`}><span className={styles.monogram}>{monogram}</span><DateStamp p={p} /></div>
    </>}
    {kind === "letter" && <>
      <div className={styles.postmark}>Avec amour<br /><small>Siz uchun, qalbimizdan</small></div>
      <div className={`${styles.heading} ${styles.letterPaper}`}><span className={styles.eyebrow}>ENG AZIZ MAKTUBIMIZ</span><Names p={p} /><p>{p.subtitle}</p><i className={styles.rule} /><DateStamp p={p} /></div>
    </>}
    {kind === "conservatory" && <>
      <div className={styles.gardenLabel}>JARDIN<br /><em>de Verre</em></div>
      <div className={`${styles.heading} ${styles.gardenCopy}`}><span className={styles.eyebrow}>MUHABBAT GULLAGAN KUN</span><Names p={p} /><p>{p.subtitle}</p></div>
      <div className={`${styles.metadata} ${styles.gardenMeta}`}><DateStamp p={p} /><span className={styles.monogram}>{monogram}</span></div>
    </>}
    {kind === "album" && <>
      <div className={styles.albumLabel}><span>OUR HEIRLOOM</span><small>HAYOTIMIZNING BIRINCHI BOBI</small></div>
      <div className={`${styles.heading} ${styles.albumPages}`}><div><span className={styles.eyebrow}>BIZNING HIKOYAMIZ</span><Names p={p} /><DateStamp p={p} /></div><aside><span className={styles.monogram}>{monogram}</span><p>Har bir go‘zal xotira<br /><em>sen bilan boshlanadi.</em></p></aside></div>
      <p className={styles.caption}>{p.subtitle}</p>
    </>}
    {kind === "treasury" && <>
      <div className={styles.treasuryLabel}><span>TRÉSOR</span><small>MUHABBAT — ENG AZIZ XAZINA</small></div>
      <div className={`${styles.heading} ${styles.treasuryCard}`}><Sparkles size={21} strokeWidth={.8} /><span className={styles.eyebrow}>BIR UMRGA SAQLANADIGAN VA’DA</span><Names p={p} /><DateStamp p={p} /><p>{p.subtitle}</p></div>
    </>}
    <nav className={styles.navigation} aria-label="Taklifnoma bo‘limlari"><a href="#atelier-date"><CalendarDays size={13} />To‘y sanasi</a><a href="#atelier-venue"><MapPin size={13} />Manzil</a></nav>
    <a href="#atelier-letter" className={styles.scroll}><span>Taklifnomani o‘qish</span><ArrowDown size={15} /></a>
  </header>;
}
