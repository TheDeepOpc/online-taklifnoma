import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * `/t/` (shaxsiy taklifnomalar) bu yerda yopilmaydi: Telegram/Instagram havola
 * rasmini o'qishi kerak. Ular Google'ga sahifadagi `noindex` bilan kirmaydi.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
