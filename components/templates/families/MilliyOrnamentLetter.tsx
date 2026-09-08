"use client";

import { useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { CalendarHighlight } from "../CalendarHighlight";
import { RevealCard } from "../RevealCard";
import { PhotoGallery } from "../PhotoGallery";
import { useScrollLock } from "../useScrollLock";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import { uzMonthYear } from "@/lib/uzDate";
import styles from "./MilliyOrnamentLetter.module.css";

const ASSETS = "/imported-assets/milliy-ornament";

export function MilliyOrnamentLetter({
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

  useScrollLock(!previewMode && !gone);

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const monthLabel = uzMonthYear(new Date(weddingDateTime));
  const schedule = invitation.schedule_items;

  const messageLines = (
    invitation.custom_message ||
    `Sizni nikoh to'yimiz munosabati bilan bo'lib o'tadigan "Visol oqshomi"ga taklif etamiz.`
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  function handleOpen() {
    setOpen(true);
    musicRef.current?.play();
    setTimeout(() => setGone(true), 950);
  }

  return (
    <div className={`${styles.root} ${open ? styles.revealed : ""}`} style={rootStyle}>
      {!previewMode && (
        <section
          className={`${styles.intro} ${open ? styles.introOpening : ""} ${
            gone ? styles.introGone : ""
          }`}
        >
          <div className={styles.stage} role="img" aria-label="taklif qilamiz">
            <div className={`${styles.flap} ${styles.flapTop}`}>
              <p className={styles.note}>
                <span className={styles.noteTop}>Sizni</span>
                <span className={styles.noteMiddle}>To&apos;yimizga</span>
                <span className={`${styles.noteScript} ${styles.script}`}>taklif qilamiz</span>
              </p>
            </div>
            <div className={`${styles.flap} ${styles.flapLeft}`} />
            <div className={`${styles.flap} ${styles.flapRight}`} />
            <div className={`${styles.flap} ${styles.flapBottom}`}>
              <p className={styles.signature}>
                muhabbat ila,
                <strong>
                  {invitation.groom_name}&nbsp;va&nbsp;{invitation.bride_name}
                </strong>
              </p>
            </div>
            <button
              type="button"
              className={styles.seal}
              onClick={handleOpen}
              aria-expanded={open}
              aria-label="Taklifnomani ochish"
            >
              <span>ochish</span>
            </button>
          </div>
        </section>
      )}

      <main className={styles.sheet}>
        <section className={`${styles.hero} ${invitation.cover_photo_url ? "" : styles.heroNoPhoto}`}>
          <article className={styles.heritage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ASSETS}/border-ornament.webp`}
              alt=""
              aria-hidden
              className={styles.heritageBorder}
            />
            <div className={styles.horns} aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ASSETS}/horn.webp`} alt="" className={`${styles.horn} ${styles.hornLeft}`} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ASSETS}/horn.webp`} alt="" className={`${styles.horn} ${styles.hornRight}`} />
            </div>
            <p className={styles.names}>
              <span className={styles.namesLine}>{invitation.groom_name}</span>
              <span className={styles.namesAmp}>va</span>
              <span className={styles.namesLine}>{invitation.bride_name}</span>
            </p>
            {invitation.cover_photo_url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={invitation.cover_photo_url}
                alt={`${invitation.groom_name} va ${invitation.bride_name}`}
                className={styles.couplePhoto}
                loading="eager"
              />
            )}
          </article>
          {!previewMode && (
            <a className={styles.scroll} href="#anx-letter">
              <span className={styles.scrollText}>Pastga tushuring</span>
              <span className={styles.scrollArrow} aria-hidden>
                ↓
              </span>
            </a>
          )}
        </section>

        <RevealCard className={styles.letter} alwaysVisible={previewMode}>
          <h1 className={`${styles.letterTitle} ${styles.script}`} id="anx-letter">
            {invitation.guest_name
              ? `Hurmatli ${invitation.guest_name}!`
              : "Aziz va qadrdon insonimiz!"}
          </h1>
          {messageLines.map((line, i) => (
            <p key={i} className={styles.lead}>
              {line}
            </p>
          ))}
        </RevealCard>

        <div className={styles.details}>
          <div className={styles.sprigs} aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/pomegranate.webp`} alt="" className={`${styles.sprig} ${styles.sprigTl}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/pomegranate.webp`} alt="" className={`${styles.sprig} ${styles.sprigMr}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/flower.webp`} alt="" className={`${styles.sprig} ${styles.sprigBl}`} />
          </div>

          <RevealCard
            className={`${styles.section} ${styles.sectionRuled}`}
            alwaysVisible={previewMode}
          >
            <div className={styles.cal}>
              <div className={`${styles.calHead} ${styles.script}`}>{monthLabel}</div>
              <CalendarHighlight
                date={invitation.wedding_date}
                gridClassName={styles.calGrid}
                cellClassName={styles.calDay}
                emptyClassName={styles.calDay}
                highlightClassName={styles.calHeart}
                headClassName={styles.calWd}
                heartSrc={`${ASSETS}/heart.webp`}
                weekOnly
              />
            </div>
          </RevealCard>

          <RevealCard className={styles.section} alwaysVisible={previewMode}>
            <h2 className={`${styles.venueTitle} ${styles.script}`}>To&apos;y manzili</h2>
            <p className={styles.venue}>{invitation.venue_name}</p>
            <p className={styles.address}>{invitation.venue_address}</p>
            {invitation.wedding_time && <p className={styles.addressAlt}>{invitation.wedding_time}</p>}
            {invitation.venue_map_url && (
              <div className={styles.maps}>
                <a
                  className={styles.mapLink}
                  href={invitation.venue_map_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Maps
                </a>
              </div>
            )}
          </RevealCard>

          {schedule.length > 0 && (
            <RevealCard
              className={`${styles.section} ${styles.sectionRuled}`}
              alwaysVisible={previewMode}
            >
              <h2 className={`${styles.venueTitle} ${styles.script}`}>Kun tartibi</h2>
              <ol className={styles.timeline}>
                {schedule.map((item, i) => (
                  <li key={i} className={styles.timelineItem}>
                    <span className={styles.timelineTime}>{item.time}</span>
                    <span className={styles.timelineLabel}>{item.label}</span>
                  </li>
                ))}
              </ol>
            </RevealCard>
          )}

          <RevealCard
            className={`${styles.section} ${styles.sectionRuled}`}
            alwaysVisible={previewMode}
          >
            <h2 className={`${styles.countTitle} ${styles.script}`}>Har lahzani sanayapmiz</h2>
            <CountdownTimer
              targetDate={weddingDateTime}
              live={!previewMode}
              pad
              classes={{
                root: styles.count,
                cell: styles.countCell,
                value: styles.countNum,
                label: styles.countLbl,
              }}
            />
            <p className={styles.countMsg}>Sizni intiqlik bilan kutamiz.</p>
          </RevealCard>

        </div>

        {invitation.gallery_photo_urls.length > 0 && (
          <RevealCard
            className={`${styles.section} ${styles.sectionOuter}`}
            alwaysVisible={previewMode}
          >
            <h2 className={`${styles.venueTitle} ${styles.script}`}>Xotira galereyasi</h2>
            <PhotoGallery
              photos={invitation.gallery_photo_urls}
              className={styles.galleryGrid}
              itemClassName={styles.galleryItem}
            />
          </RevealCard>
        )}

        {invitation.gift_card_number && (
          <RevealCard
            className={`${styles.section} ${styles.sectionOuter}`}
            alwaysVisible={previewMode}
          >
            <h2 className={`${styles.venueTitle} ${styles.script}`}>To&apos;yona</h2>
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
          </RevealCard>
        )}

        <footer className={styles.footer}>
          {invitation.groom_name} va {invitation.bride_name} oilalari
        </footer>
      </main>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--accent)", color: "var(--paper-card)" }}
        />
      )}
    </div>
  );
}
