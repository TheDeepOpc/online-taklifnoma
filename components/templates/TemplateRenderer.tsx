import type { Invitation, MusicTrack } from "@/lib/types";
import { musicPlaybackUrl } from "@/lib/musicPlayback";
import { PhoneFrame } from "./PhoneFrame";
import { FitNames } from "./FitNames";
import { getTheme, type ThemeFamily } from "@/lib/themes";
import { PresidentialInvitation } from "@/templates/premium/presidential/PresidentialInvitation";
import { AtelierInvitation } from "@/templates/premium/AtelierInvitation";
import { CollectionInvitation } from "@/templates/premium/CollectionInvitation";
import { BardoviyAtirgul } from "@/templates/premium/BardoviyAtirgul";
import { Kuz } from "@/templates/premium/Kuz";
import { Yoz } from "@/templates/premium/Yoz";
import { TillaHayot } from "@/templates/premium/TillaHayot";
import { MoviyOsmon } from "@/templates/premium/MoviyOsmon";

const FAMILY_COMPONENTS: Record<ThemeFamily, typeof CollectionInvitation> = {
  atelier: AtelierInvitation,
  presidential: PresidentialInvitation,
  "premium-bardoviy-atirgul": BardoviyAtirgul,
  "premium-kuz": Kuz,
  "premium-yoz": Yoz,
  "premium-tilla-hayot": TillaHayot,
  "premium-moviy-osmon": MoviyOsmon,
  "panel-parallax": CollectionInvitation,
  "video-hero": CollectionInvitation,
  "swan-noir": CollectionInvitation,
  "royal-frame": CollectionInvitation,
  "navy-gazebo": CollectionInvitation,
  "blush-portrait": CollectionInvitation,
  "milliy-ornament": CollectionInvitation,
  "garden-bouquet": CollectionInvitation,
  "sacred-peony": CollectionInvitation,
  "ivory-envelope": CollectionInvitation,
  "aurora-dream": CollectionInvitation,
  "amber-dawn": CollectionInvitation,
  "bloom-pulse": CollectionInvitation,
  "lux-gold": CollectionInvitation,
  "imperial-gold": CollectionInvitation,
  "editorial-plate": CollectionInvitation,
  "regal-envelope": CollectionInvitation,
  "velvet-crown": CollectionInvitation,
};

export function TemplateRenderer({
  invitation,
  musicTrack,
  previewMode,
  frame = true,
  frameSrc,
  frameTitle = "Taklifnoma",
}: {
  invitation: Invitation;
  musicTrack: MusicTrack | null;
  previewMode?: boolean;
  /** Desktop ramkasi uchun shu sahifaning ramkasiz manzili (`?bare=1` yoki `/bare`). */
  frameSrc?: string;
  frameTitle?: string;
  /** Set false to skip the desktop "phone" bezel even outside previewMode —
   * for embedding a fully-interactive (real entrance, real scroll-reveal,
   * ticking countdown, real music button) render inside a caller-provided
   * frame, e.g. the admin's live-preview panel. */
  frame?: boolean;
}) {
  const theme = getTheme(invitation.template_id);
  const Family = FAMILY_COMPONENTS[theme.family];
  const playbackTrack = musicTrack ? { ...musicTrack, file_url: musicPlaybackUrl(musicTrack) } : null;

  // "Kichikroq" matn o'lchami: har bir shablonning o'z CSS faylini o'zgartirish
  // o'rniga, bu yerda bitta joyda `zoom` bilan butun render'ni kichraytiramiz —
  // `transform: scale` dan farqli o'laroq, `zoom` layout balandligini ham to'g'ri
  // qisqartiradi (bo'sh joy qolmaydi).
  const content = (
    <div style={invitation.text_size === "compact" ? ({ zoom: 0.85 } as React.CSSProperties) : undefined}>
      <FitNames names={[invitation.groom_name, invitation.bride_name, invitation.guest_name ?? ""]}>
        <Family invitation={invitation} musicTrack={playbackTrack} theme={theme} previewMode={previewMode} />
      </FitNames>
    </div>
  );

  // Small embedded preview cards (template gallery, homepage) manage their own
  // frame/scale — only the full-page view (real invitation link, demo page)
  // gets the desktop "phone" frame, so wide screens don't just show a thin
  // column floating in empty space.
  if (previewMode || !frame) {
    return content;
  }

  if (!frameSrc) {
    return content;
  }

  return (
    <PhoneFrame src={frameSrc} title={frameTitle}>
      {content}
    </PhoneFrame>
  );
}
