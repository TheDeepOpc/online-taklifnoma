import type { Invitation, MusicTrack } from "@/lib/types";
import { getTheme } from "@/lib/themes";
import { GoldCoinLetter } from "./families/GoldCoinLetter";
import { PanelParallaxLetter } from "./families/PanelParallaxLetter";
import { VideoHeroLetter } from "./families/VideoHeroLetter";
import { EnvelopeCalendarLetter } from "./families/EnvelopeCalendarLetter";
import { DoorArabicLetter } from "./families/DoorArabicLetter";
import { SwanNoirLetter } from "./families/SwanNoirLetter";
import { LaceOvalLetter } from "./families/LaceOvalLetter";

export function TemplateRenderer({
  invitation,
  musicTrack,
  previewMode,
}: {
  invitation: Invitation;
  musicTrack: MusicTrack | null;
  previewMode?: boolean;
}) {
  const theme = getTheme(invitation.template_id);

  if (theme.family === "panel-parallax") {
    return (
      <PanelParallaxLetter
        invitation={invitation}
        musicTrack={musicTrack}
        theme={theme}
        previewMode={previewMode}
      />
    );
  }

  if (theme.family === "video-hero") {
    return (
      <VideoHeroLetter
        invitation={invitation}
        musicTrack={musicTrack}
        theme={theme}
        previewMode={previewMode}
      />
    );
  }

  if (theme.family === "envelope-calendar") {
    return (
      <EnvelopeCalendarLetter
        invitation={invitation}
        musicTrack={musicTrack}
        theme={theme}
        previewMode={previewMode}
      />
    );
  }

  if (theme.family === "door-arabic") {
    return (
      <DoorArabicLetter
        invitation={invitation}
        musicTrack={musicTrack}
        theme={theme}
        previewMode={previewMode}
      />
    );
  }

  if (theme.family === "swan-noir") {
    return (
      <SwanNoirLetter
        invitation={invitation}
        musicTrack={musicTrack}
        theme={theme}
        previewMode={previewMode}
      />
    );
  }

  if (theme.family === "lace-oval") {
    return (
      <LaceOvalLetter
        invitation={invitation}
        musicTrack={musicTrack}
        theme={theme}
        previewMode={previewMode}
      />
    );
  }

  return (
    <GoldCoinLetter
      invitation={invitation}
      musicTrack={musicTrack}
      theme={theme}
      previewMode={previewMode}
    />
  );
}
