"use server";

import { revalidatePath } from "next/cache";
import { saveSiteContent, DEFAULT_SITE_CONTENT } from "@/lib/siteContentData";
import { mergeSiteContent, type SiteContent } from "@/lib/siteContent";

// Admin panelidan yuborilgan JSON yaqinlashtiriladi, default bilan to'ldiriladi
// va "home" kaliti ostida saqlanadi. Bosh sahifa + footer darhol yangilanadi.
export async function saveSiteStructure(raw: unknown) {
  const value = mergeSiteContent(raw, DEFAULT_SITE_CONTENT) as SiteContent;
  await saveSiteContent(value);

  revalidatePath("/");
  revalidatePath("/admin/site");
  revalidatePath("/admin/dashboard");
}

export async function resetSiteStructure() {
  await saveSiteContent(DEFAULT_SITE_CONTENT);
  revalidatePath("/");
  revalidatePath("/admin/site");
}