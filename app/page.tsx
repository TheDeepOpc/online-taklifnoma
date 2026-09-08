import { getSiteContentFromDb } from "@/lib/siteContentData";
import { HomePageContent } from "@/components/home/HomePageContent";

export default async function HomePage() {
  const content = await getSiteContentFromDb();
  return <HomePageContent content={content} />;
}