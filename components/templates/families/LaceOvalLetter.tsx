"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { RevealCard } from "../RevealCard";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import styles from "./LaceOvalLetter.module.css";

const ASSETS = "/imported-assets/lace-oval";

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

export function LaceOvalLetter({
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
  const [open, setOpen] = useState(previewMode);
  const [gone, setGone] = useState(previewMode);
  const musicRef = useRef<MusicPlayerHandle>(null);

  function handleOpen() {
    setOpen(true);
    musicRef.current?.play();
    setTimeout(() => setGone(true), 900);
  }

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const frameY = useTransform(heroProgress, [0, 1], ["0%", "22%"]);
  const frameScale = useTransform(heroProgress, [0, 1], [1, 1.08]);

  const groomRef = useRef<HTMLImageElement>(null);
  const { scrollYProgress: groomProgress } = useScroll({
    target: groomRef,
    offset: ["start end", "end start"],
  });
  const groomY = useTransform(groomProgress, [0, 1], [30, -30]);
  const groomRotate = useTransform(groomProgress, [0, 1], [-4, 4]);

  const brideRef = useRef<HTMLImageElement>(null);
  const { scrollYProgress: brideProgress } = useScroll({
    target: brideRef,
    offset: ["start end", "end start"],
  });
  const brideY = useTransform(brideProgress, [0, 1], [-30, 30]);
  const brideRotate = useTransform(brideProgress, [0, 1], [4, -4]);

  const venueRef = useRef<HTMLImageElement>(null);
  const { scrollYProgress: venueProgress } = useScroll({
    target: venueRef,
    offset: ["start end", "end start"],
  });
  const venueRotate = useTransform(venueProgress, [0, 1], [-3, 3]);
  const venueScale = useTransform(venueProgress, [0, 0.5, 1], [0.92, 1, 0.92]);

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const [year, month, day] = invitation.wedding_date.split("-");
  const dateLabel = `${day}.${month}.${year}`;

  const ceremonyTime = invitation.wedding_time || "18:00";
  const timeline = [
    { time: addMinutes(ceremonyTime, -90), label: "Mehmonlarni kutib olish" },
    { time: ceremonyTime, label: "Nikoh marosimi" },
    { time: addMinutes(ceremonyTime, 60), label: "Bayramona bazm va tabriklar" },
    { time: addMinutes(ceremonyTime, 210), label: "Yoshlarning birinchi raqsi" },
    { time: addMinutes(ceremonyTime, 390), label: "Tantana yakuni" },
  ];

  const messageLines = (
    invitation.custom_message ||
    "Bu kun biz uchun shunchaki bayram emas. Bu — hayotga bo'lgan umumiy qarashimiz, yengil va go'zal muhabbatimiz timsolidir.\nBiz bu quvonchni yaqinlarimiz va do'stlarimiz davrasida baham ko'rishni orzu qildik."
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.root} style={rootStyle}>
      {!previewMode && (
        <div
          className={`${styles.entrance} ${open ? styles.entranceOpen : ""} ${
            gone ? styles.entranceGone : ""
          }`}
        >
          <div className={`${styles.doorPanel} ${styles.doorLeft}`} />
          <div className={`${styles.doorPanel} ${styles.doorRight}`} />
          <div className={styles.entranceContent}>
            <div className={`${styles.entranceNames} ${styles.script}`}>
              {invitation.groom_name}
              <span className={styles.entranceVa}>va</span>
              {invitation.bride_name}
            </div>
            <button type="button" className={styles.entranceBtn} onClick={handleOpen}>
              Ochish
            </button>
          </div>
        </div>
      )}

      <section className={styles.hero} ref={heroRef}>
        <motion.div
          className={styles.frameWrap}
          style={{ y: previewMode ? 0 : frameY, scale: previewMode ? 1 : frameScale }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/frame.png`} alt="" className={styles.frameImg} />
          <div className={styles.frameContent}>
            <div className={styles.heroDate}>{dateLabel}</div>
            <div className={`${styles.heroNames} ${styles.script}`}>
              {invitation.groom_name}
            </div>
            <div className={styles.heroVa}>va</div>
            <div className={`${styles.heroNames} ${styles.script}`}>
              {invitation.bride_name}
            </div>
          </div>
        </motion.div>

        {!previewMode && (
          <div className={styles.scrollHint}>
            <span className={styles.scrollLine} />
            DAVOMINI KO&apos;RISH UCHUN
            <br />
            PASTGA SURING
            <span className={styles.scrollLine} />
          </div>
        )}
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={`${styles.greetingTitle} ${styles.script}`}>
          Qadrli do&apos;stlar
          <br />
          va yaqinlar!
        </div>
        {messageLines.map((line, i) => (
          <p key={i} className={styles.greetingText}>
            {line}
          </p>
        ))}
        <div className={styles.illustrationRow}>
          <motion.img
            src={`${ASSETS}/groom-illustration.png`}
            alt=""
            className={styles.illustration}
            ref={groomRef}
            style={{ y: groomY, rotate: groomRotate }}
          />
          <motion.img
            src={`${ASSETS}/bride-illustration.png`}
            alt=""
            className={styles.illustration}
            ref={brideRef}
            style={{ y: brideY, rotate: brideRotate }}
          />
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={`${styles.sectionTitle} ${styles.script}`}>To&apos;y manzili</div>
        <div className={styles.venueName}>{invitation.venue_name}</div>
        <div className={styles.venueAddr}>{invitation.venue_address}</div>
        <p className={styles.greetingText}>
          Baxtli kunimizda sizni oramizda ko&apos;rishdan mamnun bo&apos;lamiz.
        </p>
        <motion.img
          src={`${ASSETS}/venue-illustration.png`}
          alt=""
          className={styles.venueIllustration}
          ref={venueRef}
          style={{ rotate: venueRotate, scale: venueScale }}
        />
        {invitation.venue_map_url && (
          <a
            href={invitation.venue_map_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapBtn}
          >
            Xaritada ochish
          </a>
        )}
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={`${styles.sectionTitle} ${styles.script}`}>Kun dasturi</div>
        <div className={styles.timeline}>
          {timeline.map((t, i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineTime}>{t.time}</div>
              <div className={styles.timelineLabel}>{t.label}</div>
              {i < timeline.length - 1 && <div className={styles.timelineLine} />}
            </div>
          ))}
        </div>
      </RevealCard>

      <RevealCard className={`${styles.section} ${styles.closing}`} alwaysVisible={previewMode}>
        <div className={`${styles.closingTitle} ${styles.script}`}>
          Sizni intiqlik bilan kutamiz!
        </div>
        <CountdownTimer targetDate={weddingDateTime} variant="divided" />
        <p className={styles.closingSign}>
          Hurmat bilan,
          <br />
          {invitation.groom_name} va {invitation.bride_name}
        </p>
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--gold)", color: "var(--dark)" }}
        />
      )}
    </div>
  );
}
