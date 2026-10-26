import { RevealCard } from "./RevealCard";
import { wishForSeed } from "@/lib/wishTemplates";
import type { Invitation } from "@/lib/types";
import styles from "./WishesSection.module.css";

/**
 * "Qo'shimcha tilaklar" — har bir shablonda bor. Admin o'zi yozmasa, tayyor
 * matnlardan biri taklifnoma id'siga qarab barqaror tanlanadi.
 * Ranglar shablonning o'z o'zgaruvchilaridan (--gold/--accent) va ota
 * elementning matn rangidan olinadi; `className` bilan moslashtiriladi.
 */
export function WishesSection({
  invitation,
  previewMode,
  className,
}: {
  invitation: Invitation;
  previewMode?: boolean;
  className?: string;
}) {
  const custom = invitation.wishes_text?.trim();
  const fallback = wishForSeed(invitation.id || invitation.slug);
  const title = invitation.wishes_title?.trim() || (custom ? "Tilaklarimiz" : fallback.title);
  const paragraphs = (custom || fallback.text)
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <RevealCard className={`${styles.section} ${className ?? ""}`} alwaysVisible={previewMode}>
      <div className={styles.ornament} aria-hidden>
        <span />♥<span />
      </div>
      <p className={styles.eyebrow}>Qalbimizdan</p>
      <h2 className={styles.title}>{title}</h2>
      {paragraphs.map((p, i) => (
        <p key={i} className={styles.text}>
          {p}
        </p>
      ))}
    </RevealCard>
  );
}
