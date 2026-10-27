import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { SITE_NAME, SITE_SHARE_IMAGE } from "@/lib/seo";
import { THEME_PRESETS, resolveThemeId } from "@/lib/themes";
import { createDemoInvitation } from "@/lib/demoInvitation";
import { getDemoMusicTrack } from "@/lib/demoMusic";
import { COPYRIGHT_MARKER } from "@/components/CopyrightNotice";

// Statik sahifa: har bir shablon oldindan tayyorlanadi va CDN'dan darhol
// ochiladi (ilgari har ochilishda server render ~0.9 s olardi). Demo sana
// (bugun + 3 oy) kuniga bir marta yangilanadi.
export const revalidate = 86400;

export function generateStaticParams() {
  return THEME_PRESETS.map((theme) => ({ themeId: theme.id }));
}

/** Har bir dizayn — Google uchun alohida sahifa: o'z sarlavhasi, tavsifi va kanonik manzili. */
export async function generateMetadata({ params }: { params: Promise<{ themeId: string }> }): Promise<Metadata> {
  const themeId = resolveThemeId((await params).themeId);
  const theme = THEME_PRESETS.find((t) => t.id === themeId);
  if (!theme) return {};

  const title = `${theme.name} — onlayn to‘y taklifnomasi dizayni | ${SITE_NAME}`;
  const description =
    theme.description ??
    `«${theme.name}» — elektron to‘y taklifnomasi namunasi: musiqa, sanoq taymeri, xarita va suratlar. Toshkent va butun O‘zbekiston bo‘ylab to‘yingiz uchun.`;
  const url = `/templates/${theme.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "uz_UZ", url, title, description, images: [SITE_SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [SITE_SHARE_IMAGE] },
  };
}

export default async function TemplateDemoPage({
  params,
}: {
  params: Promise<{ themeId: string }>;
}) {
  const { themeId } = await params;
  const canonicalId = resolveThemeId(themeId);
  if (canonicalId !== themeId) redirect(`/templates/${canonicalId}`);
  const theme = THEME_PRESETS.find((t) => t.id === themeId);

  if (!theme) {
    notFound();
  }

  const musicTrack = await getDemoMusicTrack();
  const invitation = { ...createDemoInvitation(), template_id: theme.id, music_track_id: musicTrack?.id ?? null };

  return (
    <div className="min-h-screen bg-[#FDFBFB]">
      {/* Mualliflik huquqi — source code'da AI ko'radigan belgi (ko'rinmaydi) */}
      <div
        aria-hidden="true"
        className="sr-only"
        dangerouslySetInnerHTML={{ __html: COPYRIGHT_MARKER }}
      />
      {/* Alohida "/templates" bo'limi yo'q — orqaga bosh sahifadagi dizaynlarga qaytadi. */}
      <Link
        href="/#designs"
        className="fixed left-3 top-3 z-[200] flex items-center gap-2 rounded-full border border-[#2E2A27]/10 bg-[#FDFBFB]/90 px-3 py-2 text-xs font-medium text-[#2E2A27] shadow-lg backdrop-blur transition-colors hover:bg-white sm:left-4 sm:top-4 sm:px-4 sm:py-2.5 sm:text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Orqaga
      </Link>
      <TemplateRenderer
        invitation={invitation}
        musicTrack={musicTrack}
        frameSrc={`/templates/${themeId}/bare`}
        frameTitle={`${theme.name} — namuna`}
      />
    </div>
  );
}
