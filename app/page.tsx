import { getSiteContentFromDb } from "@/lib/siteContentData";
import { HomePageContent } from "@/components/home/HomePageContent";

// Statik sahifa (CDN'dan): matnlar keshdan, admin saqlaganda darhol yangilanadi.
// Zaxira sifatida soatiga bir marta qayta tekshiriladi.
export const revalidate = 3600;

export default async function HomePage() {
  const content = await getSiteContentFromDb();
  return <HomePageContent content={content} />;
}
