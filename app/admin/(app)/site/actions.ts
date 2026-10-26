"use server";

import { revalidatePath, updateTag } from "next/cache";
import { saveSiteContent, DEFAULT_SITE_CONTENT, SITE_CONTENT_TAG } from "@/lib/siteContentData";
import { mergeSiteContent, type SiteContent } from "@/lib/siteContent";

// Admin panelidan yuborilgan JSON yaqinlashtiriladi, default bilan to'ldiriladi
// va "home" kaliti ostida saqlanadi. Bosh sahifa + footer darhol yangilanadi
// (bosh sahifa statik — kesh teg orqali yangilanadi).
export async function saveSiteStructure(raw: unknown) {
  const value = mergeSiteContent(raw, DEFAULT_SITE_CONTENT) as SiteContent;
  await saveSiteContent(value);

  updateTag(SITE_CONTENT_TAG);
  revalidatePath("/");
  revalidatePath("/admin/site");
  revalidatePath("/admin/dashboard");
}

export async function resetSiteStructure() {
  await saveSiteContent(DEFAULT_SITE_CONTENT);
  updateTag(SITE_CONTENT_TAG);
  revalidatePath("/");
  revalidatePath("/admin/site");
}
