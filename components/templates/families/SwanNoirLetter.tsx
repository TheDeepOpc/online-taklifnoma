"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { RevealCard } from "../RevealCard";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import styles from "./SwanNoirLetter.module.css";

const ASSETS = "/imported-assets/swan-noir";

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const dayMinutes = 24 * 60;
  const total = (((h * 60 + m + minutes) % dayMinutes) + dayMinutes) % dayMinutes;
  const hh = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export function SwanNoirLetter({
  invitation,
  musicTrack,
  theme,
  previewMode = false,
}: {
  invitation: Invitation;
  musicTrack: MusicTrack | null;
  theme: ThemeDefinition;
  previewMode?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(previewMode);
  const [gone, setGone] = useState(previewMode);
  const musicRef = useRef<MusicPlayerHandle>(null);

  function handleOpen() {
    setOpen(true);
    musicRef.current?.play();
    setTimeout(() => setGone(true), 900);
  }

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(heroProgress, [0, 1], ["0%", "16%"]);
  const heroImageScale = useTransform(heroProgress, [0, 1], [1, 1.1]);

  const watchRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: watchProgress } = useScroll({
    target: watchRef,
    offset: ["start end", "end start"],
  });
  const watchRotate = useTransform(watchProgress, [0, 0.5, 1], [-16, 0, 16]);
  const watchY = useTransform(watchProgress, [0, 1], [16, -16]);

  const flowerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: flowerProgress } = useScroll({
    target: flowerRef,
    offset: ["start end", "end start"],
  });
  const flowerY = useTransform(flowerProgress, [0, 1], [24, -24]);
  const flowerRotate = useTransform(flowerProgress, [0, 1], [-8, 8]);

  const venueRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: venueProgress } = useScroll({
    target: venueRef,
    offset: ["start end", "end start"],
  });
  const venueScale = useTransform(venueProgress, [0, 0.5, 1], [1.16, 1, 1.16]);

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const [year, month, day] = invitation.wedding_date.split("-");
  const dateLabel = `${day}/${month}/${year}`;

  const ceremonyTime = invitation.wedding_time || "20:00";
  const timeline = [
    { time: addMinutes(ceremonyTime, -120), label: "Mehmonlarni kutib olish" },
    { time: ceremonyTime, label: "Nikoh marosimi" },
    { time: addMinutes(ceremonyTime, 30), label: "Bazm boshlanishi" },
    { time: addMinutes(ceremonyTime, 180), label: "Bayram oqshomi yakuni" },
  ];

  const messageLines = (
    invitation.custom_message ||
    "Sizni hayotimizdagi eng muhim va unutilmas kun — nikoh to'yimizga taklif qilamiz."
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const hasBothPhotos = Boolean(invitation.cover_photo_url && invitation.second_photo_url);

  async function handleCopyGift() {
    if (!invitation.gift_card_number) return;
    try {
      await navigator.clipboard.writeText(invitation.gift_card_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard mavjud bo'lmasligi mumkin, jim o'tkazamiz
    }
  }

  return (
    <div className={styles.root} style={rootStyle}>
      {!previewMode && (
        <div
          className={`${styles.entrance} ${open ? styles.entranceOpen : ""} ${
            gone ? styles.entranceGone : ""
          }`}
        >
          <div className={`${styles.curtain} ${styles.curtainLeft}`} />
          <div className={`${styles.curtain} ${styles.curtainRight}`} />
          <div className={styles.entranceContent}>
            <div className={styles.entranceDate}>{dateLabel}</div>
            <div className={`${styles.entranceNames} ${styles.script}`}>
              {invitation.groom_name}
              <span className={styles.amp}>&amp;</span>
              {invitation.bride_name}
            </div>
            <button type="button" className={styles.entranceBtn} onClick={handleOpen}>
              Ochish
            </button>
          </div>
        </div>
      )}

      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroDate}>{dateLabel}</div>
        <div className={`${styles.heroNames} ${styles.script}`}>
          {invitation.groom_name}
          <span className={styles.amp}>&amp;</span>
          {invitation.bride_name}
        </div>
        <div className={styles.heroImageClip}>
          <motion.img
            src={`${ASSETS}/swans.jpg`}
            alt=""
            className={styles.heroImage}
            style={{ y: heroImageY, scale: heroImageScale }}
          />
        </div>
      </section>

      <div className={styles.pearlDivider}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/pearl.png`} alt="" className={styles.pearl} />
      </div>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.archCard}>
          <div className={`${styles.greetingTitle} ${styles.script}`}>
            Aziz qadrdonlarimiz va yaqinlarimiz!
          </div>
          {messageLines.map((line, i) => (
            <p key={i} className={styles.greetingText}>
              {line}
            </p>
          ))}
        </div>
      </RevealCard>

      {hasBothPhotos && (
        <>
          <div className={styles.pearlDivider}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/pearl.png`} alt="" className={styles.pearl} />
          </div>
          <RevealCard className={styles.section} alwaysVisible={previewMode}>
            <div className={styles.archCard}>
              <div className={styles.heroDate}>{dateLabel}</div>
              <div className={styles.photoPair}>
                <figure className={`${styles.polaroid} ${styles.polaroidLeft}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.polaroidImg} src={invitation.cover_photo_url!} alt="" />
                </figure>
                <figure className={`${styles.polaroid} ${styles.polaroidRight}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.polaroidImg} src={invitation.second_photo_url!} alt="" />
                </figure>
              </div>
            </div>
          </RevealCard>
        </>
      )}

      <RevealCard
        className={`${styles.section} ${styles.venueSection}`}
        alwaysVisible={previewMode}
      >
        <div className={`${styles.sectionTitle} ${styles.script}`}>Manzil va lokatsiya</div>
        <div className={styles.venueAddr}>{invitation.venue_name}</div>
        <div className={styles.venueAddr}>{invitation.venue_address}</div>
        <div className={styles.venuePhotoWrap} ref={venueRef}>
          <motion.img
            src={`${ASSETS}/venue-table.jpg`}
            alt=""
            className={styles.venuePhoto}
            style={{ scale: venueScale }}
          />
          {invitation.venue_map_url && (
            <a
              href={invitation.venue_map_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapBtn}
            >
              <span className={styles.mapBtnHint}>Bosing</span>
              Xaritani ko&apos;rish
            </a>
          )}
        </div>
      </RevealCard>

      <div className={styles.pearlDivider}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/pearl.png`} alt="" className={styles.pearl} />
      </div>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.archCard} ref={watchRef}>
          <div className={styles.timeline}>
            {timeline.map((t, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineTime}>{t.time}</div>
                <div className={styles.timelineLabel}>{t.label}</div>
                {i < timeline.length - 1 && <div className={styles.timelineLine} />}
              </div>
            ))}
          </div>
          <motion.img
            src={`${ASSETS}/watch.png`}
            alt=""
            className={styles.watchImage}
            style={{ rotate: watchRotate, y: watchY, transformOrigin: "top center" }}
          />
        </div>
      </RevealCard>

      <div className={styles.pearlDivider}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/pearl.png`} alt="" className={styles.pearl} />
      </div>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.archCard} ref={flowerRef}>
          <div className={`${styles.sectionTitle} ${styles.script}`}>Tafsilotlar</div>
          <p className={styles.greetingText}>
            Biz uchun eng katta sovg&apos;a — sizning tashrifingiz!
          </p>
          {invitation.gift_card_number && (
            <>
              <div className={styles.giftRow}>
                <span className={styles.label}>{invitation.groom_name}</span>
                <span className={styles.giftNumber}>{invitation.gift_card_number}</span>
              </div>
              <button type="button" className={styles.copyBtn} onClick={handleCopyGift}>
                {copied ? "Nusxalandi ✓" : "Nusxalash"}
              </button>
            </>
          )}
          <motion.img
            src={`${ASSETS}/flower.png`}
            alt=""
            className={styles.flowerImage}
            style={{ y: flowerY, rotate: flowerRotate, transformOrigin: "bottom left" }}
          />
        </div>
      </RevealCard>

      <RevealCard className={`${styles.section} ${styles.closing}`} alwaysVisible={previewMode}>
        <div className={`${styles.closingTitle} ${styles.script}`}>Sizni kutamiz</div>
        <p className={styles.closingSign}>
          Hurmat bilan,
          <br />
          {invitation.groom_name} va {invitation.bride_name}
        </p>
        <CountdownTimer targetDate={weddingDateTime} variant="divided" />
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--gold)", color: "var(--black)" }}
        />
      )}
    </div>
  );
}
