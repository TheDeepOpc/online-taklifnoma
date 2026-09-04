"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { RevealCard } from "../RevealCard";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import { uzFullDate, uzWeekdayName } from "@/lib/uzDate";
import styles from "./PanelParallaxLetter.module.css";

function Monogram({ variant, className }: { variant: "rings" | "fan"; className?: string }) {
  if (variant === "fan") {
    return (
      <svg
        className={className}
        viewBox="0 0 120 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden
      >
        <path d="M60 68 L10 20 M60 68 L30 8 M60 68 L60 2 M60 68 L90 8 M60 68 L110 20" />
        <path d="M10 20 Q60 -10 110 20" strokeWidth="1.3" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <circle cx="32" cy="32" r="30" />
      <path d="M18 42V22l14 14 14-14v20" strokeWidth="1.2" />
    </svg>
  );
}

function useSunburstRays(count = 40) {
  return useMemo(() => {
    const cx = 200;
    const cy = 200;
    const rInner = 60;
    const rOuter = 195;
    // Koordinatalar 2 xonagacha yaxlitlanadi: server va brauzer float sonlarni
    // boshqacha aniqlik bilan satrga o'giradi (masalan "111.4718525507884" vs
    // "111.47185255078838"), bu esa React hydration mismatch ogohlantirishiga
    // olib kelardi — yaxlitlash ikkala tomonda ham bir xil satrni kafolatlaydi.
    const round = (n: number) => Math.round(n * 100) / 100;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x1: round(cx + rInner * Math.cos(angle)),
        y1: round(cy + rInner * Math.sin(angle)),
        x2: round(cx + rOuter * Math.cos(angle)),
        y2: round(cy + rOuter * Math.sin(angle)),
      };
    });
  }, [count]);
}

export function PanelParallaxLetter({
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
  const [entranceOpen, setEntranceOpen] = useState(previewMode);
  const [entranceGone, setEntranceGone] = useState(previewMode);
  const rays = useSunburstRays();

  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sunburstRef = useRef<HTMLDivElement>(null);

  const panel = theme.panel ?? "card";
  const backdrop = theme.backdrop ?? "glow";
  const monogram = theme.monogram ?? "rings";
  const panelClass = panel === "bordered" ? styles.panelBordered : styles.panelCard;

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  useEffect(() => {
    if (previewMode) return;
    const speeds = [0.15, 0.28, 0.18, 0.24];
    let ticking = false;

    function applyParallax() {
      const y = window.scrollY;
      glowRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translateY(${y * speeds[i % speeds.length]}px)`;
      });
      if (sunburstRef.current) {
        sunburstRef.current.style.transform = `translate(-50%, ${y * 0.08}px)`;
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }

    applyParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [previewMode]);

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const weddingDate = new Date(weddingDateTime);
  const shortDate = invitation.wedding_date.split("-").reverse().join(" · ");
  const fullDate = uzFullDate(weddingDate);
  const weekday = uzWeekdayName(weddingDate);

  const messageLines = (
    invitation.custom_message ||
    "Hayotimizdagi eng muhim kunlardan birini — nikoh to'yimizni siz aziz insonlar bilan birga nishonlashni istaymiz.\nUshbu kechamizda yonimizda bo'lishingizni samimiy kutib qolamiz."
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  function handleOpenEntrance() {
    setEntranceOpen(true);
    musicRef.current?.play();
    setTimeout(() => setEntranceGone(true), 1200);
  }

  return (
    <div className={styles.root} style={rootStyle}>
      <div
        className={styles.backdrop}
        style={previewMode ? { position: "absolute" } : undefined}
      >
        {backdrop === "glow" && (
          <>
            <div ref={(el) => { glowRefs.current[0] = el; }} className={`${styles.glow} ${styles.glow1}`} />
            <div ref={(el) => { glowRefs.current[1] = el; }} className={`${styles.glow} ${styles.glow2}`} />
            <div ref={(el) => { glowRefs.current[2] = el; }} className={`${styles.glow} ${styles.glow3}`} />
            <div ref={(el) => { glowRefs.current[3] = el; }} className={`${styles.glow} ${styles.glow4}`} />
          </>
        )}
        {backdrop === "sunburst" && (
          <div ref={sunburstRef} className={styles.sunburstWrap}>
            <svg viewBox="0 0 400 400">
              <g stroke="var(--gold)" strokeWidth="1" fill="none">
                {rays.map((r, i) => (
                  <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
                ))}
                <circle cx="200" cy="200" r="60" />
                <circle cx="200" cy="200" r="90" />
                <circle cx="200" cy="200" r="120" />
              </g>
            </svg>
          </div>
        )}
      </div>
      <div
        className={styles.grain}
        style={previewMode ? { position: "absolute" } : undefined}
      />
      <div
        className={styles.pageFrame}
        style={previewMode ? { position: "absolute" } : undefined}
      />

      {!previewMode && (
        <div
          className={`${styles.entrance} ${entranceOpen ? styles.entranceOpen : ""} ${
            entranceGone ? styles.entranceGone : ""
          }`}
        >
          <div className={styles.entranceFrame} />
          <div
            className={styles.entranceInner}
            role="button"
            tabIndex={0}
            onClick={handleOpenEntrance}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleOpenEntrance();
            }}
          >
            <Monogram variant={monogram} className={styles.monogram} />
            <div className={`${styles.entranceLabel} ${styles.label}`}>To&apos;y taklifnomasi</div>
            <div className={`${styles.entranceNames} ${styles.display}`}>
              {invitation.groom_name}
              <span className={styles.entranceAmp}>&amp;</span>
              {invitation.bride_name}
            </div>
            <div className={styles.entranceDate}>{shortDate}</div>
            <div className={styles.enterBtn}>Taklifnomani ochish</div>
          </div>
        </div>
      )}

      <div className={`${styles.hero} ${previewMode ? styles.heroPreview : ""}`}>
        <Monogram variant={monogram} className={styles.heroMonogram} />
        <div className={`${styles.heroLabel} ${styles.label}`}>To&apos;y taklifnomasi</div>
        <div className={`${styles.heroNames} ${styles.display}`}>
          {invitation.groom_name}
          <span className={styles.heroAmp}>&amp;</span>
          {invitation.bride_name}
        </div>
        <div className={styles.heroRule} />
        <div className={styles.heroDate}>
          {weekday}, {fullDate}
        </div>
      </div>
      {panel === "bordered" && <div className={styles.chevronRule} />}

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={panelClass}>
          {panel === "bordered" && (
            <>
              <span className={`${styles.cornerMark} ${styles.cornerTl}`} />
              <span className={`${styles.cornerMark} ${styles.cornerTr}`} />
              <span className={`${styles.cornerMark} ${styles.cornerBl}`} />
              <span className={`${styles.cornerMark} ${styles.cornerBr}`} />
            </>
          )}
          <div className={styles.greeting}>
            {messageLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <div className={styles.signature}>
            <div className={styles.signatureFrom}>Hurmat bilan</div>
            <div className={`${styles.signatureNames} ${styles.display}`}>
              {invitation.groom_name} &amp; {invitation.bride_name}
            </div>
          </div>
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={panelClass}>
          {panel === "bordered" && (
            <>
              <span className={`${styles.cornerMark} ${styles.cornerTl}`} />
              <span className={`${styles.cornerMark} ${styles.cornerTr}`} />
              <span className={`${styles.cornerMark} ${styles.cornerBl}`} />
              <span className={`${styles.cornerMark} ${styles.cornerBr}`} />
            </>
          )}
          <div className={`${styles.sectionLabel} ${styles.label}`}>Tantana tafsilotlari</div>
          <div className={`${styles.sectionTitle} ${styles.display}`}>Kun va manzil</div>
          <div>
            <div className={styles.detailRow}>
              <div className={styles.detailKey}>Sana</div>
              <div className={`${styles.detailVal} ${styles.detailValBig}`}>{fullDate}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailKey}>Vaqt</div>
              <div className={`${styles.detailVal} ${styles.detailValBig}`}>
                {invitation.wedding_time}
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailKey}>To&apos;yxona</div>
              <div className={styles.detailVal}>{invitation.venue_name}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailKey}>Manzil</div>
              <div className={styles.detailVal}>{invitation.venue_address}</div>
            </div>
          </div>
          {invitation.venue_map_url && (
            <div className={styles.mapWrap}>
              <a
                href={invitation.venue_map_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                Xaritada ko&apos;rish
              </a>
            </div>
          )}
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={panelClass}>
          {panel === "bordered" && (
            <>
              <span className={`${styles.cornerMark} ${styles.cornerTl}`} />
              <span className={`${styles.cornerMark} ${styles.cornerTr}`} />
              <span className={`${styles.cornerMark} ${styles.cornerBl}`} />
              <span className={`${styles.cornerMark} ${styles.cornerBr}`} />
            </>
          )}
          <div className={styles.guest}>
            <div className={styles.label}>Hurmatli mehmon</div>
            <div className={`${styles.guestName} ${styles.display}`}>Aziz mehmonimiz</div>
            <div className={styles.guestNote}>
              Bayramona kechamizda yonimizda bo&apos;lishingizni intizorlik bilan kutamiz
            </div>
          </div>
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={panelClass}>
          {panel === "bordered" && (
            <>
              <span className={`${styles.cornerMark} ${styles.cornerTl}`} />
              <span className={`${styles.cornerMark} ${styles.cornerTr}`} />
              <span className={`${styles.cornerMark} ${styles.cornerBl}`} />
              <span className={`${styles.cornerMark} ${styles.cornerBr}`} />
            </>
          )}
          <div className={`${styles.sectionLabel} ${styles.label}`}>To&apos;ygacha qoldi</div>
          <div className={`${styles.sectionTitle} ${styles.display}`}>Ortga sanash</div>
          <CountdownTimer targetDate={weddingDateTime} variant="divided" />
          <div className={styles.closingNote}>Siz bilan uchrashishni orziqib kutamiz</div>
        </div>
      </RevealCard>

      <footer className={styles.footer}>
        <Monogram variant={monogram} className={styles.footerMonogram} />
        <div className={`${styles.footerNames} ${styles.display}`}>
          {invitation.groom_name} &amp; {invitation.bride_name}
        </div>
        <div className={`${styles.footerTag} ${styles.label}`}>oilalari nomidan</div>
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{
            background: "var(--ivory)",
            color: "var(--ink)",
            border: "1px solid var(--gold)",
          }}
        />
      )}
    </div>
  );
}
