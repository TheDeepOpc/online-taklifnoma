"use client";

import { useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { CalendarHighlight } from "../CalendarHighlight";
import { RevealCard } from "../RevealCard";
import { MapPinIcon } from "../icons";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import { uzMonthYear } from "@/lib/uzDate";
import styles from "./EnvelopeCalendarLetter.module.css";

export function EnvelopeCalendarLetter({
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
  const [open, setOpen] = useState(previewMode);
  const [gone, setGone] = useState(previewMode);
  const [copied, setCopied] = useState(false);

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const monthLabel = uzMonthYear(new Date(weddingDateTime));

  const messageLines = (
    invitation.custom_message ||
    "Hayotimdagi unutilmas kunlardan biri — to'yimizni siz bilan birga nishonlashni niyat qildik.\nSizni ushbu kechamizga samimiy taklif etamiz."
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  function handleOpen() {
    setOpen(true);
    musicRef.current?.play();
    setTimeout(() => setGone(true), 1000);
  }

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

  const heroStyle = theme.heroStyle ?? "ornament";
  const hasBothPhotos = invitation.cover_photo_url && invitation.second_photo_url;

  return (
    <div className={styles.root} style={rootStyle}>
      {!previewMode && (
        <div
          className={`${styles.entrance} ${gone ? styles.entranceGone : ""}`}
        >
          <div className={`${styles.envelope} ${open ? styles.envelopeOpen : ""}`}>
            <div className={`${styles.flap} ${styles.flapLeft}`} />
            <div className={`${styles.flap} ${styles.flapRight}`} />
            <div className={`${styles.flap} ${styles.flapBottom}`}>
              <p className={styles.flapSignature}>
                muhabbat ila,
                <strong>
                  {invitation.groom_name} &amp; {invitation.bride_name}
                </strong>
              </p>
            </div>
            <div className={`${styles.flap} ${styles.flapTop}`} />
            <button type="button" className={styles.seal} onClick={handleOpen}>
              Ochish
            </button>
          </div>
        </div>
      )}

      <section className={styles.hero}>
        <div className={`${styles.heroEyebrow} ${styles.label}`}>To&apos;y taklifnomasi</div>

        {heroStyle === "photo-pair" && hasBothPhotos ? (
          <div className={styles.photoPairGrid}>
            <figure className={styles.polaroid}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.polaroidImg} src={invitation.cover_photo_url!} alt="" />
              <figcaption className={styles.polaroidCaption}>Kelin</figcaption>
            </figure>
            <figure className={styles.polaroid}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.polaroidImg} src={invitation.second_photo_url!} alt="" />
              <figcaption className={styles.polaroidCaption}>Kuyov</figcaption>
            </figure>
          </div>
        ) : heroStyle === "photo-single" && invitation.cover_photo_url ? (
          <div className={styles.singlePhotoWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.singlePhotoImg} src={invitation.cover_photo_url} alt="" />
            <div className={styles.singlePhotoOverlay}>
              <div className={`${styles.singlePhotoNames} ${styles.script}`}>
                {invitation.groom_name} &amp; {invitation.bride_name}
              </div>
            </div>
          </div>
        ) : (
          <div className={`${styles.heroNames} ${styles.script}`}>
            {invitation.groom_name} &amp; {invitation.bride_name}
          </div>
        )}

        <p className={styles.scrollHint}>pastga suring ↓</p>
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          {messageLines.map((line, i) => (
            <p key={i} className={styles.greetingText}>
              {line}
            </p>
          ))}
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <div className={styles.calendarHead}>{monthLabel}</div>
          <CalendarHighlight
            date={invitation.wedding_date}
            cellClassName={styles.calendarCell}
            emptyClassName={styles.calendarEmpty}
            highlightClassName={styles.calendarHighlight}
            headClassName={styles.label}
          />
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.sectionTitle}>Manzil</div>
        <div className={styles.venueName}>{invitation.venue_name}</div>
        <div className={styles.venueAddr}>{invitation.venue_address}</div>
        {invitation.venue_map_url && (
          <a
            href={invitation.venue_map_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapBtn}
          >
            <MapPinIcon className="h-4 w-4" /> Xaritada ko&apos;rish
          </a>
        )}
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>To&apos;yimizgacha</div>
          <CountdownTimer targetDate={weddingDateTime} variant="divided" />
        </div>
      </RevealCard>

      {invitation.gift_card_number && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.card}>
            <div className={styles.sectionTitle}>Sovg&apos;a</div>
            <p className={styles.greetingText}>
              Istasangiz, iliq tilaklaringizni sovg&apos;a bilan to&apos;ldirishingiz mumkin.
            </p>
            <div className={styles.giftRow}>
              <span className={styles.label}>{invitation.groom_name}</span>
              <span className={styles.giftNumber}>{invitation.gift_card_number}</span>
            </div>
            <button type="button" className={styles.copyBtn} onClick={handleCopyGift}>
              {copied ? "Nusxalandi ✓" : "Nusxalash"}
            </button>
          </div>
        </RevealCard>
      )}

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name}
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--envelope-start)", color: "var(--envelope-text)" }}
        />
      )}
    </div>
  );
}
