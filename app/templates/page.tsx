import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, ArrowLeft, ArrowUpRight, Diamond } from "lucide-react";
import { PREMIUM_THEMES } from "@/templates/premium/presets";
import styles from "@/templates/premium/Collection.module.css";

export const metadata: Metadata = {
  title: "Signature — 5 ta hashamatli taklifnoma | Oila-Uchun",
  description: "Qish, Kuz, Yoz, Tilla va Hayot, Moviy osmon. Muhabbatingiz uchun beshta alohida olam.",
};

const titles = ["Cristal", "Amber", "Riviera", "Éternité", "Céleste"];
const subjects = ["Qish", "Kuz", "Yoz", "Tilla va Hayot", "Moviy osmon"];
const images = ["qish", "kuz", "yoz", "tilla-hayot", "moviy-osmon"];

export default function PremiumCollectionPage() {
  return <main className={styles.page}>
    <nav className={styles.nav} aria-label="Asosiy navigatsiya">
      <Link href="/" className={styles.brand}>Oila<span>—</span>Uchun<small>THE ART OF INVITING</small></Link>
      <span className={styles.navNote}>SIGNATURE COLLECTION · VOL. I</span>
      <Link href="/" className={styles.back}><ArrowLeft size={14} /><span>Bosh sahifa</span></Link>
    </nav>

    <header className={styles.intro}>
      <div className={styles.eyebrow}><i /><Diamond size={12} strokeWidth={1} /> FAQAT ENG GO‘ZAL LAHZALAR UCHUN <i /></div>
      <h1>Muhabbatning<br /><em>besh xil</em> jilosi<span>™</span></h1>
      <div className={styles.introBottom}><span>01 — 05 / EXCLUSIVE EDITIONS</span><p>Besh olam. Besh kayfiyat. Hayotingizdagi eng muhim<br className={styles.desktopBreak} /> kun uchun yaratilgan betakror taklifnomalar.</p><a href="#collection" aria-label="Kolleksiyani ko‘rish"><ArrowDown size={18} strokeWidth={1} /></a></div>
    </header>

    <section id="collection" className={styles.collection} aria-label="Beshta premium taklifnoma">
      {PREMIUM_THEMES.map((theme, index) => <article key={theme.id} className={`${styles.card} ${styles[`card${index}`]}`}>
        <Link href={`/templates/${theme.id}`} className={styles.cardLink} aria-label={`${subjects[index]} — ${titles[index]} taklifnomasini ochish`}>
          <div className={styles.cardImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/premium-assets/${images[index]}.webp`} alt={theme.description} width={1024} height={1536} loading={index < 2 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} />
            <div className={styles.imageShade} />
            <div className={styles.cardTop}><span>№ {String(index + 1).padStart(2, "0")}</span><span>PREMIUM EDITION</span></div>
            <div className={styles.cardTitle}><span>{subjects[index]}</span><h2>{titles[index]}</h2><i /><p>{theme.description}</p></div>
            <span className={styles.openCircle}><ArrowUpRight size={21} strokeWidth={1} /></span>
          </div>
          <div className={styles.cardCaption}><span>{subjects[index]}</span><span>Taklifnomani ko‘rish <ArrowUpRight size={13} /></span></div>
        </Link>
      </article>)}
    </section>

    <section className={styles.note}>
      <Diamond size={18} strokeWidth={1} />
      <p>Bir marta ochiladi.<br /><em>Bir umr esda qoladi.</em></p>
      <span>Nafis animatsiyalar · Shaxsiy murojaat · Siz tanlagan musiqa</span>
      <Link href="/#contact">O‘z taklifnomangizni buyurtma qiling <ArrowUpRight size={15} /></Link>
    </section>
    <footer className={styles.footer}><Link href="/">Oila-Uchun</Link><span>MUHABBAT BILAN YARATILDI</span><span>SIGNATURE · 2026</span></footer>
  </main>;
}
