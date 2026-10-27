"use client";
import { ArrowDown, Heart } from "lucide-react";
import { ParallaxScene } from "@/components/templates/ParallaxScene";
import { uzMonthName } from "@/lib/uzDate";
import type { HeroProps } from "./HeroCompositions";
import { OrnamentalFrame } from "./OrnamentalFrame";
import styles from "./AtelierHero.module.css";

function Names({ p }: { p: HeroProps }) { return <h1 className={styles.names}><span>{p.invitation.groom_name}</span><em>&</em><span>{p.invitation.bride_name}</span></h1>; }
function Date({ p }: { p: HeroProps }) { const [y,m,d]=p.invitation.wedding_date.split('-');return <div className={styles.date}><strong>{d}</strong><span>{uzMonthName(new globalThis.Date(Number(y),Number(m)-1,Number(d)))}<small>{y}</small></span></div>; }
export function AtelierHero({ p }: { p: HeroProps }) {
  const kind=p.design.hero.replace('atelier-','');
  const monogram=p.invitation.groom_name[0]+p.invitation.bride_name[0];
  const photo=p.invitation.cover_photo_url;
  const background=<ParallaxScene src={p.src} className={styles.background} enabled={!p.previewMode} priority />;
  return <header className={`${styles.hero} ${styles[kind] ?? ""}`} data-hero-composition={p.design.hero} data-hero-animation={p.design.motion}>
    {background}
    {kind==='opera'&&<><div className={styles.operaShade}/><div className={styles.operaCopy}><span className={styles.eyebrow}>MUHABBATIMIZNING BUYUK PREMYERASI</span><Names p={p}/><i/><p>{p.subtitle}</p></div><div className={styles.operaDate}><Date p={p}/><span>Bir sahna.<br/>Bir umrga va’da.</span></div></>}
    {kind==='palace'&&<><div className={styles.palaceSeal}>{monogram}</div><div className={styles.palacePaper}><OrnamentalFrame kind="uzbek" design="atelier-palace"/><span className={styles.eyebrow}>QADRIYATLARDAN — ABADIYATGA</span><Names p={p}/><div className={styles.palaceMeta}><Date p={p}/><p>{p.subtitle}</p></div></div></>}
    {kind==='crystal'&&<><div className={styles.crystalTitle}><span className={styles.eyebrow}>IKKI QALB UCHUN BIR OSMON</span><Names p={p}/></div><div className={styles.crystalCalendar}><span>{monogram}</span><i/><Date p={p}/></div><p className={styles.crystalNote}>{p.subtitle}</p></>}
    {kind==='letter'&&<><span className={styles.letterPostmark}>Avec amour<br/>Siz uchun, qalbimizdan</span><div className={styles.letterPaper}><span className={styles.eyebrow}>ENG GO‘ZAL KUNIMIZGA TAKLIF</span><Names p={p}/><Heart size={15} strokeWidth={1}/><Date p={p}/><p>{p.subtitle}</p></div></>}
    {kind==='conservatory'&&<><div className={styles.gardenTop}><span>JARDIN<br/>DE VERRE</span><Date p={p}/></div><div className={styles.gardenCopy}><span className={styles.eyebrow}>MUHABBAT GULLAGAN KUN</span><Names p={p}/><p>{p.subtitle}</p></div>{photo&&<div className={styles.gardenPortrait}><ParallaxScene src={photo} enabled={!p.previewMode} className={styles.personal}/></div>}<span className={styles.gardenMonogram}>{monogram}</span></>}
    {kind==='album'&&<><div className={styles.albumHeading}><span>OUR HEIRLOOM</span><small>HAYOTIMIZNING BIRINCHI BOBI</small></div><div className={styles.albumPages}><div><span className={styles.eyebrow}>BIZNING HIKOYAMIZ</span><Names p={p}/><Date p={p}/></div><div>{photo?<ParallaxScene src={photo} className={styles.albumPortrait} enabled={!p.previewMode}/>:<><span className={styles.albumMonogram}>{monogram}</span><p>Har bir go‘zal xotira<br/><em>sen bilan boshlanadi.</em></p></>}</div></div><p className={styles.albumCaption}>{p.subtitle}</p></>}
    {kind==='treasury'&&<><div className={styles.treasuryTitle}><span>TRÉSOR</span><small>MUHABBAT — ENG AZIZ XAZINA</small></div><div className={styles.treasuryCard}><span className={styles.eyebrow}>BIR UMRGA SAQLANADIGAN VA’DA</span><Names p={p}/><Date p={p}/><p>{p.subtitle}</p></div><span className={styles.treasurySignature}>{monogram}</span></>}
    <a href="#premium-letter" className={styles.scroll}><span>Hikoyamiz davom etadi</span><ArrowDown size={14}/></a>
  </header>;
}
