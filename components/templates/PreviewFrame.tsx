import { TemplateRenderer } from "./TemplateRenderer";
import { getTheme } from "@/lib/themes";
import { DEMO_INVITATION } from "@/lib/demoInvitation";

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
  const invitation = { ...DEMO_INVITATION, template_id: theme.id };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white">
      <div
        className={`origin-top-left ${scaleClassName}`}
        style={{ width: DEVICE_WIDTH }}
      >
        <TemplateRenderer invitation={invitation} musicTrack={null} previewMode />
      </div>
    </div>
  );
}
