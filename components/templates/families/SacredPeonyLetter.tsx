"use client";

import { useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { RevealCard } from "../RevealCard";
import { useScrollLock } from "../useScrollLock";
import { PhotoGallery } from "../PhotoGallery";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import styles from "./SacredPeonyLetter.module.css";

const ASSETS = "/imported-assets/sacred-peony";

const PETALS = [
  { file: "petal-3061", cls: "petalA" },
  { file: "petal-3164", cls: "petalB" },
  { file: "petal-3865", cls: "petalC" },
  { file: "petal-3162", cls: "petalD" },
  { file: "petal-3138", cls: "petalE" },
  { file: "petal-3034", cls: "petalF" },
] as const;

export function SacredPeonyLetter({
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

  function handleOpen() {
    setOpen(true);
    musicRef.current?.play();
    setTimeout(() => setGone(true), 1100);
  }

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const [year, month, day] = invitation.wedding_date.split("-");
  const dateLabel = `${day}.${month}.${year.slice(2)}`;
  const schedule = invitation.schedule_items;

  const monogram = (
    <span className={`${styles.mono} ${styles.script}`}>
      <span>{invitation.groom_name.charAt(0)}</span>
      <span className={styles.monoAmp}>&amp;</span>
      <span>{invitation.bride_name.charAt(0)}</span>
    </span>
  );

  const messageLines = (
    invitation.custom_message ||
    "Sizni nikoh to'yimiz munosabati bilan bo'lib o'tadigan \"Visol oqshomi\"ga taklif etamiz."
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
          <div className={styles.coverArt}>
            <div className={styles.coverSeal}>{monogram}</div>
            <p className={styles.coverCta}>
              <span className={styles.chev}>﹀</span>
              <span className={styles.coverLabel}>Ochish uchun bosing</span>
            </p>
          </div>
        </div>
      )}

      <main className={`${styles.main} ${open ? styles.mainRevealed : ""}`}>
        <section className={styles.hero}>
          <div className={styles.heroMonogram} aria-hidden>
            {monogram}
          </div>
          <p className={`${styles.kicker} ${styles.script}`}>Nikoh kuni</p>
          <p className={styles.heroDate}>
            <span>{dateLabel}</span>
            {invitation.wedding_time && (
              <span className={styles.heroTime}>{invitation.wedding_time}</span>
            )}
          </p>
          <h1 className={styles.heroNames}>
            <span className={`${styles.heroName} ${styles.script}`}>{invitation.groom_name}</span>
            <span className={`${styles.heroAmp} ${styles.script}`}>&amp;</span>
            <span className={`${styles.heroName} ${styles.script}`}>{invitation.bride_name}</span>
          </h1>
          {!previewMode && (
            <span className={styles.scroll}>
              <span className={`${styles.scrollText} ${styles.script}`}>Pastga suring</span>
              <span className={styles.chev}>﹀</span>
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

        <section className={`${styles.band} ${styles.bandPaper}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/corner-tl.webp`} alt="" className={`${styles.vine} ${styles.vineTl}`} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/corner-tr.webp`} alt="" className={`${styles.vine} ${styles.vineTr}`} />
          <RevealCard className={styles.inner} alwaysVisible={previewMode}>
            <p className={styles.basmala} dir="rtl">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <div className={styles.verse}>
              <span className={styles.script}>Ikki qalb</span>
              <span className={styles.script}>Bitta taqdir</span>
              <span className={styles.script}>Alloh yozgan umr</span>
            </div>
            {messageLines.map((line, i) => (
              <p key={i} className={styles.body}>
                {line}
              </p>
            ))}
          </RevealCard>
        </section>

        <section className={`${styles.band} ${styles.bandCream}`}>
          <RevealCard className={styles.inner} alwaysVisible={previewMode}>
            <h2 className={`${styles.sectionTitle} ${styles.script}`}>
              {invitation.guest_name ? `Hurmatli ${invitation.guest_name}` : "Bayramgacha qoldi"}
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
          <section className={`${styles.band} ${styles.bandPaper}`}>
            <RevealCard className={styles.inner} alwaysVisible={previewMode}>
              <div className={styles.schedHead}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSETS}/flourish-left.webp`} alt="" className={styles.flourish} />
                <h2 className={`${styles.sectionTitle} ${styles.script}`}>Kun tartibi</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSETS}/flourish-right.webp`} alt="" className={styles.flourish} />
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

        <section className={`${styles.band} ${styles.bandCream}`}>
          {PETALS.map((p) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={p.file}
              src={`${ASSETS}/${p.file}.webp`}
              alt=""
              className={`${styles.petal} ${styles[p.cls]}`}
            />
          ))}
          <RevealCard className={styles.inner} alwaysVisible={previewMode}>
            <h2 className={`${styles.sectionTitle} ${styles.script}`}>Manzil</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/divider.webp`} alt="" className={styles.divider} />
            <p className={styles.venue}>{invitation.venue_name}</p>
            <p className={styles.address}>{invitation.venue_address}</p>
            {invitation.venue_map_url && (
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
            )}
          </RevealCard>
        </section>

        {invitation.gallery_photo_urls.length > 0 && (
          <section className={`${styles.band} ${styles.bandSoft}`}>
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
          <section className={`${styles.band} ${styles.bandPaper}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/corner-bl.webp`} alt="" className={`${styles.vine} ${styles.vineBl}`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/corner-br.webp`} alt="" className={`${styles.vine} ${styles.vineBr}`} />
            <RevealCard className={styles.inner} alwaysVisible={previewMode}>
              <h2 className={`${styles.sectionTitle} ${styles.script}`}>To&apos;yona</h2>
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

        <section className={`${styles.band} ${styles.bandCream}`}>
          <RevealCard className={styles.inner} alwaysVisible={previewMode}>
            <div className={`${styles.mono} ${styles.script} ${styles.closingMono}`}>
              {invitation.groom_name.charAt(0)}
              <span className={styles.monoAmp}>&amp;</span>
              {invitation.bride_name.charAt(0)}
            </div>
            <h2 className={`${styles.sectionTitle} ${styles.script}`}>
              Sizni ko&apos;rishdan baxtiyor bo&apos;lamiz!
            </h2>
            <p className={styles.body}>
              {invitation.groom_name} va {invitation.bride_name}
            </p>
          </RevealCard>
        </section>

        <footer className={styles.footer}>
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
