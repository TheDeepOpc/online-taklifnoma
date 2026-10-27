import { BrandLogo } from "@/components/BrandLogo";
import styles from "./InvitationCredit.module.css";

export function InvitationCredit({ edition }: { edition?: string }) {
  return <a href="https://oila-uchun.uz" target="_blank" rel="noopener noreferrer" className={styles.credit} title={edition ? `${edition} · Oila-Uchun` : "Oila-Uchun"} data-invitation-credit>
    <BrandLogo size={26} className={styles.logo} alt="" />
    <span>Taklifnoma <strong>oila-uchun.uz</strong><br />tomonidan yaratildi</span>
  </a>;
}
