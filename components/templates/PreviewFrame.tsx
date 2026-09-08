import { TemplateRenderer } from "./TemplateRenderer";
import { getTheme } from "@/lib/themes";
import { DEMO_INVITATION } from "@/lib/demoInvitation";
import type { Invitation } from "@/lib/types";

/**
 * Reference mobile viewport width the template families are designed for
 * (their sections use rem-based fonts and ~400-480px max-width columns).
 * Rendering at this width and scaling the whole frame down keeps text and
 * images proportioned correctly inside small preview cards, instead of
 * rendering full-size text into a narrow container and clipping it.
 */
const DEVICE_WIDTH = 400;

export function TemplatePreviewFrame({
  themeId,
  scaleClassName,
}: {
  themeId: string;
  /** Tailwind `scale-[...]` utilities (with responsive prefixes) matching the card's own width / DEVICE_WIDTH. */
  scaleClassName: string;
}) {
  const theme = getTheme(themeId);
  const invitation: Invitation = {
    ...DEMO_INVITATION,
    template_id: theme.id,
    // Preview kartalari `<Link>` (a) ichida ochiladi — ichki `<a>` (xarita
    // havolasi) yoki `<button>` (to'yona nusxalash) nested interaktiv element
    // bo'lib hydration xatosiga olib keladi. Demo bog'lanishlarini o'chiramiz.
    venue_map_url: null,
    gift_card_number: null,
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-white"
      style={{ contentVisibility: "auto", containIntrinsicSize: "400px 800px" }}
    >
      <div
        className={`origin-top-left ${scaleClassName}`}
        style={{ width: DEVICE_WIDTH }}
      >
        <TemplateRenderer invitation={invitation} musicTrack={null} previewMode />
      </div>
    </div>
  );
}
