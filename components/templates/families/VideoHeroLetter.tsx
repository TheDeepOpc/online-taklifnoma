"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useAnimationControls,
  type MotionValue,
} from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { CalendarHighlight } from "../CalendarHighlight";
import { RevealCard } from "../RevealCard";
import { MapPinIcon } from "../icons";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import { uzMonthYear } from "@/lib/uzDate";
import styles from "./VideoHeroLetter.module.css";

const ASSETS = "/imported-assets/taklifnomaaa";

function Preloader({ onDone }: { onDone: () => void }) {
  const [gone, setGone] = useState(false);

  function handleOpen() {
    onDone();
    setGone(true);
  }

  return (
    <div className={`${styles.preloader} ${gone ? styles.preloaderGone : ""}`}>
      <svg
        viewBox="0 0 240 160"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.preloaderSvg}
      >
        <defs>
          <clipPath id="left-ring-mask">
            <rect x="0" y="0" width="120" height="160" />
          </clipPath>
          <clipPath id="right-ring-mask">
            <rect x="120" y="0" width="120" height="160" />
          </clipPath>
        </defs>

        <g clipPath="url(#left-ring-mask)">
          <motion.ellipse
            cx="100" cy="95" rx="50" ry="30"
            transform="rotate(-15 100 95)"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="100" cy="95" rx="40" ry="22"
            transform="rotate(-15 100 95)"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.2 }}
          />
        </g>

        <g clipPath="url(#right-ring-mask)">
          <motion.ellipse
            cx="140" cy="95" rx="50" ry="30"
            transform="rotate(15 140 95)"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.4 }}
          />
          <motion.ellipse
            cx="140" cy="95" rx="40" ry="22"
            transform="rotate(15 140 95)"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.6 }}
          />
        </g>

        <motion.path
          d="M 133 25 L 163 25 L 173 35 L 123 35 Z"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.8 }}
        />
        <motion.path
          d="M 123 35 L 148 65 L 173 35"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.8 }}
        />
        <motion.path
          d="M 133 25 L 148 35 L 163 25"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.0 }}
        />
        <motion.path
          d="M 148 35 L 148 65"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.0 }}
        />
        <motion.path
          d="M 133 35 L 148 65 M 163 35 L 148 65"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.0 }}
        />
      </svg>
      <button type="button" className={styles.preloaderBtn} onClick={handleOpen}>
        Ochish
      </button>
    </div>
  );
}

function CalligraphyNames({
  name1,
  name2,
  parallaxX,
}: {
  name1: string;
  name2: string;
  parallaxX: MotionValue<string>;
}) {
  const name1Ref = useRef<SVGTextElement>(null);
  const name2Ref = useRef<SVGTextElement>(null);
  const ampRef = useRef<SVGTextElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function animateStroke(el: SVGTextElement, duration: number, delay: number) {
      const len = el.getComputedTextLength() * 1.5;
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      const t = setTimeout(() => {
        el.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.45, 0, 0.55, 1)`;
        el.style.strokeDashoffset = "0";
      }, delay);
      timeouts.push(t);
    }

    if (name1Ref.current) animateStroke(name1Ref.current, 2.5, 200);
    if (ampRef.current) animateStroke(ampRef.current, 1.8, 1200);
    if (name2Ref.current) animateStroke(name2Ref.current, 2.5, 1800);

    const fillTimeout = setTimeout(() => setFilled(true), 3500);
    timeouts.push(fillTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div className={styles.calligraphyOverlay} style={{ x: parallaxX }}>
      <svg viewBox="0 0 800 500" className={styles.calligraphyStage}>
        <text
          ref={name1Ref}
          x="50%"
          y="120"
          fontSize="240"
          textAnchor="middle"
          className={`${styles.calligraphyPath} ${filled ? styles.calligraphyPathFilled : ""}`}
        >
          {name1}
        </text>
        <text
          ref={ampRef}
          x="50%"
          y="260"
          fontSize="120"
          textAnchor="middle"
          className={`${styles.calligraphyPath} ${styles.calligraphyAmpersand} ${filled ? styles.calligraphyPathFilled : ""}`}
        >
          &amp;
        </text>
        <text
          ref={name2Ref}
          x="50%"
          y="400"
          fontSize="240"
          textAnchor="middle"
          className={`${styles.calligraphyPath} ${filled ? styles.calligraphyPathFilled : ""}`}
        >
          {name2}
        </text>
      </svg>
    </motion.div>
  );
}

function ScrollIndicator() {
  return (
    <div className={styles.scrollIndicator}>
      <motion.div
        className={styles.scrollLine}
        animate={{ height: [40, 55, 40], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className={styles.scrollChevrons}>
        {[0, 1, 2].map((i) => (
          <motion.svg
            key={i}
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ opacity: [0.1, 0.9, 0.1], y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        ))}
      </div>
    </div>
  );
}

function CarAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const stateRef = useRef<"idle" | "entering" | "exiting">("idle");
  const posRef = useRef(0);
  const prevScrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onScroll() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      const scrollDelta = window.scrollY - prevScrollRef.current;
      prevScrollRef.current = window.scrollY;

      if (!inView) {
        if (stateRef.current !== "idle") {
          stateRef.current = "idle";
        }
        return;
      }

      const containerWidth = container.offsetWidth;
      const carWidth = Math.min(280, containerWidth * 0.7);
      const target = containerWidth / 2 - carWidth / 2;

      if (stateRef.current === "idle") {
        stateRef.current = "entering";
        posRef.current = -(carWidth + 100);
        controls.start({
          x: target,
          transition: {
            duration: Math.abs(target - posRef.current) / 150,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        });
        posRef.current = target;
      } else {
        posRef.current += Math.abs(scrollDelta) > 0.5 ? scrollDelta * 0.1 : scrollDelta;
        controls.set({ x: posRef.current });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [controls]);

  return (
    <div ref={containerRef} className={styles.carWrap}>
      <motion.div className={styles.carImage} initial={{ x: -500 }} animate={controls}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/car.webp`} alt="" className={styles.carImg} />
      </motion.div>
    </div>
  );
}

export function VideoHeroLetter({
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
  const musicRef = useRef<MusicPlayerHandle>(null);
  const [preloaderDone, setPreloaderDone] = useState(previewMode);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const heroX = useTransform(scrollYProgress, [0, 1], ["-20vw", "20vw"]);

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const weddingDate = new Date(weddingDateTime);
  const monthLabel = uzMonthYear(weddingDate);

  const messageLines = (
    invitation.custom_message ||
    "Oila deb atalmish muqaddas dargoh ostonasidamiz.\nSizni nikoh to'yimiz tantanasiga lutfan taklif etamiz.\nQuvonchli kunimizning aziz mehmoni bo'lishingizni kutib qolamiz!"
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  function handleEnter() {
    setPreloaderDone(true);
    musicRef.current?.play();
  }

  return (
    <div className={styles.root} style={rootStyle}>
      {!previewMode && !preloaderDone && (
        <Preloader onDone={handleEnter} />
      )}

      <section ref={heroRef} className={`${styles.hero} ${previewMode ? styles.heroPreview : ""}`}>
        <video
          className={styles.heroVideo}
          src={`${ASSETS}/1.webm`}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={styles.heroOverlay} />

        {!previewMode && preloaderDone && (
          <CalligraphyNames
            name1={invitation.groom_name}
            name2={invitation.bride_name}
            parallaxX={heroX}
          />
        )}

        <div className={styles.heroEyebrow}>To&apos;y taklifnomasi</div>

        {previewMode && (
          <motion.div className={styles.heroContent} style={{ x: 0 }}>
            <div className={styles.heroNames}>
              {invitation.groom_name}
              <span className={styles.heroAmp}>&amp;</span>
              {invitation.bride_name}
            </div>
          </motion.div>
        )}

        <div className={`${styles.heroPillar} ${styles.heroPillarLeft}`} />
        <div className={`${styles.heroPillar} ${styles.heroPillarRight}`} />

        {!previewMode && <ScrollIndicator />}
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.greetingTitle}>
          Qadrli va
          <span className={styles.greetingBig}>hurmatli insonimiz!</span>
        </div>
        <div className={styles.divider} />
        {messageLines.map((line, i) => (
          <motion.p
            key={i}
            className={styles.greetingText}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          >
            {line}
          </motion.p>
        ))}
        <div className={styles.greetingSign}>
          Hurmat bilan
          <b>
            {invitation.groom_name} &amp; {invitation.bride_name}
          </b>
        </div>
        {invitation.cover_photo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.signPhoto} src={invitation.cover_photo_url} alt="" />
        )}
      </RevealCard>

      <RevealCard className={styles.calendarSection} alwaysVisible={previewMode}>
        <div className={styles.calendarHead}>{monthLabel}</div>
        <CalendarHighlight
          date={invitation.wedding_date}
          cellClassName={styles.calendarCell}
          emptyClassName={styles.calendarEmpty}
          highlightClassName={styles.calendarHighlight}
          headClassName={styles.calendarLabel}
        />
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.sectionTitle}>To&apos;y manzili</div>
        <div className={styles.divider} />
        <div className={styles.venueName}>{invitation.venue_name}</div>
        <div className={styles.venueAddr}>{invitation.venue_address}</div>
        <div className={styles.venueTime}>{invitation.wedding_time}</div>
        {invitation.venue_map_url && (
          <div className={styles.mapButtons}>
            <a
              href={invitation.venue_map_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapBtn}
            >
              <MapPinIcon className="h-4 w-4" /> Xaritada ko&apos;rish
            </a>
          </div>
        )}
      </RevealCard>

      <CarAnimation />

      <div className={styles.buildingWrap}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ASSETS}/wedding-building.webp`}
            alt=""
            className={styles.buildingImage}
          />
        </motion.div>
      </div>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.countdownTitle}>Visol onlariga</div>
        <div className={styles.countdownFrame}>
          <span className={`${styles.countdownDiamond} ${styles.countdownDiamondTl}`}>◆</span>
          <span className={`${styles.countdownDiamond} ${styles.countdownDiamondTr}`}>◆</span>
          <span className={`${styles.countdownDiamond} ${styles.countdownDiamondBl}`}>◆</span>
          <span className={`${styles.countdownDiamond} ${styles.countdownDiamondBr}`}>◆</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/rings.webp`} alt="" className={styles.ringsImage} />
          <CountdownTimer targetDate={weddingDateTime} variant="ornate" />
        </div>
        <p className={styles.closingNote}>
          Quvonchli kunimizning aziz mehmoni bo&apos;lishingizni kutib qolamiz!
        </p>
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "#2d4034", color: "#f5efe7" }}
        />
      )}
    </div>
  );
}
