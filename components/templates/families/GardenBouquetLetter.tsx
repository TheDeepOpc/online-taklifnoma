"use client";

import { useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { CalendarHighlight } from "../CalendarHighlight";
import { RevealCard } from "../RevealCard";
import { useScrollLock } from "../useScrollLock";
import { PhotoGallery } from "../PhotoGallery";
import { MapPinIcon, HeartIcon } from "../icons";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import { uzMonthName, uzWeekdayName } from "@/lib/uzDate";
import styles from "./GardenBouquetLetter.module.css";

const ASSETS = "/imported-assets/garden-bouquet";

const WEEKDAYS = ["DU", "SE", "CHOR", "PAY", "JU", "SHA", "YAK"];

function Divider({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <span />
      <i />
      <span />
    </div>
  );
}

export function GardenBouquetLetter({
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

  useScrollLock(!previewMode && !open);

  function handleOpen() {
    setOpen(true);
    musicRef.current?.play();
  }

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const weddingDay = new Date(`${invitation.wedding_date}T00:00:00`);
  const monthName = uzMonthName(weddingDay);
  const weekdayName = uzWeekdayName(weddingDay);
  const schedule = invitation.schedule_items;

  const messageLines = (
    invitation.custom_message ||
    `Sizni nikoh to'yimiz munosabati bilan bo'lib o'tadigan "Visol oqshomi"ga taklif etamiz.`
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.root} style={rootStyle}>
      <div
        className={styles.canvas}
        aria-hidden
        style={previewMode ? { position: "absolute" } : undefined}
      />

      {!previewMode && (
        <div className={`${styles.entrance} ${open ? styles.entranceGone : ""}`}>
          <div className={styles.entranceStack}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/corner-bouquet.webp`} alt="" className={styles.entranceFlowerTop} />
            <div className={`${styles.card} ${styles.entranceCard}`}>
              <div className={styles.entranceRing} aria-hidden>
                <HeartIcon />
              </div>
              <div className={styles.namesStack}>
                <span className={`${styles.nameLine} ${styles.script}`}>{invitation.groom_name}</span>
                <span className={`${styles.amp} ${styles.script}`}>&amp;</span>
                <span className={`${styles.nameLine} ${styles.script}`}>{invitation.bride_name}</span>
              </div>
              <Divider className={styles.divider} />
              <p className={styles.heroDate}>
                {weddingDay.getDate()} {monthName} {weddingDay.getFullYear()}
              </p>
              <p className={`${styles.label} ${styles.entranceIntro}`}>
                Bizning baxtli kunimizni siz bilan birga nishonlash va quvonchimizga sherik
                bo&apos;lishingiz uchun sizni nikoh to&apos;yimizga samimiy taklif etamiz
              </p>
              <button type="button" className={styles.openBtn} onClick={handleOpen}>
                Ochish
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/garland.webp`} alt="" className={styles.entranceFlowerBottom} />
          </div>
        </div>
      )}

      <section className={styles.hero}>
        <div className={styles.card}>
          <p className={styles.label}>Marosim haqida</p>
          <div className={styles.namesStack}>
            <span className={`${styles.nameLineLg} ${styles.script}`}>{invitation.groom_name}</span>
            <span className={`${styles.amp} ${styles.script}`}>&amp;</span>
            <span className={`${styles.nameLineLg} ${styles.script}`}>{invitation.bride_name}</span>
          </div>
          <Divider className={styles.divider} />
          <p className={styles.label}>Nikoh marosimi bo&apos;lib o&apos;tadi</p>
          <p className={styles.venueName}>{invitation.venue_name}</p>
          <p className={styles.venueAddr}>{invitation.venue_address}</p>
          <div className={styles.dateRow}>
            <span className={`${styles.label} ${styles.dateSide}`}>{weekdayName}</span>
            <span className={styles.dateRule} aria-hidden />
            <span className={`${styles.dateBig} ${styles.script}`}>{weddingDay.getDate()}</span>
            <span className={styles.dateRule} aria-hidden />
            <span className={`${styles.label} ${styles.dateSide}`}>{monthName}</span>
          </div>
          <p className={styles.dateYear}>{weddingDay.getFullYear()}</p>
          {invitation.wedding_time && (
            <p className={styles.label}>Soat {invitation.wedding_time}</p>
          )}
        </div>
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <p className={styles.label}>
            {invitation.guest_name ? `Hurmatli ${invitation.guest_name}` : "Aziz mehmonimiz"}
          </p>
          {messageLines.map((line, i) => (
            <p key={i} className={styles.greetingText}>
              {line}
            </p>
          ))}
          <Divider className={styles.divider} />
          <p className={styles.label}>Hurmat bilan,</p>
          <p className={`${styles.signature} ${styles.script}`}>
            {invitation.groom_name} <span>&amp;</span> {invitation.bride_name}
          </p>
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <p className={styles.label}>To&apos;ygacha qolgan vaqt</p>
          <CountdownTimer
            targetDate={weddingDateTime}
            live={!previewMode}
            pad
            labels={["KUN", "SOAT", "DAQIQA", "SONIYA"]}
            classes={{
              root: styles.countGrid,
              cell: styles.countCell,
              value: styles.countValue,
              label: styles.countLabel,
            }}
          />
          <div className={styles.calendarWrap}>
            <p className={styles.label}>
              {monthName} {weddingDay.getFullYear()}
            </p>
            <CalendarHighlight
              date={invitation.wedding_date}
              gridClassName={styles.calendarGrid}
              cellClassName={styles.calendarCell}
              emptyClassName={styles.calendarCell}
              highlightClassName={styles.calendarHighlight}
              headClassName={styles.calendarLabel}
              weekdays={WEEKDAYS}
            />
          </div>
        </div>
      </RevealCard>

      {schedule.length > 0 && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.card}>
            <p className={styles.label}>Kun tartibi</p>
            <ol className={styles.timeline}>
              {schedule.map((item, i) => (
                <li key={i} className={styles.timelineItem}>
                  <span className={styles.timelineTime}>{item.time}</span>
                  <span className={styles.timelineLabel}>{item.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </RevealCard>
      )}

      {invitation.gallery_photo_urls.length > 0 && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.card}>
            <p className={styles.label}>Bizning xotiralarimiz</p>
            <h2 className={`${styles.cardTitle} ${styles.script}`}>To&apos;y albomi</h2>
            <Divider className={styles.divider} />
            <PhotoGallery
              photos={invitation.gallery_photo_urls}
              className={styles.galleryGrid}
              itemClassName={styles.galleryItem}
            />
          </div>
        </RevealCard>
      )}

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <p className={styles.label}>Manzil</p>
          <h2 className={`${styles.cardTitle} ${styles.script}`}>{invitation.venue_name}</h2>
          <p className={styles.venueAddr}>{invitation.venue_address}</p>
          <Divider className={styles.divider} />
          {invitation.venue_map_url && (
            <a
              href={invitation.venue_map_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapBtn}
            >
              <MapPinIcon className="h-4 w-4" /> Google Maps
            </a>
          )}
        </div>
      </RevealCard>

      {invitation.gift_card_number && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.card}>
            <p className={styles.label}>To&apos;yona</p>
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/garland.webp`} alt="" className={styles.closingGarland} />
        <h2 className={`${styles.cardTitle} ${styles.script}`}>Sizni kutamiz</h2>
        <p className={styles.label}>Ko&apos;rishguncha</p>
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--accent)", color: "var(--accent-text)" }}
        />
      )}
    </div>
  );
}
