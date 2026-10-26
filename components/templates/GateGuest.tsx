import styles from "./GateGuest.module.css";

/**
 * Shaxsiy taklifnomada mehmon ismini birinchi ekranda — konvert/parda
 * ustida ko'rsatadi. Ilgari ism faqat sahifaning o'rtasida (ba'zi
 * shablonlarda umuman) chiqardi, mehmon taklifnoma kimga ekanini
 * ochmaguncha bilmasdi. Ism bo'lmasa hech narsa chizilmaydi.
 */
export function GateGuest({
  name,
  className,
  onImage = false,
  floating = false,
  label = "Hurmatli",
}: {
  name: string | null | undefined;
  className?: string;
  /** Fon rasm/video ustida turganda o'qilishi uchun soya qo'shiladi. */
  onImage?: boolean;
  /** Gate to'liq ekranli rasm bo'lsa — ekran tepasiga mutlaq joylashadi. */
  floating?: boolean;
  label?: string;
}) {
  if (!name) return null;
  return (
    <span className={`${styles.root} ${onImage ? styles.onImage : ""} ${floating ? styles.floating : ""} ${className ?? ""}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.name}>{name}</span>
      <span className={styles.rule} aria-hidden />
    </span>
  );
}
