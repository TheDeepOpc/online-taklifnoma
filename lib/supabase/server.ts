import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server component chaqiruvida cookie yozib bo'lmasligi mumkin;
            // bu holat middleware orqali sessiyani yangilashda hal qilinadi.
          }
        },
      },
    },
  );
}

/**
 * Server action'lar uchun: Discord'ga fayl yuklash RLS bilan himoyalanmagan,
 * shuning uchun foydalanuvchi kirganini action'ning o'zida tekshiramiz
 * (action'ni proxy matcher'idan tashqaridagi istalgan sahifaga POST qilish mumkin).
 */
export async function createAuthenticatedClient() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub || claims.role === "anon") {
    throw new Error("Avval admin sifatida kiring.");
  }
  return supabase;
}
