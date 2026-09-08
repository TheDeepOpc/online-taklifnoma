import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // TEZLIK: ilgari bu yerda `auth.getUser()` chaqirilardi — u HAR bir
  // /admin/* so'rovida Supabase Auth serveriga tarmoq so'rovi yuborardi
  // (o'lchandi: ~620 ms). Bitta tugma bosilishi ikki so'rovni keltirib
  // chiqaradi (server action POST + keyingi redirect GET), ya'ni ~1.2 s
  // faqat autentifikatsiyaga ketardi.
  //
  // Loyihada asimmetrik (ES256) JWT kalitlari yoqilgan, shuning uchun
  // `getClaims()` tokenni WebCrypto orqali MAHALLIY tekshiradi. JWKS
  // auth-js ichida global keshlanadi — jarayon davomida bir marta olinadi.
  //
  // Xavfsizlik: bu faqat marshrutlash uchun (login sahifasiga yo'naltirish).
  // Ma'lumotlarga kirish baza darajasidagi RLS siyosatlari bilan
  // himoyalangan, ular `authenticated` rolini talab qiladi.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const isAuthenticated = Boolean(claims?.sub) && claims?.role !== "anon";

  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login";

  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
