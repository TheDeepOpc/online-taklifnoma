import { INVITATION_ART } from "@/lib/invitationArt";
import { PremiumInvitation, type PremiumProps } from "./shared/PremiumInvitation";

/** Photo-led replacement for the original 18 CSS illustration families. */
export function CollectionInvitation(props: PremiumProps) {
  const art = INVITATION_ART[props.theme.id] ?? INVITATION_ART["eternal-vow"];
  const theme = {
    ...props.theme,
    colors: { ...props.theme.colors, bg: art.bg, paper: art.paper, ink: art.ink, gold: art.accent, accent: art.accent, "ink-soft": art.muted },
    fonts: {
      ...props.theme.fonts,
      "theme-display-font": props.theme.fonts["theme-display-font"] || "var(--font-cormorant)",
      "theme-script-font": props.theme.fonts["theme-script-font"] || "var(--font-great-vibes)",
      "theme-body-font": "var(--font-dm-sans)",
    },
  };
  return <PremiumInvitation {...props} theme={theme} variant={art.layout} edition="I" title={art.title} subtitle={art.subtitle} />;
}
