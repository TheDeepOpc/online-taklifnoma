import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { THEME_PRESETS } from "@/lib/themes";
import { DEMO_INVITATION } from "@/lib/demoInvitation";

export default async function TemplateDemoPage({
  params,
}: {
  params: Promise<{ themeId: string }>;
}) {
  const { themeId } = await params;
  const theme = THEME_PRESETS.find((t) => t.id === themeId);

  if (!theme) {
    notFound();
  }

  const invitation = { ...DEMO_INVITATION, template_id: theme.id };

  return (
    <div className="min-h-screen bg-[#FDFBFB]">
      <Link
        href="/templates"
        className="fixed left-3 top-3 z-[200] flex items-center gap-2 rounded-full border border-[#2E2A27]/10 bg-[#FDFBFB]/90 px-3 py-2 text-xs font-medium text-[#2E2A27] shadow-lg backdrop-blur transition-colors hover:bg-white sm:left-4 sm:top-4 sm:px-4 sm:py-2.5 sm:text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Shablonlar
      </Link>
      <TemplateRenderer invitation={invitation} musicTrack={null} />
    </div>
  );
}
