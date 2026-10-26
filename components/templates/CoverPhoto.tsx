import { RevealCard } from "./RevealCard";
import styles from "./CoverPhoto.module.css";

/**
 * Muqova rasmi o'z dizaynida bo'lmagan shablonlar uchun umumiy ramka.
 * Ilgari bu shablonlarda admin yuklagan rasm umuman ko'rinmasdi.
 * Ranglar shablonning o'z CSS o'zgaruvchilaridan olinadi (--gold, --accent...).
 */
export function CoverPhoto({
  src,
  alt,
  previewMode,
}: {
  src: string | null;
  alt: string;
  previewMode?: boolean;
}) {
  if (!src) return null;
  return (
    <RevealCard className={styles.wrap} alwaysVisible={previewMode}>
      <div className={styles.frame}>
        <div className={styles.clip}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className={styles.img} />
        </div>
        <span className={styles.sparkle} aria-hidden>
          ♥
        </span>
      </div>
    </RevealCard>
  );
}
