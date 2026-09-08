/**
 * Bosh sahifadagi shablon namunasi.
 *
 * Ilgari bu yerda haqiqiy shablon komponenti kichraytirilib render qilinardi —
 * bu ham og'ir edi, ham kichik o'lchamda xunuk ko'rinardi (shrift/joylashuv
 * buzilardi). Endi oldindan olingan skrinshotlar (public/template-shots/*.webp)
 * ishlatiladi: sahifa yengil, ko'rinish esa to'liq aniq.
 *
 * Skrinshotlarni yangilash:  npm run shots
 */
export function TemplateShot({
  themeId,
  alt,
  className,
  eager = false,
}: {
  themeId: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`/template-shots/${themeId}.webp`}
      alt={alt}
      width={860}
      height={1800}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={`h-full w-full select-none object-cover object-top ${className ?? ""}`}
    />
  );
}

/** Telefon ramkasi + skrinshot. */
export function PhoneShot({
  themeId,
  alt,
  frameClassName,
  eager = false,
  dim = false,
}: {
  themeId: string;
  alt: string;
  frameClassName?: string;
  eager?: boolean;
  dim?: boolean;
}) {
  return (
    <div
      className={`relative aspect-[43/90] overflow-hidden rounded-[1.6rem] border-[5px] border-[#2E2A27] bg-[#2E2A27] shadow-[0_28px_60px_-18px_rgba(46,42,39,0.45)] ${
        frameClassName ?? ""
      }`}
    >
      <span className="absolute left-1/2 top-0 z-20 h-3 w-12 -translate-x-1/2 rounded-b-lg bg-[#2E2A27]" />
      <TemplateShot themeId={themeId} alt={alt} eager={eager} />
      {dim && <span aria-hidden className="absolute inset-0 z-10 bg-[#2E2A27]/12" />}
    </div>
  );
}
