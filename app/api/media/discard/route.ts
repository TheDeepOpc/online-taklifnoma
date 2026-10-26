import { createAuthenticatedClient } from "@/lib/supabase/server";
import { deleteMediaIfUnreferenced } from "@/lib/mediaStore";

const MAX_URLS = 20;

/**
 * Formada yuklangan, lekin saqlanmagan rasmlarni o'chirish: admin rasmni
 * olib tashlaganda, boshqasiga almashtirganda yoki sahifani tashlab ketganda.
 * Sahifa yopilayotganda ham yetib borishi uchun server action emas, oddiy
 * route (`fetch(..., { keepalive: true })`).
 *
 * Xavfsizlik: faqat kirgan admin; va faqat hech bir taklifnoma/musiqa
 * ishlatmayotgan fayl o'chadi — saqlangan rasmni bu yo'l bilan o'chirib bo'lmaydi.
 */
export async function POST(request: Request) {
  let supabase;
  try {
    supabase = await createAuthenticatedClient();
  } catch {
    return Response.json({ error: "Avval admin sifatida kiring." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { urls?: unknown } | null;
  const urls = Array.isArray(body?.urls)
    ? body.urls.filter((url): url is string => typeof url === "string").slice(0, MAX_URLS)
    : [];

  try {
    const deleted = await deleteMediaIfUnreferenced(supabase, urls);
    return Response.json({ deleted });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 502 });
  }
}
