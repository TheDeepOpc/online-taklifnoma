import type { Invitation, MusicTrack } from "@/lib/types";
import { PhoneFrame } from "./PhoneFrame";
import { getTheme, type ThemeFamily } from "@/lib/themes";
import { PanelParallaxLetter } from "./families/PanelParallaxLetter";
import { VideoHeroLetter } from "./families/VideoHeroLetter";
import { SwanNoirLetter } from "./families/SwanNoirLetter";
import { RoyalFrameLetter } from "./families/RoyalFrameLetter";
import { NavyGazeboLetter } from "./families/NavyGazeboLetter";
import { BlushPortraitLetter } from "./families/BlushPortraitLetter";
import { MilliyOrnamentLetter } from "./families/MilliyOrnamentLetter";
import { GardenBouquetLetter } from "./families/GardenBouquetLetter";
import { SacredPeonyLetter } from "./families/SacredPeonyLetter";
import { IvoryEnvelopeLetter } from "./families/IvoryEnvelopeLetter";
import { AuroraDreamLetter } from "./families/AuroraDreamLetter";
import { AmberDawnLetter } from "./families/AmberDawnLetter";
import { BloomPulseLetter } from "./families/BloomPulseLetter";
import { LuxGoldLetter } from "./families/LuxGoldLetter";
import { ImperialGoldLetter } from "./families/ImperialGoldLetter";
import { EditorialPlateLetter } from "./families/EditorialPlateLetter";
import { RegalEnvelopeLetter } from "./families/RegalEnvelopeLetter";
import { VelvetCrownLetter } from "./families/VelvetCrownLetter";

const FAMILY_COMPONENTS: Record<ThemeFamily, typeof PanelParallaxLetter> = {
  "panel-parallax": PanelParallaxLetter,
  "video-hero": VideoHeroLetter,
  "swan-noir": SwanNoirLetter,
  "royal-frame": RoyalFrameLetter,
  "navy-gazebo": NavyGazeboLetter,
  "blush-portrait": BlushPortraitLetter,
  "milliy-ornament": MilliyOrnamentLetter,
  "garden-bouquet": GardenBouquetLetter,
  "sacred-peony": SacredPeonyLetter,
  "ivory-envelope": IvoryEnvelopeLetter,
  "aurora-dream": AuroraDreamLetter,
  "amber-dawn": AmberDawnLetter,
  "bloom-pulse": BloomPulseLetter,
  "lux-gold": LuxGoldLetter,
  "imperial-gold": ImperialGoldLetter,
  "editorial-plate": EditorialPlateLetter,
  "regal-envelope": RegalEnvelopeLetter,
  "velvet-crown": VelvetCrownLetter,
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
  /** Desktop ramkasi uchun shu sahifaning ramkasiz (`?bare=1`) manzili. */
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

  // "Kichikroq" matn o'lchami: har bir shablonning o'z CSS faylini o'zgartirish
  // o'rniga, bu yerda bitta joyda `zoom` bilan butun render'ni kichraytiramiz —
  // `transform: scale` dan farqli o'laroq, `zoom` layout balandligini ham to'g'ri
  // qisqartiradi (bo'sh joy qolmaydi).
  const content = (
    <div style={invitation.text_size === "compact" ? ({ zoom: 0.85 } as React.CSSProperties) : undefined}>
      <Family invitation={invitation} musicTrack={musicTrack} theme={theme} previewMode={previewMode} />
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
