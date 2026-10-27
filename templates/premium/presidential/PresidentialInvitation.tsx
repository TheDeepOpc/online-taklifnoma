"use client";

import { useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { CopyGiftButton, formatCardNumber } from "@/components/templates/CopyGiftButton";
import { InvitationCredit } from "@/components/templates/InvitationCredit";
import { PhotoGallery } from "@/components/templates/PhotoGallery";
import { WeddingCountdown } from "@/components/templates/WeddingCountdown";
import { useScrollLock } from "@/components/templates/useScrollLock";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import { uzFullDate, uzMonthName } from "@/lib/uzDate";
import type { Invitation } from "@/lib/types";
import type { PremiumProps } from "../shared/PremiumInvitation";
import styles from "./PresidentialInvitation.module.css";

function Names({ invitation, cover = false }: { invitation: Invitation; cover?: boolean }) {
  const Heading = cover ? "h2" : "h1";
  return <Heading className={styles.names} id={cover ? "presidential-cover-title" : undefined}>
    <span data-fit-name>{invitation.groom_name}</span><em>va</em><span data-fit-name>{invitation.bride_name}</span>
  </Heading>;
}

function InvitationStage({ inv, navy, cover = false, hasMusic, onOpen }: { inv: Invitation; navy: boolean; cover?: boolean; hasMusic: boolean; onOpen: () => void }) {
  const [year, month, day] = inv.wedding_date.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const monthName = uzMonthName(date);
  const initials = `${inv.groom_name.charAt(0)} · ${inv.bride_name.charAt(0)}`;
  const names = <Names invitation={inv} cover={cover} />;
  return <div className={styles.stage}>
    <div className={styles.topLine}><span>{initials}</span><span>{navy ? "SIZ UCHUN" : "HURMAT VA EHTIROM BILAN"}</span></div>
    {navy ? <div className={styles.identity}>
      <div className={styles.protocolIdentity}><div className={styles.dateColumn}><strong>{day}</strong><span>{monthName}</span><small>{year}</small></div><div><span className={styles.eyebrow}>NIKOH OQSHOMI</span>{names}</div></div>
      <p className={styles.invitationLine}>Sizni nikoh to‘yimizga taklif etamiz.</p>
    </div> : <div className={styles.identity}>
      <span className={styles.eyebrow}>NIKOH TO‘YIGA TAKLIFNOMA</span>{names}<div className={styles.dateLine}><span>{day}</span><i />{monthName}<i /><span>{year}</span></div><p className={styles.invitationLine}>Baxtli kunimizda biz bilan birga bo‘ling.</p>
    </div>}
    <div className={styles.stageBottom}>
      {inv.guest_name && <p className={styles.guest}>Hurmatli <strong data-fit-name>{inv.guest_name}</strong></p>}
      {cover ? <button type="button" className={styles.openButton} onClick={onOpen} data-invitation-open>Taklifnomani ochish<ArrowUpRight size={15} /></button> : <a href="#presidential-letter" className={styles.openButton}>Taklifnomani o‘qish<ArrowDown size={15} /></a>}
      <span className={styles.stageNote}>{cover && hasMusic ? "Musiqa bilan ochiladi" : `${uzFullDate(date)} · ${inv.wedding_time.slice(0, 5)}`}</span>
    </div>
  </div>;
}

export function PresidentialInvitation({ invitation: inv, musicTrack, theme, previewMode = false }: PremiumProps) {
  const [opened, setOpened] = useState(previewMode);
  const music = useRef<MusicPlayerHandle>(null);
  const reduced = useMotionPreference();
  useScrollLock(!opened && !previewMode);
  const navy = theme.id === "prizidentiskiy-navy";
  const [year, month, day] = inv.wedding_date.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const monthName = uzMonthName(date);
  const initials = `${inv.groom_name.charAt(0)} · ${inv.bride_name.charAt(0)}`;
  const palette = { ...Object.fromEntries([...Object.entries(theme.colors), ...Object.entries(theme.fonts)].map(([key, value]) => [`--${key}`, value])), "--invitation-scale": inv.text_size === "compact" ? ".85" : "1" } as CSSProperties;
  const message = (inv.custom_message?.trim() || "Hayotimizning yangi sahifasini siz bilan birga boshlashni istaymiz. Sizni nikoh to‘yimizning aziz mehmoni bo‘lishga taklif etamiz.").split("\n").filter(p => p.trim());
  const photos = [inv.cover_photo_url, ...inv.gallery_photo_urls].filter((url): url is string => Boolean(url));
  const wishes = inv.wishes_text?.trim().split("\n").filter(p => p.trim()) ?? [];

  function open() {
    music.current?.play();
    setOpened(true);
  }
  return <div className={`${styles.root} ${navy ? styles.navy : styles.ivory}`} style={palette} data-invitation-theme={theme.id} data-presidential-theme={navy ? "navy" : "ivory"} data-invitation-locked={!opened ? "true" : undefined}>
    <AnimatePresence initial={false}>{!opened && <motion.div className={styles.cover} role="dialog" aria-modal="true" aria-labelledby="presidential-cover-title" data-presidential-cover initial={false} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .45, ease: "easeOut" }}><InvitationStage inv={inv} navy={navy} hasMusic={!!musicTrack} onOpen={open} cover /></motion.div>}</AnimatePresence>
    <div inert={!opened ? true : undefined}>
      <header className={styles.hero}><InvitationStage inv={inv} navy={navy} hasMusic={!!musicTrack} onOpen={open} /></header>
      <main className={styles.content}>
        <section id="presidential-letter" className={styles.letter} data-presidential-section="letter"><span className={styles.sectionNumber}>{navy ? "01 / TAKLIF" : "SAMIMIY TAKLIF"}</span><h2 data-fit-name>{inv.guest_name ? `Hurmatli ${inv.guest_name}!` : "Qadrli mehmonimiz"}</h2>{message.map((paragraph, i) => <p key={i}>{paragraph}</p>)}<div className={styles.signature}><span data-fit-name>{inv.groom_name}</span><i /> <span data-fit-name>{inv.bride_name}</span></div></section>
        <div className={styles.information}>
          <section className={styles.dateSection} data-presidential-section="date"><span className={styles.sectionNumber}>{navy ? "02 / SANA VA VAQT" : "TO‘Y SANASI"}</span><div className={styles.calendarDate}><strong>{day}</strong><div><span>{monthName} {year}</span><small>Soat {inv.wedding_time.slice(0, 5)}</small></div></div><WeddingCountdown date={inv.wedding_date} time={inv.wedding_time} themeId={theme.id} previewMode={previewMode} /></section>
          <section className={styles.venue} data-presidential-section="venue"><span className={styles.sectionNumber}>{navy ? "03 / UCHRASHUV JOYI" : "MAROSIM MANZILI"}</span><h2>{inv.venue_name}</h2><p>{inv.venue_address}</p>{inv.venue_map_url && <a href={inv.venue_map_url} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Xaritada ko‘rish<ArrowUpRight size={14} /></a>}</section>
        </div>
        {inv.schedule_items.length > 0 && <section className={styles.schedule} data-presidential-section="schedule"><span className={styles.sectionNumber}>{navy ? "04 / KUN TARTIBI" : "OQSHOM DASTURI"}</span><h2>To‘y dasturi</h2><ol>{inv.schedule_items.map((item, i) => <li key={i}><time>{item.time}</time><p>{item.label}</p></li>)}</ol></section>}
        {photos.length > 0 && <section className={styles.photographs} data-presidential-section="photos"><span className={styles.sectionNumber}>BIZNING LAHZALAR</span><PhotoGallery photos={photos} alt={`${inv.groom_name} va ${inv.bride_name}`} className={styles.photoGrid} itemClassName={styles.photo} /></section>}
        {wishes.length > 0 && <section className={styles.wishes} data-presidential-section="wishes"><span className={styles.sectionNumber}>QALBIMIZDAN</span><h2>{inv.wishes_title || "Ezgu tilaklar"}</h2>{wishes.map((p, i) => <p key={i}>{p}</p>)}</section>}
        {inv.gift_card_number && <section className={styles.gift} data-presidential-section="gift"><span className={styles.sectionNumber}>EZGU NIYAT BILAN</span><p>Ishtirokingiz — biz uchun eng katta sovg‘a.</p><details><summary>To‘yona uchun rekvizitlar</summary><strong className={styles.cardNumber}>{formatCardNumber(inv.gift_card_number)}</strong>{!previewMode && <CopyGiftButton text={inv.gift_card_number} className={styles.textLink} label="Raqamni nusxalash" />}</details></section>}
      </main>
      <footer className={styles.footer}><span className={styles.footerInitials}>{initials}</span><p>Hurmat bilan kutamiz.</p><span className={styles.footerDate}>{uzFullDate(date)}</span><InvitationCredit edition={theme.name} /></footer>
    </div>
    {musicTrack && !previewMode && <MusicPlayer ref={music} src={musicTrack.file_url} hidden={!opened} buttonStyle={{ background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--line)", boxShadow: "none" }} />}
  </div>;
}
