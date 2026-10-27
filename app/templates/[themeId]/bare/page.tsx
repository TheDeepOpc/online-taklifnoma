import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { THEME_PRESETS } from "@/lib/themes";
import { createDemoInvitation } from "@/lib/demoInvitation";
import { getDemoMusicTrack } from "@/lib/demoMusic";

/**
 * Ramkasiz ko'rinish: desktop'dagi telefon ramkasi (iframe) shu sahifani
 * ochadi. Ilgari bu `?bare=1` edi — query parametr sahifani har safar
 * dinamik render qilishga majburlardi; alohida yo'l esa statik bo'la oladi.
 */
export const revalidate = 86400;

export const metadata: Metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return THEME_PRESETS.map((theme) => ({ themeId: theme.id }));
}

export default async function BareTemplatePage({
  params,
}: {
  params: Promise<{ themeId: string }>;
}) {
  const { themeId } = await params;
  const theme = THEME_PRESETS.find((t) => t.id === themeId);

  if (!theme) {
    notFound();
  }

  const musicTrack = await getDemoMusicTrack();
  const invitation = { ...createDemoInvitation(), template_id: theme.id, music_track_id: musicTrack?.id ?? null };
  return <TemplateRenderer invitation={invitation} musicTrack={musicTrack} frame={false} />;
}
