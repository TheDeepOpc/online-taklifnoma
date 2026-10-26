"use client";
/* eslint-disable @next/next/no-img-element -- decorative art assets use native image elements. */

import type { ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { ParallaxScene } from "@/components/templates/ParallaxScene";
import { OrnamentalFrame } from "./OrnamentalFrame";
import type { Invitation } from "@/lib/types";
import type { TemplateDesign } from "@/lib/templateDesigns";
import { uzMonthName } from "@/lib/uzDate";
import styles from "./HeroCompositions.module.css";

export interface HeroProps {
  invitation: Invitation; design: TemplateDesign; src: string; title: string; subtitle: string; previewMode: boolean; opened: boolean;
}

function Photo({ p, slot = "a", children }: { p: HeroProps; slot?: string; children?: ReactNode }) {
  return <div className={`${styles.photo} ${styles[slot]}`} data-photo-slot={slot}>
    <ParallaxScene src={p.src} className={styles.scene} imageClassName={styles.picture} enabled={!p.previewMode} priority={slot === "a"} />
    {children}
  </div>;
}
function Names({ p }: { p: HeroProps }) {
  return <h1 className={styles.names}><span>{p.invitation.groom_name}</span><em>&</em><span>{p.invitation.bride_name}</span></h1>;
}
function DateStamp({ p }: { p: HeroProps }) {
  const [year, month, day] = p.invitation.wedding_date.split("-");
  return <div className={styles.date}><strong>{day}</strong><span>{uzMonthName(new Date(Number(year), Number(month) - 1, Number(day)))}<small>{year}</small></span></div>;
}
function Note({ p }: { p: HeroProps }) { return <p className={styles.note}>{p.subtitle}</p>; }
function Monogram({ p }: { p: HeroProps }) { return <span className={styles.monogram}>{p.invitation.groom_name[0]}{p.invitation.bride_name[0]}</span>; }
function Eyebrow({ children = "BIR KUN · BIR UMR" }: { children?: ReactNode }) { return <span className={styles.eyebrow}>{children}</span>; }

const compositions: Record<string, (p: HeroProps) => ReactNode> = {
  cascade: p => <><Photo p={p} /><div className={styles.ribbon}><Eyebrow>OUR FOREVER BEGINS</Eyebrow></div><div className={styles.content}><Names p={p} /><DateStamp p={p} /><Note p={p} /></div><Monogram p={p} /></>,
  herbarium: p => <><div className={styles.journalHead}><Eyebrow>THE OLIVE JOURNAL</Eyebrow><Names p={p} /></div><Photo p={p} /><div className={styles.journalFoot}><DateStamp p={p} /><Note p={p} /></div><div className={styles.marginNote}>Muhabbat kundaligi / I</div></>,
  diptych: p => <><div className={styles.doublePanel}><Photo p={p} /><Photo p={p} slot="b" /></div><div className={styles.content}><Eyebrow>TWO SOULS / ONE REFLECTION</Eyebrow><Names p={p} /><DateStamp p={p} /></div><Note p={p} /></>,
  triptych: p => <><div className={styles.topNames}><Eyebrow>A ROYAL CELEBRATION</Eyebrow><Names p={p} /></div><div className={styles.threePanel}><Photo p={p} slot="b" /><Photo p={p} /><Photo p={p} slot="c" /></div><div className={styles.bottomDate}><DateStamp p={p} /><Note p={p} /></div></>,
  postcard: p => <><div className={styles.postcardHead}><span>AZURE / LOVE POST</span><DateStamp p={p} /></div><Photo p={p}><span className={styles.postmark}>WITH LOVE</span></Photo><div className={styles.content}><Names p={p} /><Note p={p} /></div><div className={styles.postcardLines}><i /><i /><i /></div></>,
  couture: p => <><Photo p={p} /><Photo p={p} slot="b" /><span className={styles.coutureWord}>amour</span><div className={styles.content}><Eyebrow>THE COUTURE EDITION</Eyebrow><Names p={p} /><DateStamp p={p} /></div><Note p={p} /></>,
  heritage: p => <><div className={styles.suzaniBand} /><Photo p={p} /><div className={styles.heritagePaper}><Eyebrow>O‘ZBEKONA TO‘Y TAKLIFNOMASI</Eyebrow><Names p={p} /><DateStamp p={p} /><Note p={p} /></div><HeritageInstruments /><div className={styles.heritageAnor}><img src="/imported-assets/milliy-ornament/pomegranate.webp" alt="Anor bezagi" /></div></>,
  ledger: p => <><div className={styles.ledgerTitle}><Eyebrow>THE GARDEN ATELIER</Eyebrow><span>Jardin</span></div><div className={styles.ledgerGrid}><Photo p={p} /><Photo p={p} slot="b" /><div className={styles.ledgerText}><Names p={p} /><DateStamp p={p} /></div><Photo p={p} slot="c" /></div><Note p={p} /></>,
  "floral-jewel": p => <><Photo p={p} /><div className={styles.jewelCircle}><Monogram p={p} /></div><div className={styles.floralText}><Eyebrow>UNE FLEUR · UN AMOUR</Eyebrow><Names p={p} /><div className={styles.line} /><DateStamp p={p} /><Note p={p} /></div></>,
  "silk-letter": p => <><Photo p={p} /><div className={styles.foldedLetter}><Eyebrow>A LETTER FROM OUR HEARTS</Eyebrow><Monogram p={p} /><Names p={p} /><DateStamp p={p} /><Note p={p} /></div><span className={styles.waxSeal}>avec amour</span></>,
  orbit: p => <><Photo p={p} /><div className={styles.orbitRing} /><div className={styles.orbitRingSmall} /><div className={styles.orbitDate}><DateStamp p={p} /></div><div className={styles.content}><Eyebrow>UNDER THE SAME STARS</Eyebrow><Names p={p} /><Note p={p} /></div><Monogram p={p} /></>,
  horizon: p => <><div className={styles.horizonTitle}><Eyebrow>LOVE AT FIRST LIGHT</Eyebrow><Names p={p} /></div><div className={styles.horizonBands}><Photo p={p} /><Photo p={p} slot="b" /><Photo p={p} slot="c" /></div><div className={styles.bottomDate}><DateStamp p={p} /><Note p={p} /></div></>,
  rosette: p => <><span className={styles.largeNumber}>L’amour</span><div className={styles.rosettePhotos}><Photo p={p} /><Photo p={p} slot="b" /><Photo p={p} slot="c" /></div><div className={styles.content}><Eyebrow>LOVE IN FULL BLOOM</Eyebrow><Names p={p} /><DateStamp p={p} /><Note p={p} /></div></>,
  "light-curtain": p => <><div className={styles.lightRails}><Photo p={p} /><Photo p={p} slot="b" /></div><div className={styles.verticalTitle}>LUMIÈRE</div><div className={styles.content}><Eyebrow>WHEN TWO LIGHTS BECOME ONE</Eyebrow><Names p={p} /><DateStamp p={p} /><Note p={p} /></div></>,
  staircase: p => <><div className={styles.stairPhotos}><Photo p={p} slot="b" /><Photo p={p} /><Photo p={p} slot="c" /></div><Monogram p={p} /><div className={styles.content}><Eyebrow>THE IMPERIAL PROMISE</Eyebrow><Names p={p} /><DateStamp p={p} /><Note p={p} /></div></>,
  "fashion-cover": p => <><div className={styles.magazineMasthead}>ÉDITORIAL</div><span className={styles.issue}>THE WEDDING ISSUE / 01</span><Photo p={p} /><div className={styles.fashionNames}><Names p={p} /></div><div className={styles.fashionDate}><DateStamp p={p} /></div><div className={styles.fashionCaption}><Eyebrow>OUR NEXT CHAPTER</Eyebrow><Note p={p} /></div></>,
  heraldry: p => <><div className={styles.heraldicGrid}><Photo p={p} slot="b" /><Photo p={p} /><Photo p={p} slot="c" /></div><div className={styles.heraldicCrest}><Monogram p={p} /></div><div className={styles.content}><Eyebrow>AN HEIRLOOM OF LOVE</Eyebrow><Names p={p} /><DateStamp p={p} /><Note p={p} /></div></>,
  theatre: p => <><Photo p={p} /><div className={styles.stageCurtainLeft} /><div className={styles.stageCurtainRight} /><div className={styles.theatreBill}><Eyebrow>ONE NIGHT · A LIFETIME</Eyebrow><span className={styles.theatreRule} /><Names p={p} /><DateStamp p={p} /><Note p={p} /></div><Monogram p={p} /></>,
  "crystal-grid": p => <><div className={styles.crystalMosaic}><Photo p={p} /><Photo p={p} slot="b" /><Photo p={p} slot="c" /><div className={styles.crystalDate}><DateStamp p={p} /></div></div><div className={styles.crystalNames}><Eyebrow>OUR WINTER FAIRYTALE</Eyebrow><Names p={p} /><Note p={p} /></div><Monogram p={p} /></>,
  scrapbook: p => <><div className={styles.scrapbookLabel}>a season of love</div><Photo p={p}><span>our golden days</span></Photo><Photo p={p} slot="b" /><div className={styles.scrapbookDate}><DateStamp p={p} /></div><div className={styles.content}><Names p={p} /><Note p={p} /></div></>,
  "riviera-magazine": p => <><div className={styles.rivieraHead}><span>RIVIERA</span><Eyebrow>THE SUMMER OF US</Eyebrow></div><Photo p={p} /><div className={styles.rivieraGrid}><div><DateStamp p={p} /><Monogram p={p} /></div><div><Names p={p} /><Note p={p} /></div></div><Photo p={p} slot="b" /></>,
  "gold-exhibition": p => <><div className={styles.exhibitionHeader}><Eyebrow>THE ART OF FOREVER</Eyebrow><span>ÉTERNITÉ</span></div><div className={styles.museumMat}><Photo p={p} /><Monogram p={p} /></div><div className={styles.exhibitionCaption}><Names p={p} /><div><DateStamp p={p} /><Note p={p} /></div></div></>,
  "sky-panorama": p => <><div className={styles.skyTitle}><Eyebrow>WRITTEN IN THE STARS</Eyebrow><Names p={p} /></div><div className={styles.skyCards}><Photo p={p} slot="b" /><Photo p={p} /><Photo p={p} slot="c" /></div><div className={styles.skyDate}><DateStamp p={p} /><Note p={p} /></div><span className={styles.skyWord}>céleste</span></>,
};

export function HeritageInstruments() {
  return <div className={styles.instruments} data-heritage-instruments>
    <img src="/imported-assets/milliy-ornament/horn.webp" alt="Milliy karnay" className={styles.karnayLeft} />
    <img src="/imported-assets/milliy-ornament/horn.webp" alt="Milliy karnay" className={styles.karnayRight} />
    <img src="/invitation-art/effects/surnay.webp" alt="Milliy surnay" className={styles.surnay} />
  </div>;
}

export function HeroComposition(p: HeroProps) {
  const render = compositions[p.design.hero];
  return <header className={`${styles.hero} ${styles[p.design.hero]} ${p.previewMode ? styles.preview : ""} ${p.opened ? styles.opened : ""}`} data-hero-composition={p.design.hero} data-hero-animation={p.design.motion}>
    <div className={styles.edition}><span>{p.title}</span><span>PREMIUM WEDDING INVITATION</span></div>
    {render(p)}
    <OrnamentalFrame kind={p.design.ornament} design={p.design.hero} />
    <a href="#premium-letter" className={styles.scroll} tabIndex={p.previewMode ? -1 : 0}><span>Hikoyamizni oching</span><ArrowDown size={14} /></a>
  </header>;
}
