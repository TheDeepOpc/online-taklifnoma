"use client";

import { useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { RevealCard } from "../RevealCard";
import { useScrollLock } from "../useScrollLock";
import { PhotoGallery } from "../PhotoGallery";
import { MapPinIcon } from "../icons";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import styles from "./BlushPortraitLetter.module.css";

const ASSETS = "/imported-assets/blush-portrait";

export function BlushPortraitLetter({
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

  useScrollLock(!previewMode && !gone);
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

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const schedule = invitation.schedule_items;

  const messageLines = (
    invitation.custom_message ||
    "Bu kun biz uchun shunchaki bayram emas. Bu — hayotga bo'lgan umumiy qarashimiz, bir-birimizga bo'lgan mehr va e'tiborimiz timsolidir.\nBiz bu quvonchni yaqinlarimiz va do'stlarimiz davrasida baham ko'rishni orzu qildik."
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/oval-frame.png`} alt="" className={styles.entranceFrame} />
          <div className={styles.entranceCouple}>
            <p className={styles.script}>{invitation.groom_name}</p>
            <span>va</span>
            <p className={styles.script}>{invitation.bride_name}</p>
          </div>
          <button type="button" className={styles.entranceBtn} onClick={handleOpen}>
            Taklifnomani ochish
          </button>
        </div>
      )}

      <section className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/oval-frame.png`} alt="" className={styles.heroFrame} />
        <div className={styles.couple}>
          <p className={styles.script}>{invitation.groom_name}</p>
          <span>va</span>
          <p className={styles.script}>{invitation.bride_name}</p>
        </div>
        {!previewMode && (
          <div className={styles.scrollHint}>
            <small>Davomini ko&apos;rish uchun</small>
            <span>Pastga suring</span>
          </div>
        )}
      </section>

      <RevealCard className={styles.welcomeSection} alwaysVisible={previewMode}>
        <h2 className={styles.welcomeTitle}>
          {invitation.guest_name ? (
            `Hurmatli ${invitation.guest_name}!`
          ) : (
            <>
              Qadrli do&apos;stlar
              <br />
              va yaqinlar!
            </>
          )}
        </h2>
        {messageLines.map((line, i) => (
          <p key={i} className={styles.welcomeText}>
            {line}
          </p>
        ))}
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <div className={styles.locationBlock}>
            <MapPinIcon className={styles.locationIcon} />
            <h2 className={styles.sectionTitle}>To&apos;y manzili</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/venue-hall.png`} alt="" className={styles.venueIllustration} />
            <p className={styles.venueName}>{invitation.venue_name}</p>
            <p className={styles.venueAddr}>{invitation.venue_address}</p>
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
          </div>

          {schedule.length > 0 && (
            <div className={styles.programBlock}>
              <h2 className={styles.sectionTitle}>Kun dasturi</h2>
              <ol className={styles.timeline}>
                {schedule.map((item, i) => (
                  <li key={i} className={styles.timelineItem}>
                    <span className={styles.timelineMarker} aria-hidden />
                    <div className={styles.timelineCopy}>
                      <time>{item.time}</time>
                      <p>{item.label}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>To&apos;ygacha qoldi</h2>
          <CountdownTimer targetDate={weddingDateTime} variant="divided" live={!previewMode} />
        </div>
      </RevealCard>

      {invitation.gallery_photo_urls.length > 0 && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Xotira galereyasi</h2>
            <PhotoGallery
              photos={invitation.gallery_photo_urls}
              className={styles.galleryGrid}
              itemClassName={styles.galleryItem}
            />
          </div>
        </RevealCard>
      )}

      {invitation.gift_card_number && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>To&apos;yona</h2>
            <div className={styles.giftRow}>
              <span className={styles.giftLabel}>{invitation.gift_card_number}</span>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => navigator.clipboard.writeText(invitation.gift_card_number!)}
              >
                Nusxalash
              </button>
            </div>
          </div>
        </RevealCard>
      )}

      <RevealCard className={styles.closingBlock} alwaysVisible={previewMode}>
        <h2 className={styles.closingTitle}>Sizni intiqlik bilan kutamiz!</h2>
        <p className={styles.closingText}>
          Hurmat bilan, {invitation.groom_name} va {invitation.bride_name}
        </p>
      </RevealCard>

      <section className={styles.coupleScene} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/groom.png`} alt="" className={styles.groomFigure} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/bride.png`} alt="" className={styles.brideFigure} />
      </section>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--gold)", color: "var(--cream)" }}
        />
      )}
    </div>
  );
}
