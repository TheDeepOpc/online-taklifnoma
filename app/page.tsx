import type { Metadata } from "next";
import { getSiteContentFromDb } from "@/lib/siteContentData";
import { HomePageContent } from "@/components/home/HomePageContent";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, homeJsonLd, jsonLdHtml } from "@/lib/seo";

// Statik sahifa (CDN'dan): matnlar keshdan, admin saqlaganda darhol yangilanadi.
// Zaxira sifatida soatiga bir marta qayta tekshiriladi.
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "uz_UZ",
    type: "website",
  },
};

export default async function HomePage() {
  const content = await getSiteContentFromDb();
  return (
    <>
      {/* Google uchun: tashkilot, sayt, xizmat narxlari va savol-javoblar. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(homeJsonLd(content.contact)) }} />
      <HomePageContent content={content} />
    </>
  );
}
