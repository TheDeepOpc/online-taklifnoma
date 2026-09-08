"use client";

import { useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { RevealCard } from "../RevealCard";
import { useScrollLock } from "../useScrollLock";
import { PhotoGallery } from "../PhotoGallery";
import { MapPinIcon, HeartIcon, MusicNoteIcon } from "../icons";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import styles from "./AmberDawnLetter.module.css";

export function AmberDawnLetter({
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
  const [opened, setOpened] = useState(previewMode);

  useScrollLock(!previewMode && !opened);

  function handleOpen() {
    setOpened(true);
    musicRef.current?.play();
  }

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const [year, month, day] = invitation.wedding_date.split("-");
  const dateLabel = `${day}.${month}.${year}`;

  const messageLines = (
    invitation.custom_message ||
    `Sizni nikoh to'yimiz munosabati bilan bo'lib o'tadigan "Visol oqshomi"ga taklif etamiz.`
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.root} style={rootStyle}>
      <div className={styles.blobs} aria-hidden>
        <span className={`${styles.blob} ${styles.blobAmber}`} />
        <span className={`${styles.blob} ${styles.blobRose}`} />
        <span className={`${styles.blob} ${styles.blobPink}`} />
      </div>

      {!previewMode && (
        <div className={`${styles.gate} ${opened ? styles.gateGone : ""}`}>
          <div className={styles.gateVeil} aria-hidden />
          <div className={styles.gateBlobs} aria-hidden>
            <span className={styles.gateBlob1} />
            <span className={styles.gateBlob2} />
            <span className={styles.gateBlob3} />
            <span className={styles.gateBlob4} />
          </div>
          <div className={styles.gateInner}>
            <div className={styles.gateBadgeWrap}>
              <div className={styles.gateBadge}>
                <HeartIcon className={styles.gateBadgeIcon} />
              </div>
              <span className={styles.gateDotA} aria-hidden />
              <span className={styles.gateDotB} aria-hidden />
            </div>
            <h1 className={styles.gateTitle}>
              {invitation.groom_name} va {invitation.bride_name} to&apos;yiga xush kelibsiz
            </h1>
            <p className={styles.gateLead}>
              Ularning maxsus kunini nishonlashda bizga qo&apos;shiling
            </p>
            <div className={styles.gateMusic}>
              <MusicNoteIcon className={styles.gateMusicIcon} />
              <span>fon musiqasi bilan</span>
              <MusicNoteIcon className={styles.gateMusicIcon} />
            </div>
            <button type="button" className={styles.gateBtn} onClick={handleOpen}>
              <HeartIcon className={styles.gateBtnIcon} />
              To&apos;y saytiga kirish
            </button>
            <p className={styles.gateHint}>Boshlash uchun bosing</p>
          </div>
          <div className={styles.gateDots} aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      <section className={`${styles.hero} ${previewMode ? styles.heroPreview : ""}`}>
        <p className={styles.heroEyebrow}>Nikoh to&apos;yiga taklifnoma</p>
        <h1 className={styles.heroNames}>
          {invitation.groom_name} &amp; {invitation.bride_name}
        </h1>
        <p className={styles.heroSubtitle}>
          Ularning maxsus kunini nishonlashda bizga qo&apos;shiling
        </p>
        {opened && !previewMode && <p className={styles.scrollHint}>Pastga suring ↓</p>}
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>
            {invitation.guest_name ? `Hurmatli ${invitation.guest_name}` : "Aziz mehmonimiz"}
          </h2>
          {messageLines.map((line, i) => (
            <p key={i} className={styles.greetingText}>
              {line}
            </p>
          ))}
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>To&apos;ygacha qoldi</h2>
          <CountdownTimer targetDate={weddingDateTime} variant="divided" live={!previewMode} />
          <p className={styles.countdownMsg}>Siz bilan nishonlashni intizorlik bilan kutamiz!</p>
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>To&apos;y tafsilotlari</h2>
          <div className={styles.detailsGrid}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Qachon</span>
              <span className={styles.detailValue}>
                {dateLabel} — soat {invitation.wedding_time}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Qayerda</span>
              <span className={styles.detailValue}>{invitation.venue_name}</span>
              <span className={styles.detailValue}>{invitation.venue_address}</span>
            </div>
          </div>
          {invitation.venue_map_url && (
            <a
              href={invitation.venue_map_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapBtn}
            >
              <MapPinIcon className="h-4 w-4" /> Xaritada ko&apos;rsatish
            </a>
          )}
        </div>
      </RevealCard>

      {invitation.gallery_photo_urls.length > 0 && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Bizning xotiralarimiz</h2>
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

      <RevealCard className={`${styles.section} ${styles.closing}`} alwaysVisible={previewMode}>
        <p className={styles.closingNames}>
          {invitation.groom_name} &amp; {invitation.bride_name}
        </p>
        <p className={styles.closingText}>
          Quvonchli kunimizni biz bilan baham ko&apos;rganingiz uchun rahmat.
        </p>
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "#f43f5e", color: "#fff" }}
        />
      )}
    </div>
  );
}
