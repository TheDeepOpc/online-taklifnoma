"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart, MapPin, Sparkles } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import { CopyGiftButton, formatCardNumber } from "@/components/templates/CopyGiftButton";
import { ParallaxScene } from "@/components/templates/ParallaxScene";
import { PhotoGallery } from "@/components/templates/PhotoGallery";
import type { Invitation } from "@/lib/types";
import { uzFullDate, uzMonthName } from "@/lib/uzDate";
import { wishForSeed } from "@/lib/wishTemplates";
import { OrnamentalFrame } from "./OrnamentalFrame";
import styles from "./AtelierDetails.module.css";

interface Props { invitation: Invitation; kind: string; src: string; title: string; previewMode: boolean }
const EditionContext = createContext("opera");
const entrance: Record<string, { opacity: number; y?: number; x?: number; scale?: number; filter?: string }> = {
  opera: { opacity: 0, y: 35 }, palace: { opacity: 0, scale: .96 },
  crystal: { opacity: 0, y: 20, filter: "blur(4px)" }, letter: { opacity: 0, y: 18 },
  conservatory: { opacity: 0, x: -18, y: 12 }, album: { opacity: 0, y: 25, scale: .98 },
  treasury: { opacity: 0, scale: .94 },
};
function Panel({ children, className = "", id, previewMode, style }: { children: ReactNode; className?: string; id?: string; previewMode: boolean; style?: CSSProperties }) {
  const reduced = useMotionPreference();
  const kind = useContext(EditionContext);
  return <motion.section id={id} className={className} style={style} initial={previewMode ? false : entrance[kind]} whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" }} viewport={{ once: true, amount: .08 }} transition={{ duration: reduced ? 0 : .9, ease: [.2, .7, .2, 1] }}>{children}</motion.section>;
}
function Pair({ invitation }: { invitation: Invitation }) {
  return <div className={styles.pair}><span data-fit-name>{invitation.groom_name}</span><Heart size={12} strokeWidth={1} /><span data-fit-name>{invitation.bride_name}</span></div>;
}

export function AtelierDetails({ invitation: inv, kind, src, title, previewMode }: Props) {
  const [year, month, day] = inv.wedding_date.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const monthName = uzMonthName(date);
  const monogram = inv.groom_name[0] + inv.bride_name[0];
  const paragraphs = (inv.custom_message || "Hayotimizning eng go‘zal sahifasini siz bilan birga ochmoqchimiz.\nNikoh to‘yimizning aziz mehmoni bo‘ling.").split("\n").filter(p => p.trim());
  const letter = <div className={styles.letterText}><span className={styles.kicker}>{kind === "opera" ? "BIRINCHI PARDA · TAKLIF" : kind === "album" ? "01 / BIZNING BIRINCHI SAHIFAMIZ" : "SIZ UCHUN, QALBIMIZDAN"}</span><h2 data-fit-name>{inv.guest_name ? `Hurmatli ${inv.guest_name}!` : "Qadrli mehmonimiz"}</h2>{paragraphs.map((p, i) => <p key={i}>{p}</p>)}<Pair invitation={inv} /></div>;
  const calendar = <><div className={styles.dateDisplay}><strong>{day}</strong><div><span>{monthName}</span><small>{year}</small></div></div><p className={styles.dateCaption}>Nikoh to‘yimiz · {inv.wedding_time.slice(0, 5)}</p><CountdownTimer targetDate={`${inv.wedding_date}T${inv.wedding_time || "18:00"}+05:00`} live={!previewMode} pad classes={{ root: styles.countdown, cell: styles.countdownCell, value: styles.countdownValue, label: styles.countdownLabel }} /></>;
  const venue = <><span className={styles.kicker}>BAXTLI KUNIMIZNING MANZILI</span><MapPin size={25} strokeWidth={.8} /><h2>{inv.venue_name}</h2><p>{inv.venue_address}</p><span className={styles.venueTime}>{uzFullDate(date)} · {inv.wedding_time.slice(0, 5)}</span>{inv.venue_map_url && <a href={inv.venue_map_url} target="_blank" rel="noopener noreferrer" className={styles.action}>Manzilni xaritada ko‘rish<ArrowUpRight size={15} /></a>}</>;
  const schedule = inv.schedule_items.length > 0 && <div className={styles.schedule}><span className={styles.kicker}>{kind === "opera" ? "OQSHOM REPERTUARI" : "HAR LAHZASI QADRLI"}</span><h2>{kind === "album" ? "Kunimiz sahifalari" : "To‘y dasturi"}</h2><ol>{inv.schedule_items.map((item, i) => <li key={i}><span className={styles.scheduleIndex}>{String(i + 1).padStart(2, "0")}</span><time>{item.time}</time><p>{item.label}</p></li>)}</ol></div>;
  const portrait = <ParallaxScene src={inv.cover_photo_url || src} label={inv.cover_photo_url ? `${inv.groom_name} va ${inv.bride_name}` : ""} className={styles.portrait} enabled={!previewMode} />;
  const scenic = (text: string, detail: string) => <Panel previewMode={previewMode} className={styles.scenic}><ParallaxScene src={src} className={styles.scenicImage} enabled={!previewMode} /><div className={styles.scenicCopy}><span className={styles.kicker}>{detail}</span><p>{text}</p><span className={styles.scenicMonogram}>{monogram}</span></div></Panel>;
  let composition: ReactNode;
  switch (kind) {
    case "opera": composition = <>
      <Panel id="atelier-letter" previewMode={previewMode} className={styles.playbill}><div className={styles.programHead}><span>OPÉRA RUBIS</span><small>TAKRORLANMAS BIR OQSHOM</small></div>{letter}{inv.cover_photo_url && <figure className={styles.operaPortrait}>{portrait}<figcaption>Oqshomimiz qahramonlari</figcaption></figure>}<span className={styles.programEnd}>— I —</span></Panel>
      <Panel id="atelier-date" previewMode={previewMode} className={styles.ticket}><div className={styles.ticketStub}><span>ADMIT</span><strong>2</strong><span>QALB</span></div><div className={styles.ticketDate}><span className={styles.kicker}>PREMYERA KUNI</span>{calendar}</div></Panel>
      {scenic("Bir umrning eng go‘zal premyerasi.", "BIZNING SAHNAMIZ — HAYOT")}
      <Panel id="atelier-venue" previewMode={previewMode} className={styles.stageVenue}><div className={styles.stageArch}>{venue}</div>{schedule}</Panel>
    </>; break;
    case "palace": composition = <>
      <Panel id="atelier-letter" previewMode={previewMode} className={styles.palaceInvitation}><div className={styles.mihrab}><OrnamentalFrame kind="uzbek" design="atelier-palace" /><span className={styles.tileCrest}>{monogram}</span>{inv.cover_photo_url && <div className={styles.palacePortrait}>{portrait}</div>}{letter}</div></Panel>
      <Panel id="atelier-date" previewMode={previewMode} className={styles.mosaicDate}><span className={styles.kicker}>QUTLUG‘ KUNIMIZ</span><div className={styles.tileCalendar}>{calendar}</div></Panel>
      <div className={styles.palaceCourt}><Panel id="atelier-venue" previewMode={previewMode} className={styles.courtArch}>{venue}</Panel>{schedule && <Panel previewMode={previewMode} className={styles.courtProgram}>{schedule}</Panel>}</div>
      {scenic("Mehr bilan qurilgan yangi oila.", "AZALIY QADRIYATLAR · ABADIY MUHABBAT")}
    </>; break;
    case "crystal": composition = <>
      <Panel id="atelier-date" previewMode={previewMode} className={styles.orbitCalendar}><span className={styles.kicker}>YULDUZLAR BELGILAGAN KUN</span><div className={styles.orbitDial}><i aria-hidden="true" />{calendar}</div></Panel>
      <Panel id="atelier-letter" previewMode={previewMode} className={styles.constellationLetter}><Sparkles size={27} strokeWidth={.7} />{inv.cover_photo_url && <div className={styles.celestialPortrait}>{portrait}</div>}{letter}<div className={styles.constellationRule} aria-hidden="true">✦<i />✧<i />✦</div></Panel>
      {scenic("Bir osmon ostida. Bir umr birga.", "OSMONIMIZNING ENG YORUG‘ YULDUZI — SIZ")}
      <Panel id="atelier-venue" previewMode={previewMode} className={styles.skyDestination}><div className={styles.glassVenue}>{venue}</div>{schedule}</Panel>
    </>; break;
    case "letter": composition = <>
      <Panel id="atelier-letter" previewMode={previewMode} className={styles.correspondence}><span className={styles.letterNumber}>№ 01 · Shaxsiy maktub</span><div className={styles.paperFold}>{letter}<span className={styles.waxSeal}>{monogram}</span></div></Panel>
      <Panel id="atelier-date" previewMode={previewMode} className={styles.letterDate}><div className={styles.postage}><span>MUHABBAT BILAN</span><Heart size={23} strokeWidth={.7} /><small>{year}</small></div><span className={styles.kicker}>TAQVIMINGIZGA BELGILAB QO‘YING</span>{calendar}</Panel>
      <Panel id="atelier-venue" previewMode={previewMode} className={styles.postcard}><div className={styles.postcardPhoto}>{portrait}</div><div className={styles.addressSide}>{venue}</div></Panel>
      {schedule && <Panel previewMode={previewMode} className={styles.letterAgenda}>{schedule}</Panel>}
    </>; break;
    case "conservatory": composition = <>
      <Panel id="atelier-letter" previewMode={previewMode} className={styles.botanicalStory}><div className={styles.botanicalPhoto}>{portrait}<span>LOVE IN BLOOM</span></div><div className={styles.botanicalNote}>{letter}</div></Panel>
      <Panel id="atelier-date" previewMode={previewMode} className={styles.trellisCalendar}><span className={styles.kicker}>BOG‘IMIZDA UCHRASHAMIZ</span><div className={styles.gardenArch}>{calendar}</div></Panel>
      <Panel id="atelier-venue" previewMode={previewMode} className={styles.conservatoryVenue}><div className={styles.gardenSign}>{venue}</div>{schedule}</Panel>
      {scenic("Sen bilan hayot doim gullaydi.", "MUHABBATIMIZ ORANJEREYASI")}
    </>; break;
    case "album": composition = <>
      <Panel id="atelier-letter" previewMode={previewMode} className={styles.journalSpread}><div className={styles.journalPage}><span className={styles.pageNumber}>01</span>{letter}</div><figure className={styles.keepsake}>{portrait}<figcaption>Hikoyamizning boshlanishi · {year}</figcaption></figure></Panel>
      <Panel id="atelier-date" previewMode={previewMode} className={styles.journalDate}><span className={styles.journalYear}>{year}</span><div><span className={styles.kicker}>ESDA QOLADIGAN BIR SAHIFA</span>{calendar}</div></Panel>
      <Panel id="atelier-venue" previewMode={previewMode} className={styles.journalDestination}><span className={styles.pageNumber}>02 / UCHRASHUV JOYI</span><div className={styles.journalAddress}>{venue}</div>{schedule}</Panel>
    </>; break;
    default: composition = <>
      <Panel id="atelier-letter" previewMode={previewMode} className={styles.certificate}><div className={styles.certificateInner}><OrnamentalFrame kind="gold" design="atelier-treasury" /><span className={styles.certificateCrest}>{monogram}</span>{inv.cover_photo_url && <div className={styles.cameoPortrait}>{portrait}</div>}<span className={styles.kicker}>CERTIFICAT D’AMOUR</span>{letter}<span className={styles.certificateSerial}>VA’DAMIZ — ABADIY</span></div></Panel>
      <Panel id="atelier-date" previewMode={previewMode} className={styles.jewelDate}><Sparkles size={23} strokeWidth={.7} /><span className={styles.kicker}>ENG AZIZ KUNIMIZ</span>{calendar}</Panel>
      {scenic("Eng katta boyligimiz — bir-birimiz.", "BIR UMRGA SAQLANADIGAN XAZINA")}
      <Panel id="atelier-venue" previewMode={previewMode} className={styles.treasuryDestination}><div className={styles.goldPlaque}>{venue}</div>{schedule}</Panel>
    </>;
  }
  const wish = wishForSeed(inv.id || inv.slug);
  const wishes = (inv.wishes_text?.trim() || wish.text).split("\n").filter(p => p.trim());
  return <EditionContext.Provider value={kind}><main className={styles.details} data-atelier-details={kind}>
    {composition}
    {(inv.gallery_photo_urls.length > 0 || inv.second_photo_url) && <Panel previewMode={previewMode} className={styles.memorySection}><span className={styles.kicker}>{kind === "album" ? "ALBOMIMIZDAN" : "BIRGALIKDAGI GO‘ZAL LAHZALAR"}</span><h2>{kind === "opera" ? "Sahna ortidagi baxt" : "Bizning xotiralar"}</h2><PhotoGallery photos={[...(inv.second_photo_url ? [inv.second_photo_url] : []), ...inv.gallery_photo_urls]} className={styles.memoryGrid} itemClassName={styles.memoryPhoto} /></Panel>}
    <Panel previewMode={previewMode} className={styles.blessing}><span className={styles.kicker}>QALBIMIZDAGI EZGU NIYATLAR</span><h2>{inv.wishes_title?.trim() || (inv.wishes_text?.trim() ? "Tilaklarimiz" : wish.title)}</h2>{wishes.map((p, i) => <p key={i}>{p}</p>)}</Panel>
    {inv.gift_card_number && <Panel previewMode={previewMode} className={styles.gift}><Heart size={20} strokeWidth={1} /><h2>Mehr bilan</h2><p>Ishtirokingiz — eng katta sovg‘amiz. To‘yona yo‘llashni istagan yaqinlarimiz uchun:</p><div className={styles.giftCard}><span>EZGU NIYATLAR UCHUN</span><strong>{formatCardNumber(inv.gift_card_number)}</strong>{!previewMode && <CopyGiftButton text={inv.gift_card_number} className={styles.action} label="Karta raqamini nusxalash" />}</div></Panel>}
    <footer className={styles.footer}><span className={styles.footerCrest}>{monogram}</span><p>Baxtimizga sherik bo‘ling</p><Pair invitation={inv} /><span className={styles.footerDate}>{uzFullDate(date)}</span><a href="#atelier-date" className={styles.footerLink}>To‘y sanasi <ArrowUpRight size={12} /></a><small>OILA-UCHUN · {title}</small></footer>
  </main></EditionContext.Provider>;
}
