"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, Music2 } from "lucide-react";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import { uzMonthName } from "@/lib/uzDate";
import type { Invitation } from "@/lib/types";
import { type GateScene } from "@/lib/templateDesigns";
import { MechanicalOpeningScene } from "./MechanicalOpeningScene";
import styles from "./LuxuryInvitationGate.module.css";

const SCENES: Record<GateScene, { title: string; ink: string; accent: string }> = {
  mirror: { title: "Opéra Rubis", ink: "#fbefdc", accent: "#d2ad74" },
  suzani: { title: "Samarqand saroyi", ink: "#fae8c5", accent: "#d9b47a" },
  sky: { title: "Cristal Céleste", ink: "#f5f4ff", accent: "#c9d6f1" },
  royal: { title: "Lettre Royale", ink: "#534031", accent: "#997342" },
  garden: { title: "Jardin de Verre", ink: "#294132", accent: "#8c8460" },
  autumn: { title: "L’Album Héritage", ink: "#fae6bf", accent: "#d9b47b" },
  eternity: { title: "Trésor Éternel", ink: "#f5e9cf", accent: "#dbbd80" },
};

interface Props { scene: GateScene; invitation: Invitation; hasMusic: boolean; onActivate: () => void; onOpened: () => void }

export function LuxuryInvitationGate({ scene, invitation, hasMusic, onActivate, onOpened }: Props) {
  const config = SCENES[scene];
  const reduce = useMotionPreference();
  const [opening, setOpening] = useState(false);
  const activeRef = useRef(false);
  const finishedRef = useRef(false);
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [year, month, day] = invitation.wedding_date.split("-");
  const monthLabel = uzMonthName(new Date(Number(year), Number(month) - 1, Number(day)));
  const monogram = `${invitation.groom_name[0]}${invitation.bride_name[0]}`;
  const namesId = `luxury-gate-${invitation.template_id}`;


  useEffect(() => () => { if (fallbackRef.current) clearTimeout(fallbackRef.current); }, []);

  function finish() {
    if (!activeRef.current || finishedRef.current) return;
    finishedRef.current = true;
    if (fallbackRef.current) clearTimeout(fallbackRef.current);
    onOpened();
  }
  function begin() {
    if (activeRef.current) return;
    activeRef.current = true;
    onActivate();
    if (reduce) { finish(); return; }
    setOpening(true);
    // Keeps the invitation reachable if a browser cancels a decorative transition.
    fallbackRef.current = setTimeout(finish, 4300);
  }
  const guest = invitation.guest_name ? <p className={styles.guest}>Hurmatli <strong>{invitation.guest_name}</strong></p> : null;
  const names = (className = "") => <h2 id={namesId} className={`${styles.names} ${className}`}><span>{invitation.groom_name}</span><em>&</em><span>{invitation.bride_name}</span></h2>;
  const date = <p className={styles.date}><span>{day}</span> {monthLabel} <span>{year}</span></p>;
  const button = (className = "", label = "Taklifnomani ochish") => <button type="button" className={`${styles.openButton} ${className}`} onClick={begin} disabled={opening} aria-busy={opening} data-invitation-open><span className={styles.buttonEmblem} aria-hidden="true">{monogram}<ArrowUpRight size={16} /></span><span className={styles.buttonLabel}>{label}</span></button>;
  let content: ReactNode;
  switch (scene) {
    case "mirror": content = <><div className={styles.operaTitle}><span>THE WEDDING PREMIÈRE</span><i />{names()}<p>Bir oqshom. Bir umr.</p></div><div className={styles.operaFoot}>{guest}{date}{button(styles.operaButton, "Pardani ochish")}</div></>; break;
    case "suzani": content = <><div className={styles.palaceCrest}><span>{monogram}</span><i /><small>IKKI QALB · BIR TAQDIR</small></div><div className={styles.palaceNames}>{names()}<span className={styles.engravedRule}>✧</span>{guest}</div><div className={styles.palaceFoot}>{date}{button(styles.palaceButton, "Saroy eshiklarini ochish")}</div></>; break;
    case "sky": content = <><div className={styles.skyHeading}><span>YULDUZLAR GUVOHLIGIDA</span>{names()}</div><div className={styles.skyOrbit}><span>{day}</span><i /><small>{monthLabel} / {year}</small></div><div className={styles.skyFoot}>{guest}{button(styles.skyButton, "Bizning osmonimizga kiring")}</div></>; break;
    case "royal": content = <><div className={styles.letterHeading}><span>QALBIMIZDAN YO‘LLANGAN MAKTUB</span><p>avec amour</p></div><div className={styles.letterNames}>{names()}<i />{date}{guest}</div><div className={styles.letterSeal}>{button(styles.letterButton, "Maktubni ochish")}</div></>; break;
    case "garden": content = <><div className={styles.gardenHeading}><span>A GARDEN OF OUR OWN</span><p>Muhabbat<br /><em>gullagan kun.</em></p></div><div className={styles.gardenNames}>{names()}<div className={styles.gardenLine} />{date}{guest}{button(styles.gardenButton, "Bog‘imizga xush kelibsiz")}</div></>; break;
    case "autumn": content = <><span className={styles.bookSpine}>OUR HEIRLOOM OF LOVE</span><div className={styles.bookInscription}><span className={styles.bookChapter}>BIRINCHI BOB</span>{names()}<i />{date}{guest}</div><div className={styles.bookFoot}>{button(styles.bookButton, "Hikoyamizni ochish")}</div></>; break;
    case "eternity": content = <><div className={styles.treasuryHeading}><span>THE ART OF FOREVER</span><p>Muhabbat — eng aziz xazina.</p></div><div className={styles.treasuryNames}><span className={styles.treasuryMonogram}>{monogram}</span>{names()}<div className={styles.treasuryDate}><span>{day}<small>KUN</small></span><i /><span>{monthLabel}<small>{year}</small></span></div>{guest}</div><div className={styles.treasuryFoot}>{button(styles.treasuryButton, "Xazinamizni ochish")}</div></>; break;
  }
  return <div className={`${styles.gate} ${styles[scene]} ${invitation.guest_name ? styles.withGuest : ""}`} style={{ "--gate-ink": config.ink, "--gate-accent": config.accent } as CSSProperties} role="dialog" aria-modal="true" aria-labelledby={namesId} data-luxury-gate={scene} data-gate-phase={opening ? "opening" : "closed"}>
    <MechanicalOpeningScene scene={scene} opening={opening} onComplete={finish} />
    <div className={styles.composition} style={{ opacity: opening ? 0 : 1, transition: "opacity .3s ease" }}>{content}</div>
    <div className={styles.bottomLine}><span>{config.title}</span>{hasMusic ? <span><Music2 size={10} />MUSIQA BILAN OCHILADI</span> : <ArrowDown size={12} />}</div>
  </div>;
}
