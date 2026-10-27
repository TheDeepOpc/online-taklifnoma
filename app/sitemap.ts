import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { THEME_PRESETS } from "@/lib/themes";

/**
 * Ommaviy sahifalar: bosh sahifa va har bir dizaynning jonli namunasi.
 * Mijozlarning taklifnomalari (`/t/...`) shaxsiy — sitemap'ga kirmaydi.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${SITE_URL}/home-art/love-story.webp`, `${SITE_URL}/home-art/wedding-details.webp`],
    },
    ...THEME_PRESETS.map((theme) => ({
      url: `${SITE_URL}/templates/${theme.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [`${SITE_URL}/template-shots/${theme.id}.webp`],
    })),
  ];
}
