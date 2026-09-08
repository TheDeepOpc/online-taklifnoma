import Link from "next/link";

const PRODUCT_LINKS = [
  { label: "Dizaynlar", href: "/templates" },
  { label: "Narxlar", href: "/#pricing" },
  { label: "Qanday ishlaydi", href: "/#how" },
];

const COMPANY_LINKS = [
  { label: "Biz haqimizda", href: "#" },
  { label: "Maxfiylik siyosati", href: "#" },
  { label: "Foydalanish shartlari", href: "#" },
];

const SOCIALS = [
  {
    label: "Telegram",
    href: "https://t.me/998999179927",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/998999179927",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#2E2A27]/6 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <svg viewBox="0 0 120 80" className="h-6 w-9 text-[#B8923F]" fill="none" aria-hidden>
                <ellipse cx="42" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(-12 42 45)" />
                <ellipse cx="78" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(12 78 45)" />
              </svg>
              <span className="font-display text-lg tracking-tight text-[#2E2A27]">
                Oila<span className="text-[#BD7E5F]">-</span>Uchun
              </span>
            </Link>
            <p className="max-w-[220px] text-sm leading-relaxed text-[#2E2A27]/50">
              Sevganlaringiz uchun onlayn to&apos;y taklifnomasini yarating.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#2E2A27]">Mahsulot</h4>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#2E2A27]/50 transition-colors hover:text-[#BD7E5F]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#2E2A27]">Kompaniya</h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-[#2E2A27]/50 transition-colors hover:text-[#BD7E5F]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#2E2A27]">Ijtimoiy tarmoqlar</h4>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F6EFE9] text-[#2E2A27]/50 transition-colors hover:bg-[#BD7E5F] hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#2E2A27]/6 pt-6 text-center">
          <p className="text-xs text-[#2E2A27]/40">&copy; 2026 Oila-Uchun. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}
