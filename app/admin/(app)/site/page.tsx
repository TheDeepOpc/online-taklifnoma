import { getSiteContentFromDb } from "@/lib/siteContentData";
import { SiteStructureEditor } from "@/components/admin/SiteStructureEditor";

export default async function SiteStructurePage() {
  const content = await getSiteContentFromDb();
  return <SiteStructureEditor content={content} />;
}