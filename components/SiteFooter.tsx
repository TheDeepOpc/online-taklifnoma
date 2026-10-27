import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ArrowUp, ArrowUpRight, Heart, MessageCircle, Send } from "lucide-react";
import { DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import styles from "./SiteFooter.module.css";

export function SiteFooter({ footer = DEFAULT_SITE_CONTENT.footer, contact = DEFAULT_SITE_CONTENT.contact }: { footer?: typeof DEFAULT_SITE_CONTENT.footer; contact?: typeof DEFAULT_SITE_CONTENT.contact }) {
  const companyLinks = footer.companyLinks.filter(link => link.href && link.href !== "#");
  return <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.masthead}>
        <Link href="/" className={styles.brand} aria-label={`${footer.brand}${footer.brandAccent}${footer.brandSuffix} — bosh sahifa`}>
          <BrandLogo size={54} alt="" className={styles.brandLogo} />
          <span>{footer.brand}<em>{footer.brandAccent}</em>{footer.brandSuffix}</span>
        </Link>
        <a href="#" className={styles.backTop} aria-label="Sahifa boshiga qaytish"><ArrowUp size={19} strokeWidth={1.3} /></a>
      </div>
      <div className={styles.grid}>
        <div className={styles.manifesto}><span>MUHABBAT BILAN YARATILADI</span><p>{footer.tagline}</p><div><Heart size={13} strokeWidth={1.2} /><em>Go‘zal kuningizga nafis boshlanish.</em></div></div>
        <nav aria-label="Footer navigatsiyasi" className={styles.navigation}><h2>{footer.productTitle}</h2>{footer.productLinks.map(link => <Link href={link.href} key={link.href + link.label}>{link.label}<ArrowUpRight size={13} /></Link>)}</nav>
        {companyLinks.length > 0 && <nav aria-label={footer.companyTitle} className={styles.navigation}><h2>{footer.companyTitle}</h2>{companyLinks.map(link => <Link href={link.href} key={link.href + link.label}>{link.label}<ArrowUpRight size={13} /></Link>)}</nav>}
        <div className={styles.connect}><h2>Birgalikda boshlaymiz</h2><a href={contact.phoneHref} className={styles.phone}>{contact.phone}<ArrowUpRight size={17} /></a><div className={styles.socials}><a href={contact.telegramHref} target="_blank" rel="noopener noreferrer"><Send size={14} />{contact.telegramLabel}</a><a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} />{contact.whatsappLabel}</a></div></div>
      </div>
      <div className={styles.bottom}><p>{footer.rights}</p><span>{footer.madeWith}<Heart size={11} /></span><span>HAR BIR HAVOLA — BIR HIKOYA</span></div>
    </div>
  </footer>;
}
