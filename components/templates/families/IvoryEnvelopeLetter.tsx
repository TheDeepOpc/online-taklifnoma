"use client";

import { useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { RevealCard } from "../RevealCard";
import { useScrollLock } from "../useScrollLock";
import { PhotoGallery } from "../PhotoGallery";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import styles from "./IvoryEnvelopeLetter.module.css";

const ASSETS = "/imported-assets/ivory-envelope";

const PETALS = [1, 2, 3, 4, 5, 6] as const;

export function IvoryEnvelopeLetter({
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
    setTimeout(() => setGone(true), 1400);
  }

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const [year, month, day] = invitation.wedding_date.split("-");
  const dateLabel = `${day}.${month}.${year.slice(2)}`;
  const schedule = invitation.schedule_items;

  const messageLines = (
    invitation.custom_message ||
    `Sizni nikoh to'yimiz munosabati bilan bo'lib o'tadigan "Visol oqshomi" ga taklif etamiz`
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.root} style={rootStyle}>
      {!previewMode && (
        <div
          className={`${styles.cover} ${open ? styles.coverOpening : ""} ${
            gone ? styles.coverGone : ""
          }`}
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleOpen();
          }}
        >
          <div className={styles.coverStage}>
            <div className={styles.coverArt} />
            <div className={styles.coverSeal}>
              <span className={styles.mono}>
                {invitation.groom_name.charAt(0)}
                <span className={styles.monoAmp}>&amp;</span>
                {invitation.bride_name.charAt(0)}
              </span>
            </div>
            <p className={styles.coverCta}>
              <span className={styles.chev} />
              <span className={styles.coverLabel}>Ochish uchun bosing</span>
            </p>
          </div>
        </div>
      )}

      <main className={styles.page}>
        <section className={`${styles.sec} ${styles.hero}`}>
          <p className={`${styles.heroKicker} ${styles.script}`}>Nikoh kuni</p>
          <p className={styles.heroDate}>
            {dateLabel}
            {invitation.wedding_time && (
              <span className={styles.heroTime}>{invitation.wedding_time}</span>
            )}
          </p>
          <h1 className={styles.heroNames}>
            <span className={styles.heroName}>{invitation.groom_name}</span>
            <span className={`${styles.heroAmp} ${styles.script}`}>&amp;</span>
            <span className={styles.heroName}>{invitation.bride_name}</span>
          </h1>
          {!previewMode && (
            <span className={styles.scroll}>
              <span className={`${styles.scrollText} ${styles.script}`}>Pastga suring</span>
              <span className={styles.scrollChev} />
            </span>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ASSETS}/bouquet-left.webp`}
            alt=""
            className={`${styles.bouquet} ${styles.bouquetLeft}`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ASSETS}/bouquet-right.webp`}
            alt=""
            className={`${styles.bouquet} ${styles.bouquetRight}`}
          />
        </section>

        <section className={`${styles.sec} ${styles.paper} ${styles.blessing}`}>
          <RevealCard className={styles.inner} alwaysVisible={previewMode}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/basmala.webp`} alt="" className={styles.basmala} />
            <div className={`${styles.verse} ${styles.script}`}>
              <span>Ikki qalb</span>
              <span>Bitta taqdir</span>
              <span>Alloh yozgan umr</span>
            </div>
            {messageLines.map((line, i) => (
              <p key={i} className={styles.body}>
                {line}
              </p>
            ))}
          </RevealCard>
        </section>

        <section className={`${styles.sec} ${styles.countdown}`}>
          <RevealCard className={styles.inner} alwaysVisible={previewMode}>
            <h2 className={`${styles.sectionTitle} ${styles.script}`}>
              {invitation.guest_name
                ? `Hurmatli ${invitation.guest_name}`
                : "Bayram boshlanishiga"}
            </h2>
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
          </RevealCard>
        </section>

        {schedule.length > 0 && (
          <section className={`${styles.sec} ${styles.paper} ${styles.schedule}`}>
            <RevealCard className={styles.inner} alwaysVisible={previewMode}>
              <div className={styles.schedHead}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSETS}/ornament-left.webp`} alt="" />
                <h2 className={`${styles.sectionTitle} ${styles.script}`}>Kun tartibi</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSETS}/ornament-right.webp`} alt="" />
              </div>
              <div className={styles.schedWrap}>
                <span className={styles.schedSpine} aria-hidden />
                <ol className={styles.sched}>
                  {schedule.map((item, i) => (
                    <li key={i} className={styles.schedRow}>
                      <span className={styles.schedTime}>{item.time}</span>
                      <span className={styles.schedNode} aria-hidden />
                      <span className={styles.schedLabel}>{item.label}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </RevealCard>
          </section>
        )}

        <section className={`${styles.sec} ${styles.location}`}>
          {PETALS.map((n) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={n}
              src={`${ASSETS}/petal-${n}.webp`}
              alt=""
              className={`${styles.petal} ${styles[`petal${n}` as const]}`}
            />
          ))}
          <RevealCard className={styles.inner} alwaysVisible={previewMode}>
            <h2 className={`${styles.sectionTitle} ${styles.script}`}>Manzil</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/divider.webp`} alt="" className={styles.divider} />
            <p className={styles.venue}>{invitation.venue_name}</p>
            <p className={styles.address}>{invitation.venue_address}</p>
          </RevealCard>
        </section>

        {invitation.venue_map_url && (
          <section className={`${styles.sec} ${styles.map}`}>
            <RevealCard className={styles.inner} alwaysVisible={previewMode}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ASSETS}/map-ornament-top.webp`} alt="" className={styles.mapOrn} />
              <div className={styles.maps}>
                <a
                  href={invitation.venue_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.btn} ${styles.btnSolid}`}
                >
                  Google Maps
                </a>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ASSETS}/map-ornament-bottom.webp`} alt="" className={styles.mapOrn} />
            </RevealCard>
          </section>
        )}

        {invitation.gallery_photo_urls.length > 0 && (
          <section className={`${styles.sec} ${styles.gallerySec}`}>
            <RevealCard className={styles.inner} alwaysVisible={previewMode}>
              <h2 className={`${styles.sectionTitle} ${styles.script}`}>Xotiralarimiz</h2>
              <PhotoGallery
                photos={invitation.gallery_photo_urls}
                className={styles.galleryGrid}
                itemClassName={styles.galleryItem}
              />
            </RevealCard>
          </section>
        )}

        {invitation.gift_card_number && (
          <section className={`${styles.sec} ${styles.paper} ${styles.notes}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ASSETS}/floral-right.webp`}
              alt=""
              className={`${styles.floral} ${styles.floralRight}`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ASSETS}/floral-left.webp`}
              alt=""
              className={`${styles.floral} ${styles.floralLeft}`}
            />
            <RevealCard className={styles.inner} alwaysVisible={previewMode}>
              <h2 className={`${styles.sectionTitle} ${styles.script}`}>To&apos;yona</h2>
              <p className={styles.body}>Sizning tashrifingiz — biz uchun eng yaxshi sovg&apos;a!</p>
              <div className={styles.giftRow}>
                <span className={styles.giftLabel}>{invitation.gift_card_number}</span>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => navigator.clipboard.writeText(invitation.gift_card_number!)}
                >
                  Nusxalash
                </button>
              </div>
            </RevealCard>
          </section>
        )}

        <section className={`${styles.sec} ${styles.closing}`}>
          {invitation.cover_photo_url && (
            <div className={styles.closingStage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={invitation.cover_photo_url} alt="" className={styles.closingPhoto} />
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/wreath-bottom.webp`} alt="" className={styles.wreath} />
          <RevealCard className={styles.inner} alwaysVisible={previewMode}>
            <h2 className={`${styles.sectionTitle} ${styles.script}`}>
              Sizni ko&apos;rishga umid qilamiz!
            </h2>
            <p className={styles.closingNames}>
              {invitation.groom_name} va {invitation.bride_name}
            </p>
          </RevealCard>
        </section>

        <footer className={styles.credit}>
          {invitation.groom_name} va {invitation.bride_name} oilalari
        </footer>
      </main>

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
