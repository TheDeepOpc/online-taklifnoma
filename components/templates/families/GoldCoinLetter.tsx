"use client";

import { useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import { uzMonthName, uzWeekdayName } from "@/lib/uzDate";
import { FloatingDecoration } from "../decorations";
import { RevealCard } from "../RevealCard";
import { MapPinIcon } from "../icons";
import styles from "./GoldCoinLetter.module.css";

type CoinKey = "day" | "month" | "year";

export function GoldCoinLetter({
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
  const [flipped, setFlipped] = useState<Record<CoinKey, boolean>>({
    day: false,
    month: false,
    year: false,
  });

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const weddingDate = new Date(weddingDateTime);

  const day = weddingDate.getDate();
  const monthLabel = uzMonthName(weddingDate);
  const year = weddingDate.getFullYear();
  const weekday = uzWeekdayName(weddingDate);
  const fullDateLabel = `${day} ${monthLabel}, ${year}`;

  const coins: { key: CoinKey; value: string | number }[] = [
    { key: "day", value: day },
    { key: "month", value: monthLabel },
    { key: "year", value: year },
  ];
  const allFlipped = coins.every((c) => flipped[c.key]);

  const messageLines = (
    invitation.custom_message ||
    "Hayotimizdagi eng baxtli kunlardan biri — nikoh to'yimizni siz bilan birga nishonlashni niyat qildik.\nSizni ushbu kechamizga samimiy taklif etamiz."
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  function handleOpenEntrance() {
    setEntranceOpen(true);
    musicRef.current?.play();
    setTimeout(() => setEntranceGone(true), 1300);
  }

  function toggleCoin(key: CoinKey) {
    setFlipped((prev) => ({ ...prev, [key]: true }));
  }

  return (
    <div className={styles.root} style={rootStyle}>
      {theme.decorationEmoji && (
        <FloatingDecoration emoji={theme.decorationEmoji} previewMode={previewMode} />
      )}

      {!previewMode && (
        <div
          className={`${styles.entrance} ${entranceOpen ? styles.entranceOpen : ""} ${
            entranceGone ? styles.entranceGone : ""
          }`}
        >
          <div className={`${styles.panel} ${styles.panelLeft}`} />
          <div className={`${styles.panel} ${styles.panelRight}`} />
          <div
            className={styles.entranceCenter}
            role="button"
            tabIndex={0}
            onClick={handleOpenEntrance}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleOpenEntrance();
            }}
          >
            <div className={styles.ringIcon}>
              <span className={styles.circle1} />
              <span className={styles.circle2} />
            </div>
            <div className={styles.entranceLabel}>To&apos;y taklifnomasi</div>
            <div className={styles.entranceTap}>Ochish uchun bosing</div>
          </div>
        </div>
      )}

      <section className={`${styles.hero} ${previewMode ? styles.heroPreview : ""}`}>
        <div className={styles.arch} />
        <div className={styles.heroEyebrow}>To&apos;y taklifnomasi</div>
        <div className={styles.heroNames}>
          {invitation.groom_name}
          <span className={`${styles.amp} ${styles.script}`}>&amp;</span>
          {invitation.bride_name}
        </div>
        <div className={styles.scrollHint}>pastga suring</div>
        <div className={styles.scrollArrow} aria-hidden>
          ↓
        </div>
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.greetingTitle}>
          Aziz va<span className={styles.greetingBig}>qadrdon mehmonimiz!</span>
        </div>
        <div className={styles.divider} />
        {messageLines.map((line, i) => (
          <p key={i} className={styles.greetingText}>
            {line}
          </p>
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

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.dateTitleWrap}>
          <div className={styles.dateTitleEyebrow}>✦ Taxmin qiling ✦</div>
          <div className={styles.dateTitle}>Sanani oching</div>
        </div>
        <p className={styles.sectionSub}>Davom etish uchun barcha doiralarni bosing</p>
        <div className={styles.coins}>
          {coins.map((coin) => (
            <div
              key={coin.key}
              className={`${styles.coin} ${flipped[coin.key] ? styles.coinFlipped : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => toggleCoin(coin.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleCoin(coin.key);
              }}
            >
              <div className={styles.coinInner}>
                <div className={`${styles.coinFace} ${styles.coinFront}`}>✦</div>
                <div className={`${styles.coinFace} ${styles.coinBack}`}>{coin.value}</div>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.coinsHint}>Sanani bilish uchun doiralarni bosing</p>
        <div className={`${styles.fullDate} ${allFlipped ? styles.fullDateShow : ""}`}>
          <span className={styles.dow}>{weekday}</span>
          {fullDateLabel}
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.sectionTitle}>Manzil</div>
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

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.ornateFrame}>
          <span className={`${styles.diamond} ${styles.diamondTl}`}>◆</span>
          <span className={`${styles.diamond} ${styles.diamondTr}`}>◆</span>
          <span className={`${styles.diamond} ${styles.diamondBl}`}>◆</span>
          <span className={`${styles.diamond} ${styles.diamondBr}`}>◆</span>
          <div className={styles.guestLabel}>Hurmatli mehmon</div>
          <div className={styles.guestNote}>Tashrifingizni sabrsizlik bilan kutamiz</div>
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.countdownTitle}>To&apos;yimizgacha</div>
        <div className={styles.ornateFrame}>
          <span className={`${styles.diamond} ${styles.diamondTl}`}>◆</span>
          <span className={`${styles.diamond} ${styles.diamondTr}`}>◆</span>
          <span className={`${styles.diamond} ${styles.diamondBl}`}>◆</span>
          <span className={`${styles.diamond} ${styles.diamondBr}`}>◆</span>
          <CountdownTimer targetDate={weddingDateTime} variant="ornate" />
        </div>
        <p className={styles.closingNote}>Siz bilan uchrashuvni intiqlik bilan kutamiz</p>
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "#454c30", color: "#fdf3de" }}
        />
      )}
    </div>
  );
}
