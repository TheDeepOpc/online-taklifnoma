"use client";

import { createContext, useContext, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Heart, MapPin, Sparkles } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { CopyGiftButton, formatCardNumber } from "@/components/templates/CopyGiftButton";
import { PhotoGallery } from "@/components/templates/PhotoGallery";
import { WishesSection } from "@/components/templates/WishesSection";
import { useScrollLock } from "@/components/templates/useScrollLock";
import { ParallaxScene } from "@/components/templates/ParallaxScene";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import type { InvitationLayout } from "@/lib/invitationArt";
import type { ThemeDefinition } from "@/lib/themes";
import type { Invitation, MusicTrack } from "@/lib/types";
import { uzFullDate, uzMonthName } from "@/lib/uzDate";
import { HeroComposition } from "../layouts/HeroCompositions";
import { BodyComposition } from "../layouts/BodyComposition";
import { SeasonalAtmosphere } from "../layouts/SeasonalAtmosphere";
import { LuxuryInvitationGate } from "../layouts/LuxuryInvitationGate";
import { OrnamentalFrame } from "../layouts/OrnamentalFrame";
import { templateDesign, premiumArtwork, type SectionId } from "@/lib/templateDesigns";
import { sectionReveal } from "../layouts/sectionReveal";
import styles from "./PremiumInvitation.module.css";

export interface PremiumProps {
  invitation: Invitation;
  musicTrack: MusicTrack | null;
  theme: ThemeDefinition;
  previewMode?: boolean;
}

type Variant = InvitationLayout;

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 36" fill="none" aria-hidden="true">
      <path d="M0 18h57c17 0 17-13 32-13-9 4-11 13 0 13M200 18h-57c-17 0-17-13-32-13 9 4 11 13 0 13M57 18c17 0 17 13 32 13-9-4-11-13 0-13m54 0c-17 0-17 13-32 13 9-4 11-13 0-13" stroke="currentColor" strokeWidth=".7" />
      <path d="m100 5 7 13-7 13-7-13 7-13Z" stroke="currentColor" strokeWidth=".7" />
      <circle cx="100" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}

const DesignContext = createContext("cascade");

function Reveal({ children, className = "", previewMode, sectionId }: { children: ReactNode; className?: string; previewMode: boolean; sectionId?: SectionId }) {
  const reduced = useMotionPreference();
  const design = useContext(DesignContext);
  const initial = sectionReveal(design);
  return <motion.section data-section={sectionId} className={className} initial={previewMode || reduced ? false : initial} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, rotateY: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: reduced ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.section>;
}

function WeddingCalendar({ date }: { date: string }) {
  const [year, month, day] = date.split("-").map(Number);
  const firstDay = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const days = new Date(year, month, 0).getDate();
  return <div className={styles.calendar} aria-label={uzFullDate(new Date(year, month - 1, day))}>
    <p className={styles.calendarTitle}>{uzMonthName(new Date(year, month - 1, 1))} <span>{year}</span></p>
    <div className={styles.calendarGrid}>
      {["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"].map(label => <span key={label} className={styles.weekday}>{label}</span>)}
      {Array.from({ length: firstDay }, (_, i) => <span key={`empty-${i}`} />)}
      {Array.from({ length: days }, (_, i) => <span key={i} className={i + 1 === day ? styles.weddingDay : undefined}>{i + 1 === day && <Heart aria-hidden="true" />}<span>{i + 1}</span></span>)}
    </div>
  </div>;
}

export function PremiumInvitation({ invitation, musicTrack, theme, previewMode = false, variant, edition, title, subtitle }: PremiumProps & { variant: Variant; edition: string; title: string; subtitle: string }) {
  const [opened, setOpened] = useState(previewMode);
  const musicRef = useRef<MusicPlayerHandle>(null);
  const reduced = useMotionPreference();
  useScrollLock(!opened && !previewMode);

  const imageSrc = premiumArtwork(theme.id);
  const design = templateDesign(theme.id);
  const parallax = !previewMode;
  const secondPortrait = theme.family === "swan-noir" ? invitation.second_photo_url : null;
  const portraitSrc = invitation.cover_photo_url || secondPortrait;
  const [year, month, day] = invitation.wedding_date.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const monogram = `${invitation.groom_name.charAt(0)}${invitation.bride_name.charAt(0)}`;
  const time = invitation.wedding_time.slice(0, 5);
  // To'y O'zbekistonda: chet eldagi mehmon ham ayni bir lahzaga sanoq ko'radi.
  const targetDate = `${invitation.wedding_date}T${invitation.wedding_time || "18:00"}+05:00`;
  const rootStyle = Object.fromEntries([...Object.entries(theme.colors), ...Object.entries(theme.fonts)].map(([key, value]) => [`--${key}`, value])) as CSSProperties;
  const paragraphs = (invitation.custom_message || "Hayotimizning eng go‘zal sahifasi ochilmoqda. Sizni nikoh to‘yimizga taklif etamiz.\nUshbu unutilmas kunning quvonchini biz bilan baham ko‘rishingizdan baxtiyormiz.").split("\n").filter(line => line.trim());

  function openInvitation() {
    // play() bevosita mehmon bosgan hodisada chaqiriladi — mobil autoplay uchun.
    musicRef.current?.play();
    setOpened(true);
  }

  return <DesignContext.Provider value={design.hero}><div className={`${styles.root} ${styles[variant]} ${parallax ? styles.hasParallax : ""} ${previewMode ? styles.preview : ""}`} style={rootStyle} data-invitation-locked={!opened && !previewMode ? "true" : undefined} data-design={design.hero} data-motion={design.motion} data-invitation-theme={theme.id} data-parallax-enabled={parallax ? "true" : "false"}>
    <SeasonalAtmosphere effect={design.effect} previewMode={previewMode || (!!design.gate && !opened)} />
    {design.gate && !opened && !previewMode && <LuxuryInvitationGate scene={design.gate} invitation={invitation} hasMusic={!!musicTrack} onActivate={() => musicRef.current?.play()} onOpened={() => setOpened(true)} />}
    <AnimatePresence>
      {!design.gate && !opened && !previewMode && <motion.div key="invitation-cover" className={styles.gate} role="dialog" aria-modal="true" aria-labelledby={`gate-${theme.id}`} initial={false} exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.08, filter: "blur(12px)" }} transition={{ duration: reduced ? 0.15 : 0.9 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} className={styles.gateImage} alt="" fetchPriority="high" />
        <div className={styles.gateShade} />
        <div className={styles.gateFrame} aria-hidden="true" />
        <OrnamentalFrame kind={design.ornament} design={design.hero} />
        <div className={styles.gateContent}>
          <span className={styles.gateEyebrow}>Siz uchun, qalbimizdan</span>
          <Ornament className={styles.gateOrnament} />
          {invitation.guest_name && <p className={styles.gateGuest}>Hurmatli <strong>{invitation.guest_name}</strong></p>}
          <h2 id={`gate-${theme.id}`} className={styles.gateNames}><span>{invitation.groom_name}</span><em>&</em><span>{invitation.bride_name}</span></h2>
          <p className={styles.gateDate}>{day} · {month} · {year}</p>
          <button type="button" onClick={openInvitation} className={styles.openButton} data-invitation-open>
            <span className={styles.seal} aria-hidden="true">{monogram}</span>
            <span>Taklifnomani ochish <ArrowUpRight size={14} /></span>
          </button>
          {musicTrack && <span className={styles.soundHint}>Musiqa bilan ochiladi</span>}
        </div>
        <span className={styles.gateEdition}>{title} · {edition}</span>
      </motion.div>}
    </AnimatePresence>

    <div inert={!opened && !previewMode ? true : undefined}>
      <HeroComposition invitation={invitation} design={design} src={imageSrc} title={title} subtitle={subtitle} previewMode={previewMode} opened={opened} />

      <BodyComposition design={design} className={styles.main}>
        <Reveal sectionId="letter" className={styles.letter} previewMode={previewMode}>
          <div id="premium-letter" className={styles.anchor} />
          <span className={styles.chapter}>01 — Qalbdan taklif</span>
          <Ornament className={styles.ornament} />
          <p className={styles.script}>Sizni kutamiz</p>
          <h2>{invitation.guest_name ? `Hurmatli ${invitation.guest_name}!` : "Qadrli mehmonimiz!"}</h2>
          {paragraphs.map((paragraph, index) => <p className={styles.bodyText} key={index}>{paragraph}</p>)}
          <span className={styles.signature}>{invitation.groom_name} <Heart size={12} /> {invitation.bride_name}</span>
        </Reveal>

        {portraitSrc && <Reveal sectionId="portrait" className={styles.portraitSection} previewMode={previewMode}>
          <span className={styles.photoCaption}>Bizning yangi bobimiz</span>
          <div className={`${styles.portraitFrame} ${invitation.cover_photo_url && secondPortrait ? styles.portraitPair : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portraitSrc} alt={`${invitation.groom_name} va ${invitation.bride_name}`} loading="lazy" />
            {invitation.cover_photo_url && secondPortrait && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={secondPortrait} alt={invitation.groom_name} loading="lazy" />
            )}
            <span className={styles.photoSeal} aria-hidden="true">{monogram}</span>
          </div>
          <p className={styles.photoNote}>Barcha yo‘llar bizni bir-birimizga olib keldi.</p>
        </Reveal>}

        {parallax && <section data-section="quote" className={styles.scenicQuote} aria-label="Muhabbat hikoyamiz">
          <ParallaxScene src={imageSrc} className={styles.scenicScene} enabled />
          <div className={styles.scenicShade} />
          <Reveal className={styles.scenicText} previewMode={previewMode}>
            <span>Ikki qalb — bitta taqdir</span>
            <p>Sen bilan<br /><em>abadiy.</em></p>
            <Ornament className={styles.ornament} />
          </Reveal>
        </section>}

        <Reveal sectionId="date" className={styles.dateSection} previewMode={previewMode}>
          <span className={styles.chapter}>02 — Unutilmas sana</span>
          <h2 className={styles.sectionHeading}>O‘sha go‘zal <em>kun</em></h2>
          <div className={styles.dateStamp}><span>{day}</span><div>{uzMonthName(date)}<small>{year}</small></div></div>
          <WeddingCalendar date={invitation.wedding_date} />
          <div className={styles.timePill}><span>Boshlanish vaqti</span><strong>{time}</strong></div>
          <p className={styles.smallLabel}>Uchrashuvimizgacha</p>
          <CountdownTimer targetDate={targetDate} live={!previewMode} pad classes={{ root: styles.countdown, cell: styles.countdownCell, value: styles.countdownValue, label: styles.countdownLabel }} />
        </Reveal>

        <Reveal sectionId="venue" className={styles.venueSection} previewMode={previewMode}>
          <div className={styles.venueVisual}>
            <ParallaxScene src={imageSrc} className={styles.venueScene} enabled={parallax} />
            <div className={styles.venueVisualShade} />
            <span className={styles.venueVisualCaption}>Birgalikda baxt sari</span>
          </div>
          <div className={styles.venueCard}>
            <MapPin className={styles.venuePin} strokeWidth={1} size={26} />
            <span className={styles.chapter}>03 — Qadrli uchrashuv</span>
            <h2>{invitation.venue_name}</h2>
            <p className={styles.bodyText}>{invitation.venue_address}</p>
            <div className={styles.venueDate}>{uzFullDate(date)} <span>·</span> {time}</div>
            {invitation.venue_map_url && !previewMode && <a className={styles.mapButton} href={invitation.venue_map_url} target="_blank" rel="noopener noreferrer">Manzilga yo‘l olish <ArrowUpRight size={16} /></a>}
          </div>
        </Reveal>

        {invitation.schedule_items.length > 0 && <Reveal sectionId="schedule" className={styles.scheduleSection} previewMode={previewMode}>
          <span className={styles.chapter}>Har lahzasi qadrli</span>
          <h2 className={styles.sectionHeading}>Kun <em>dasturi</em></h2>
          <div className={styles.timeline}>{invitation.schedule_items.map((item, index) => <div key={index} className={styles.timelineItem}><span className={styles.timelineTime}>{item.time}</span><i aria-hidden="true" /><div><small>{String(index + 1).padStart(2, "0")}</small><p>{item.label}</p></div></div>)}</div>
        </Reveal>}

        {invitation.gallery_photo_urls.length > 0 && <Reveal sectionId="gallery" className={styles.gallerySection} previewMode={previewMode}>
          <span className={styles.chapter}>Bir hikoyaning lavhalari</span>
          <h2 className={styles.sectionHeading}>Bizning <em>lahzalar</em></h2>
          <PhotoGallery photos={invitation.gallery_photo_urls} className={styles.gallery} itemClassName={styles.galleryItem} />
        </Reveal>}

        <div data-section="wishes"><WishesSection invitation={invitation} previewMode={previewMode} className={styles.wishes} /></div>

        {invitation.gift_card_number && <Reveal sectionId="gift" className={styles.giftSection} previewMode={previewMode}>
          <Sparkles strokeWidth={1} size={25} />
          <h2 className={styles.sectionHeading}>Ezgu <em>niyatlar</em></h2>
          <p className={styles.bodyText}>Borligingiz — eng katta sovg‘a. To‘yona yo‘llashni istagan yaqinlarimiz uchun:</p>
          <div className={styles.giftCard}><span>Mehr bilan</span><p>{formatCardNumber(invitation.gift_card_number)}</p>{!previewMode && <CopyGiftButton text={invitation.gift_card_number} className={styles.copyButton} />}{previewMode && <Check size={16} />}</div>
        </Reveal>}

        <footer data-section="footer" className={styles.footer}>
          <Ornament className={styles.ornament} />
          <span className={styles.footerMonogram}>{monogram}</span>
          <p className={styles.script}>Baxtimizga sherik bo‘ling</p>
          <p className={styles.footerNames}>{invitation.groom_name} & {invitation.bride_name}</p>
          <span className={styles.footerDate}>{day} . {month} . {year}</span>
          <span className={styles.footerBrand}>Oila-Uchun <i /> {title} collection</span>
        </footer>
      </BodyComposition>
    </div>

    {musicTrack && !previewMode && <MusicPlayer ref={musicRef} src={musicTrack.file_url} hidden={!opened} buttonStyle={{ background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--gold)", boxShadow: "0 4px 25px #0002" }} />}
  </div></DesignContext.Provider>;
}
