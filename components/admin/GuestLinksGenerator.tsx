"use client";

import { useMemo, useState } from "react";
import { guestInvitationPath, sanitizeGuestName } from "@/lib/guestLink";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Har bir mehmon uchun shaxsiy havola: admin ismlarni qatorma-qator yozadi,
 * har biriga `?mehmon=` bilan alohida link chiqadi. Taklifnoma ochilganda
 * birinchi ekranda "Hurmatli <ism>" ko'rinadi.
 */
export function GuestLinksGenerator({ slug, published }: { slug: string; published: boolean }) {
  const [names, setNames] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const links = useMemo(() => {
    const origin = typeof window === "undefined" ? "" : window.location.origin;
    const unique = new Set<string>();
    for (const line of names.split("\n")) {
      const name = sanitizeGuestName(line);
      if (name) unique.add(name);
    }
    return [...unique].map((name) => ({ name, url: `${origin}${guestInvitationPath(slug, name)}` }));
  }, [names, slug]);

  async function handleCopy(key: string, text: string) {
    if (await copyText(text)) {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    }
  }

  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Shaxsiy havolalar</h2>
      <p className="mt-1 text-sm text-slate-500">
        Har bir mehmonning ism-familiyasini alohida qatorga yozing — har biriga o&apos;z
        ismi bilan ochiladigan link tayyorlanadi. Bitta taklifnoma, cheksiz shaxsiy link.
      </p>
      {!published && (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Taklifnoma hali e&apos;lon qilinmagan — linklar to&apos;lov belgilangandan keyin ishlaydi.
        </p>
      )}
      <textarea
        value={names}
        onChange={(e) => setNames(e.target.value)}
        rows={4}
        className="input mt-3"
        placeholder={"Abdurahmonova Gulnoza\nKarimov Sardor aka\nNodira opa"}
      />
      {links.length > 0 && (
        <>
          <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {links.map((link) => (
              <li key={link.url} className="flex items-center gap-3 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{link.name}</p>
                  <p className="truncate text-xs text-slate-400">{link.url}</p>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 underline hover:text-slate-700"
                >
                  Ko&apos;rish
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(link.url, link.url)}
                  className="btn-secondary shrink-0 px-3 py-1.5 text-xs"
                >
                  {copied === link.url ? "Nusxalandi ✓" : "Nusxalash"}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() =>
              handleCopy("all", links.map((l) => `${l.name}: ${l.url}`).join("\n"))
            }
            className="btn-secondary mt-3 text-sm"
          >
            {copied === "all" ? "Hammasi nusxalandi ✓" : `Hammasini nusxalash (${links.length})`}
          </button>
        </>
      )}
    </section>
  );
}
