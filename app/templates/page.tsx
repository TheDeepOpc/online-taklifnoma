import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, ArrowLeft, ArrowUpRight, Diamond } from "lucide-react";
import { PREMIUM_THEMES } from "@/templates/premium/presets";
import { THEME_PRESETS } from "@/lib/themes";
import { INVITATION_ART } from "@/lib/invitationArt";
import { TemplateShot } from "@/components/home/TemplateShot";
import { PRICE_TIER_LABELS } from "@/lib/types";
import styles from "@/templates/premium/Collection.module.css";

export const metadata: Metadata = {
  title: "23 ta alohida premium taklifnoma | Oila-Uchun",
  description: "Mavzuga mos rasmlar, musiqali ochilish va qatlamli parallax. Signature va Atelier to‘y taklifnomalari kolleksiyasi.",
};

const titles = ["Rose Noire", "Amber", "Riviera", "Éternité", "Céleste"];
const subjects = ["Bardoviy atirgul", "Kuz", "Yoz", "Tilla va Hayot", "Moviy osmon"];

export default function PremiumCollectionPage() {
  return <main className={styles.page}>
    <nav className={styles.nav} aria-label="Asosiy navigatsiya">
      <Link href="/" className={styles.brand}>Oila<span>—</span>Uchun<small>THE ART OF INVITING</small></Link>
      <span className={styles.navNote}>SIGNATURE COLLECTION · VOL. I</span>
      <Link href="/" className={styles.back}><ArrowLeft size={14} /><span>Bosh sahifa</span></Link>
    </nav>

    <header className={styles.intro}>
      <div className={styles.eyebrow}><i /><Diamond size={12} strokeWidth={1} /> FAQAT ENG GO‘ZAL LAHZALAR UCHUN <i /></div>
      <h1>Muhabbatning<br /><em>betakror</em> jilosi</h1>
      <div className={styles.introBottom}><span>23 PREMIUM DESIGNS / 23 STORIES</span><p>Har bir muhabbat — alohida bir olam.<br className={styles.desktopBreak} /> O‘z hikoyangizga munosib taklifnomani tanlang.</p><a href="#collection" aria-label="Kolleksiyani ko‘rish"><ArrowDown size={18} strokeWidth={1} /></a></div>
      <nav className={styles.collectionNav} aria-label="Kolleksiyalar"><a href="#collection">Signature <span>05</span></a><a href="#atelier">Atelier <span>18</span></a></nav>
    </header>

    <section id="collection" className={styles.collection} aria-label="Beshta premium taklifnoma">
      {PREMIUM_THEMES.map((theme, index) => <article key={theme.id} className={`${styles.card} ${styles[`card${index}`]}`}>
        <Link href={`/templates/${theme.id}`} className={styles.cardLink} aria-label={`${subjects[index]} — ${titles[index]} taklifnomasini ochish`}>
          <div className={styles.cardImage}>
            <TemplateShot themeId={theme.id} alt={`${subjects[index]} — ${titles[index]}`} eager={index < 2} />
            <span className={styles.openCircle}><ArrowUpRight size={21} strokeWidth={1} /></span>
          </div>
          <div className={styles.cardCaption}><span>{subjects[index]}</span><span>Taklifnomani ko‘rish <ArrowUpRight size={13} /></span></div>
          <p className={styles.cardMeta}>PREMIUM · {theme.description}</p>
        </Link>
      </article>)}
    </section>

    <div className={styles.sectionTitle} id="atelier"><span>THE ATELIER COLLECTION</span><h2>Har biri — <em>alohida hikoya</em></h2><p>Ranglar, fasllar va orzulardan ilhomlangan o‘n sakkiz dizayn.</p></div>
    <section className={styles.collection} aria-label="Atelier taklifnomalari">
      {THEME_PRESETS.filter(theme => theme.collection !== "signature").map(theme => {
        const art = INVITATION_ART[theme.id];
        return <article key={theme.id} className={`${styles.card} ${styles.atelierCard}`}>
          <Link href={`/templates/${theme.id}`} className={styles.cardLink} aria-label={`${theme.name} taklifnomasini ochish`}>
            <div className={styles.cardImage}>
              <TemplateShot themeId={theme.id} alt={theme.name} />
              <span className={styles.openCircle}><ArrowUpRight size={21} strokeWidth={1} /></span>
            </div>
            <div className={styles.cardCaption}><span>{theme.name}</span><span>Ko‘rish <ArrowUpRight size={13} /></span></div>
            <p className={styles.cardMeta}>PREMIUM · {PRICE_TIER_LABELS[theme.minPriceTier]}<br />{art.subtitle}</p>
          </Link>
        </article>;
      })}
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
