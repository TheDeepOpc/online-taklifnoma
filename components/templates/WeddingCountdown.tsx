import { BookHeart, Crown, Diamond, Flower2, Heart, Mail, Sparkles } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import styles from "./WeddingCountdown.module.css";

const appearances: Record<string, string> = {
  "eternal-vow": "jewel", "green-gold": "botanical", "swan-noir-classic": "pearl", "royal-champagne": "palace", "navy-gazebo-blue": "celestial", "cocoa-blush": "stationery", "milliy-anor": "palace", "garden-bloom": "botanical", "sacred-peony-gold": "botanical", "ivory-swan-arch": "pearl", "aurora-dream-night": "celestial", "amber-dawn-rose": "heirloom", "bloom-pulse-rose": "theatre", "lux-gold-night": "jewel", "imperial-noir-gold": "palace", "editorial-plate-ink": "stationery", "regal-navy-gold": "palace", "velvet-crown-noir": "theatre",
  "premium-bardoviy-atirgul": "theatre", "premium-kuz": "heirloom", "premium-yoz": "botanical", "premium-tilla-hayot": "jewel", "premium-moviy-osmon": "celestial",
  "atelier-opera-rubis": "theatre", "atelier-samarqand-palace": "palace", "atelier-cristal-celeste": "celestial", "atelier-lettre-royale": "stationery", "atelier-jardin-de-verre": "botanical", "atelier-album-heritage": "heirloom", "atelier-tresor-eternel": "jewel",
};
const icons = { jewel: Diamond, botanical: Flower2, celestial: Sparkles, stationery: Mail, theatre: Heart, heirloom: BookHeart, palace: Crown, pearl: Heart };

export function WeddingCountdown({ date, time, themeId, previewMode = false }: { date: string; time: string; themeId: string; previewMode?: boolean }) {
  const appearance = appearances[themeId] || "jewel";
  const Icon = icons[appearance as keyof typeof icons];
  return <div className={`${styles.frame} ${styles[appearance]}`} data-wedding-countdown={appearance}>
    <Icon className={styles.emblem} size={19} strokeWidth={1} aria-hidden="true" />
    <h3 className={styles.heading}>Baxtli kunimizgacha</h3>
    <CountdownTimer targetDate={`${date}T${time || "18:00"}+05:00`} live={!previewMode} pad classes={{ root: styles.grid, cell: styles.cell, value: styles.value, label: styles.label, digit: styles.digit }} />
    <span className={`${styles.caption} ${styles.waiting}`}>Har soniya bizni yaqinlashtiradi</span>
    <span className={`${styles.caption} ${styles.complete}`}>Baxtli kunimiz boshlandi ♡</span>
  </div>;
}
