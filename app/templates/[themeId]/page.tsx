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
    <div>
      <Link
        href="/templates"
        className="fixed left-4 top-4 z-[200] flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-lg backdrop-blur transition hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Shablonlar
      </Link>
      <TemplateRenderer invitation={invitation} musicTrack={null} />
    </div>
  );
}
