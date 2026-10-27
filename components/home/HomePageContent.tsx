"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Gift, Globe, Heart, Images, MapPin, MessageCircle, Music, Phone, Play, Send, ShieldCheck, Sparkles, Timer, Users, X } from "lucide-react";
import { TemplateShot, PhoneShot } from "./TemplateShot";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CopyrightNotice } from "@/components/CopyrightNotice";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import { useDeviceCapability } from "@/components/motion/useDeviceCapability";
import { THEME_PRESETS, getTheme, getUnlockedThemes } from "@/lib/themes";
import type { SiteContent, FeatureIconKey } from "@/lib/siteContent";
import { PRICE_TIER_LABELS, type PriceTier } from "@/lib/types";
import { HOME_FAQ } from "@/lib/seo";
import styles from "./HomePageContent.module.css";

const ICONS = { music: Music, timer: Timer, images: Images, map: MapPin, heart: Heart, globe: Globe, users: Users, gift: Gift, phone: Phone, sparkles: Sparkles } satisfies Record<FeatureIconKey, typeof Music>;
const PICKS = ["premium-bardoviy-atirgul", "milliy-anor", "premium-moviy-osmon", "premium-kuz", "royal-champagne", "garden-bloom"];
const FILTERS = [
  { id: "atelier", label: "Yangi · Atelier 7", ids: THEME_PRESETS.filter(theme => theme.family === "atelier").map(theme => theme.id) },
  { id: "selected", label: "Tanlanganlar", ids: PICKS },
  { id: "all", label: `Barchasi · ${THEME_PRESETS.length}`, ids: THEME_PRESETS.map(theme => theme.id) },
  { id: "national", label: "Milliy", ids: ["milliy-anor", "regal-navy-gold", "royal-champagne"] },
  { id: "romantic", label: "Romantik", ids: ["premium-bardoviy-atirgul", "cocoa-blush", "bloom-pulse-rose", "sacred-peony-gold", "ivory-swan-arch", "swan-noir-classic"] },
  { id: "sky", label: "Osmon va tabiat", ids: ["premium-moviy-osmon", "aurora-dream-night", "navy-gazebo-blue", "green-gold", "garden-bloom", "premium-yoz"] },
];
const EDITORIAL = [
  { id: "rose-ceremony", label: "Romantika", title: "Bir umrga aytilgan «ha».", alt: "Atirgullar va ipak tasmalar bilan bezatilgan bog‘dagi to‘y arkasi", href: "/templates/premium-bardoviy-atirgul" },
  { id: "uzbek-garden", label: "Milliy nafislik", title: "Ildizlarimizdek go‘zal.", alt: "O‘ymakor ustunli milliy bog‘da gullar va anorlar bilan bezatilgan to‘y dasturxoni", href: "/templates/milliy-anor" },
  { id: "love-letter", label: "Sizning hikoyangiz", title: "Yurakdan yozilgan taklif.", alt: "Bordo ipak konvert, nafis qog‘oz, oq atirgul va oltin nikoh uzuklari", href: "/templates/royal-champagne" },
];

function EditorialPhoto({ item, index }: { item: typeof EDITORIAL[number]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useMotionPreference();
  const lite = useDeviceCapability() === "low";
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 28 });
  const y = useTransform(progress, [0, 1], [-25, 25]);
  return <figure ref={ref} className={styles.editorialPhoto}>
    <Link href={item.href} aria-label={`${item.label} uslubidagi taklifnomani ko‘rish`}>
      <div className={styles.editorialImage}>
        <motion.div style={reduce || lite ? undefined : { y }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/home-art/${item.id}.webp`} srcSet={`/home-art/responsive/${item.id}.webp 600w, /home-art/${item.id}.webp 1000w`} sizes="(max-width: 760px) 45vw, 32vw" alt={item.alt} width={1000} height={1333} loading="lazy" decoding="async" />
        </motion.div>
        <span className={styles.editorialIndex}>0{index + 1}</span><span className={styles.editorialArrow}><ArrowUpRight size={20} strokeWidth={1.2} /></span>
      </div>
      </Link>
    <figcaption><span>{item.label}</span><h3><Link href={item.href}>{item.title}</Link></h3></figcaption>
  </figure>;
}

export function HomePageContent({ content }: { content: SiteContent }) {
  const { hero, designs, how, features, gift, pricing, contact, footer, modal } = content;
  const [filter, setFilter] = useState("selected");
  const [modalOpen, setModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const launchRef = useRef<HTMLElement | null>(null);
  const reduce = useMotionPreference();
  const lite = useDeviceCapability() === "low";
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 28 });
  const imageY = useTransform(smooth, [0, 1], [0, 65]);
  const phoneY = useTransform(smooth, [0, 1], [0, -45]);
  const selectedIds = FILTERS.find(item => item.id === filter)?.ids ?? PICKS;

  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.body.style.overflow;
    launchRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
      if (event.key !== "Tab") return;
      const dialog = document.querySelector('[data-home-dialog]');
      const elements = [...(dialog?.querySelectorAll<HTMLElement>('button,a[href]') ?? [])];
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); launchRef.current?.focus(); };
  }, [modalOpen]);

  const reveal = { initial: reduce ? false as const : { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .12 }, transition: { duration: .65 } };

  return <div className={styles.page}>
    <SiteHeader overlay ctaLabel="Dizayn tanlash" ctaHref="#designs" />

    <section ref={heroRef} className={styles.hero}>
      <div className={styles.heroCopy}>
        <h1 className={styles.eyebrow}><i />Onlayn to‘y taklifnomasi · O‘zbekiston</h1>
        <p className={styles.heroBadge}>{hero.badge}</p>
        <p className={styles.heroTitle}><span>{hero.title1}</span><em>{hero.title2}</em><span>{hero.title3}</span></p>
        <p className={styles.heroDescription}>{hero.description}</p>
        <div className={styles.actions}>
          <Link href={hero.ctaPrimaryHref || "#designs"} className={styles.primary}>{hero.ctaPrimary}<ArrowUpRight size={17} /></Link>
          <button type="button" onClick={() => setModalOpen(true)} className={styles.secondary}>{hero.ctaSecondary}<ArrowRight size={16} /></button>
        </div>
        <div className={styles.assurances}><span><Check size={13} />Ilovasiz ochiladi</span><span><Check size={13} />Har bir mehmonga shaxsiy</span></div>
        <div className={styles.heroBottom}><span className={styles.miniMonogram}>S<span>&</span>S</span><div><strong>Sardor & Soliha</strong><span>Har bir muhabbat — alohida hikoya.</span></div><a href="#designs" aria-label="Dizaynlarni ko‘rish"><ArrowDown size={17} /></a></div>
      </div>
      <div className={styles.heroArt}>
        <motion.div className={styles.heroPhoto} style={reduce || lite ? undefined : { y: imageY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home-art/love-story.webp" srcSet="/home-art/responsive/love-story.webp 640w, /home-art/love-story.webp 1024w" sizes="(max-width: 760px) 85vw, (max-width: 1500px) 42vw, 600px" alt="Gulli bog‘da qo‘l ushlashib yurgan kelin-kuyov" width={1100} height={1650} fetchPriority="high" decoding="async" />
          <div className={styles.photoCaption}><span>THE BEGINNING OF FOREVER</span><p>Bir havola.<br /><em>Bir umrga xotira.</em></p></div>
        </motion.div>
        <motion.div className={styles.heroPhone} style={reduce || lite ? undefined : { y: phoneY }}>
          <Link href="/templates/premium-bardoviy-atirgul" aria-label="Bardoviy atirgul taklifnomasini jonli ochish"><PhoneShot themeId="premium-bardoviy-atirgul" alt="Sardor va Solihaning bardoviy atirgulli taklifnomasi" eager frameClassName={styles.phoneWidth} /></Link>
          <span className={styles.phoneHint}><Play size={9} fill="currentColor" />NAMUNANI OCHISH</span>
        </motion.div>
        <div className={styles.artLabel}><span>{THEME_PRESETS.length}</span><div>ALOHIDA MAKET<br />BITTA UNUTILMAS KUN</div><Sparkles strokeWidth={1} size={24} /></div>
      </div>
    </section>

    <div className={styles.promiseStrip}><span><Music size={16} />O‘z musiqangiz</span><i /><span><Heart size={16} />Shaxsiy murojaat</span><i /><span><MapPin size={16} />Aniq lokatsiya</span><i /><span><Images size={16} />Sevimli suratlaringiz</span></div>

    <section id="designs" className={styles.designs}>
      <motion.div {...reveal} className={styles.sectionIntro}>
        <div><h2 className={styles.eyebrow}>O‘zbekistondagi eng nafis onlayn taklifnomalar</h2><div className={styles.displayHeading}>{designs.title}<br /><em>{designs.accent}</em></div></div>
        <div><p>{designs.subtitle}</p><a href="#designs" onClick={() => setFilter("all")} className={styles.textLink}>Barcha {THEME_PRESETS.length} ta dizayn<ArrowUpRight size={16} /></a></div>
      </motion.div>
      <div className={styles.filterBar} role="group" aria-label="Dizayn uslubi">{FILTERS.map(item => <button type="button" key={item.id} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={filter === item.id ? styles.activeFilter : undefined}>{item.label}</button>)}</div>
      <div className={styles.designGrid}>
        {selectedIds.map((id, index) => {
          const theme = getTheme(id);
          return <motion.article key={id} initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, delay: (index % 3) * .04 }} className={styles.designCard}>
            <Link href={`/templates/${id}`}>
              <div className={styles.designImage}><TemplateShot themeId={id} alt={`${theme.name} — Sardor va Soliha uchun namuna`} /><span className={styles.cardAction}>Jonli ko‘rish<ArrowUpRight size={15} /></span></div>
              <div className={styles.designCaption}><h3>{theme.name}</h3><span>{PRICE_TIER_LABELS[theme.minPriceTier]}</span></div>
            </Link>
          </motion.article>;
        })}
      </div>
      <div className={styles.galleryEnd}><span>Qalbingizga yaqin uslubni toping.</span><a href="#designs" onClick={() => setFilter("all")} className={styles.secondary}>To‘liq kolleksiya<ArrowRight size={16} /></a></div>
    </section>

    <section className={styles.story}>
      <motion.div {...reveal} className={styles.storyImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/home-art/wedding-details.webp" srcSet="/home-art/responsive/wedding-details.webp 700w, /home-art/wedding-details.webp 1400w" sizes="(max-width: 760px) 90vw, 45vw" alt="Kelin-kuyovning uzukli qo‘llari va bardoviy atirgullar" width={1400} height={934} loading="lazy" decoding="async" />
        <span className={styles.storyNote}>Kichik tafsilotlar.<br /><em>Katta hislar.</em></span>
      </motion.div>
      <motion.div {...reveal} className={styles.storyCopy}>
        <h2 className={styles.eyebrow}>Elektron taklifnoma imkoniyatlari</h2><div className={styles.displayHeading}>{features.title}<br /><em>{features.accent}</em></div>
        <div className={styles.featureGrid}>{features.items.map(item => { const Icon = ICONS[item.icon] || Heart; return <div key={item.title}><Icon size={21} strokeWidth={1.3} /><h3>{item.title}</h3><p>{item.body}</p></div>; })}</div>
      </motion.div>
    </section>

    <section className={styles.editorial} aria-labelledby="editorial-title">
      <motion.div {...reveal} className={styles.editorialIntro}><h2 id="editorial-title" className={styles.eyebrow}>Milliy va zamonaviy taklifnoma uslublari</h2><div className={styles.displayHeading}>Bir kun.<br /><em>Ming go‘zal tuyg‘u.</em></div><p>Milliy latofat, sokin romantika yoki hashamatli tantana — taklifnomangiz sizning hikoyangizdan boshlanadi.</p></motion.div>
      <div className={styles.editorialGrid}>{EDITORIAL.map((item, index) => <EditorialPhoto item={item} index={index} key={item.id} />)}</div>
      <p className={styles.editorialEnd}>Eng go‘zal xotiralar <em>bir taklifdan boshlanadi.</em></p>
    </section>

    <section id="how" className={styles.how}>
      <motion.div {...reveal} className={styles.centerIntro}><h2 className={styles.eyebrow}>To‘yga taklifnoma qanday qilinadi?</h2><div className={styles.displayHeading}>{how.title} <em>{how.accent}</em></div><p>{how.subtitle}</p></motion.div>
      <div className={styles.steps}>{how.steps.map(step => <motion.article {...reveal} key={step.n}><span key="number">{step.n}</span><div key="copy"><h3>{step.title}</h3><p>{step.body}</p></div><ArrowRight key="arrow" size={18} strokeWidth={1} /></motion.article>)}</div>
    </section>

    <section id="pricing" className={styles.pricing}>
      <motion.div {...reveal} className={styles.sectionIntro}><div><h2 className={styles.eyebrow}>Onlayn to‘y taklifnomasi narxlari</h2><div className={styles.displayHeading}>{pricing.title}<br /><em>sizga mos tanlov</em></div></div><p>{pricing.subtitle}</p></motion.div>
      <div className={styles.priceGrid}>{(["150000", "200000", "250000"] as PriceTier[]).map((tier, index) => <motion.article {...reveal} key={tier} className={index === 2 ? styles.fullCollection : undefined}>
        <div key="header" className={styles.priceTop}><span>0{index + 1} / {index === 0 ? "ESSENTIAL" : index === 1 ? "ELEGANCE" : "SIGNATURE"}</span>{index === 2 && <span className={styles.priceBadge}>To‘liq kolleksiya</span>}</div>
        <h3 key="price">{PRICE_TIER_LABELS[tier].replace(" so'm", "")}<small>so‘m</small></h3><p key="access">{pricing.accessNote.replace("{count}", String(getUnlockedThemes(tier).length))}</p>
        <ul key="benefits"><li><Check size={14} />Musiqa, sanoq va lokatsiya</li><li><Check size={14} />Shaxsiy mehmon havolalari</li><li><Check size={14} />Suratlar va nafis animatsiyalar</li></ul>
        <button key="order" type="button" onClick={() => setModalOpen(true)}>Buyurtma berish<ArrowUpRight size={17} /></button>
      </motion.article>)}</div>
      <div className={styles.giftIntro}><Gift size={22} strokeWidth={1.3} /><div><h3>{gift.title} {gift.accent}</h3><p>{gift.subtitle}</p></div></div>
      <div className={styles.giftGrid}>{gift.offers.map(offer => <div key={offer.id}><span>{offer.title}</span><strong>{offer.guests ? `${offer.guests} + ${offer.free}` : gift.unlimitedLabel}<small>{offer.guests ? gift.offerCountSuffix : gift.loveLabel}</small></strong><p>{offer.note}</p></div>)}</div>
    </section>

    <section className={styles.faq}>
      <motion.div {...reveal}><h2 className={styles.eyebrow}>Onlayn taklifnoma bo‘yicha savollar</h2><div className={styles.displayHeading}>Ko‘nglingizdagi<br /><em>savollarga javob</em></div><p>Tafsilotlarni birga kelishamiz.<br />Bizga yozishingiz kifoya.</p><a className={styles.textLink} href={contact.telegramHref} target="_blank" rel="noopener noreferrer">Telegramda so‘rash<ArrowUpRight size={15} /></a></motion.div>
      <div>{HOME_FAQ.map(([question, answer], index) => <div key={question} className={styles.faqItem}><h3><button type="button" aria-expanded={openFaq === index} aria-controls={`faq-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}>{question}<ChevronDown size={17} style={openFaq === index ? { transform: "rotate(180deg)" } : undefined} /></button></h3><div id={`faq-${index}`} hidden={openFaq !== index}><p>{answer}</p></div></div>)}</div>
    </section>

    <section id="contact" className={styles.contact}>
      <motion.div {...reveal}><h2 className={styles.eyebrow}>Toshkent va viloyatlar bo‘ylab to‘yga elektron taklifnoma</h2><div className={styles.displayHeading}>{contact.title}<br /><em>{contact.accent}</em></div><p>{contact.subtitle}</p><div className={styles.contactSignature}>Sizning hikoyangizni<br /><span>birga boshlaymiz.</span></div></motion.div>
      <motion.div {...reveal} className={styles.contactCard}><span className={styles.eyebrow}>SIZDAN BIR XABAR — BIZDAN GO‘ZAL TAKLIFNOMA</span><a href={contact.phoneHref} className={styles.bigPhone}>{contact.phone}<ArrowUpRight size={22} /></a><a href={contact.telegramHref} target="_blank" rel="noopener noreferrer" className={styles.telegram}><Send size={18} />{contact.telegramLabel} orqali yozish<ArrowUpRight size={17} /></a><a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.whatsapp}><MessageCircle size={16} />{contact.whatsappLabel}</a><p><ShieldCheck size={14} />Ma’lumotlaringizni yuboring, qolganini biz tayyorlaymiz.</p></motion.div>
    </section>

    <SiteFooter footer={footer} contact={contact} />
    <div className={styles.mobileBar}><a href="#designs">Dizaynlar<Images size={16} /></a><button key="order" type="button" onClick={() => setModalOpen(true)}>Buyurtma berish<ArrowUpRight size={17} /></button></div>
    <AnimatePresence>{modalOpen && <motion.div className={styles.modalBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)}><motion.div data-home-dialog role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title" className={styles.modal} initial={reduce ? false : { y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} onClick={event => event.stopPropagation()}><button ref={closeRef} type="button" onClick={() => setModalOpen(false)} aria-label="Yopish" className={styles.modalClose}><X size={20} /></button><Heart size={27} strokeWidth={1.2} /><span className={styles.eyebrow}>KELING, HIKOYANGIZNI BOSHLAYMIZ</span><h2 id="contact-dialog-title">{modal.title}</h2><p>{modal.body}</p><a href={contact.telegramHref} target="_blank" rel="noopener noreferrer" className={styles.telegram}><Send size={17} />Telegramda yozish<ArrowUpRight size={16} /></a><a href={contact.phoneHref} className={styles.modalPhone}><Phone size={16} />{contact.phone}</a><span className={styles.modalHint}>{modal.hint}</span></motion.div></motion.div>}</AnimatePresence>
    <CopyrightNotice />
  </div>;
}
