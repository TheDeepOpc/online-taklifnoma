"use client";

import { useState, useTransition } from "react";
import { Save, RotateCcw, Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { FEATURE_ICON_KEYS, type SiteContent } from "@/lib/siteContent";
import { saveSiteStructure, resetSiteStructure } from "@/app/admin/(app)/site/actions";

const SECTION_LABELS: { key: keyof SiteContent; title: string; hint: string }[] = [
  { key: "hero", title: "Bosh ekran (Hero)", hint: "Video ustidagi sarlavha, ta'rif va tugmalar" },
  { key: "stats", title: "Statistika", hint: "Hero'dagi raqamlar (jonli dizayn, narx darajasi, tayyor bo'lish)" },
  { key: "designs", title: "Jonli dizaynlar", hint: "\"#designs\" bo'limi sarlavhasi" },
  { key: "how", title: "Qanday ishlaydi", hint: "Uch qadam" },
  { key: "features", title: "Imkoniyatlar", hint: "Sehrning tarkibi" },
  { key: "gift", title: "Sovg'a / tuhfa", hint: "Bepul taklifnomalar aksiyasi" },
  { key: "pricing", title: "Narxlar", hint: "Tariflar sarlavhasi va matnlari" },
  { key: "contact", title: "Bog'lanish", hint: "Telefon / Telegram / WhatsApp" },
  { key: "modal", title: "Modal oyna", hint: "\"Boshlash\" tugmasi ochadigan oyna" },
  { key: "footer", title: "Footer", hint: "Sayt pastki qismidagi matnlar va havolalar" },
];

function Field({
  label,
  value,
  onChange,
  textarea,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {textarea ? (
        <textarea
          className="input min-h-20 resize-y"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="input"
          type={type}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

function Card({ index, onRemove, children }: { index: number; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">#{index + 1}</span>
        <button type="button" onClick={onRemove} className="text-slate-400 transition hover:text-red-600" title="O'chirish">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Section({
  title,
  hint,
  initiallyOpen = false,
  children,
}: {
  title: string;
  hint: string;
  initiallyOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={initiallyOpen}
      className="group rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">{hint}</p>
        </div>
        <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-slate-100 p-5">{children}</div>
    </details>
  );
}

export function SiteStructureEditor({ content: initialContent }: { content: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function setNested<K extends keyof SiteContent>(key: K, updater: (v: SiteContent[K]) => SiteContent[K]) {
    setContent((prev) => ({ ...prev, [key]: updater(prev[key]) }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveSiteStructure(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <form onSubmit={handleSave}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Sayt tuzilmasi</h1>
          <p className="mt-1 text-sm text-slate-500">
            Bosh sahifa va footer&apos;ning barcha matnini shu yerdan o‘zgartiring. Saqlash bilan birga sayt darhol yangilanadi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary"
            disabled={pending}
            onClick={() => {
              if (confirm("Barcha o'zgarishlarni bekor qilib, standart matnlarga qaytishni istaysizmi?")) {
                startTransition(async () => {
                  await resetSiteStructure();
                  window.location.reload();
                });
              }
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Standartga qaytarish
          </button>
          <button type="submit" className="btn" disabled={pending}>
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {pending ? "Saqlanmoqda…" : saved ? "Saqlandi" : "Saqlash"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <Section title="Bosh ekran (Hero)" hint={SECTION_LABELS[0].hint} initiallyOpen>
          <Field label="Badge (yuqori chiziq)" value={content.hero.badge} onChange={(v) => setNested("hero", (h) => ({ ...h, badge: v }))} />
          <Field label="Sarlavha 1-qator" value={content.hero.title1} onChange={(v) => setNested("hero", (h) => ({ ...h, title1: v }))} />
          <Field label="Sarlavha 2-qator (gul matn)" value={content.hero.title2} onChange={(v) => setNested("hero", (h) => ({ ...h, title2: v }))} />
          <Field label="Sarlavha 3-qator (gul, kursiv)" value={content.hero.title3} onChange={(v) => setNested("hero", (h) => ({ ...h, title3: v }))} />
          <Field label="Kichik tagchiziq" value={content.hero.subtitle} onChange={(v) => setNested("hero", (h) => ({ ...h, subtitle: v }))} />
          <Field label="Ta'rif" value={content.hero.description} textarea onChange={(v) => setNested("hero", (h) => ({ ...h, description: v }))} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Asosiy tugma matni" value={content.hero.ctaPrimary} onChange={(v) => setNested("hero", (h) => ({ ...h, ctaPrimary: v }))} />
            <Field label="Asosiy tugma manzili" value={content.hero.ctaPrimaryHref} onChange={(v) => setNested("hero", (h) => ({ ...h, ctaPrimaryHref: v }))} />
            <Field label="Ikkinchi tugma matni" value={content.hero.ctaSecondary} onChange={(v) => setNested("hero", (h) => ({ ...h, ctaSecondary: v }))} />
            <Field label="&quot;Pastga suring&quot; yozuvi" value={content.hero.scrollHint} onChange={(v) => setNested("hero", (h) => ({ ...h, scrollHint: v }))} />
          </div>
        </Section>

        <Section title="Statistika" hint={SECTION_LABELS[1].hint}>
          {content.stats.map((stat, i) => (
            <Card key={i} index={i} onRemove={() => set("stats", content.stats.filter((_, j) => j !== i))}>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Raqam" type="number" value={stat.value} onChange={(v) => setNested("stats", (s) => s.map((x, j) => (j === i ? { ...x, value: Number(v) || 0 } : x)))} />
                <Field label="Qo'shimcha (masalan +)" value={stat.suffix} onChange={(v) => setNested("stats", (s) => s.map((x, j) => (j === i ? { ...x, suffix: v } : x)))} />
                <Field label="Yozuv" value={stat.label} onChange={(v) => setNested("stats", (s) => s.map((x, j) => (j === i ? { ...x, label: v } : x)))} />
              </div>
            </Card>
          ))}
          <div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setNested("stats", (s) => [...s, { value: 0, suffix: "", label: "" }])}
            >
              <Plus className="h-4 w-4" />
              Statistika qo‘shish
            </button>
          </div>
        </Section>

        <Section title="Jonli dizaynlar" hint={SECTION_LABELS[2].hint}>
          <Field label="Sarlavha" value={content.designs.title} onChange={(v) => setNested("designs", (d) => ({ ...d, title: v }))} />
          <Field label="Sarlavha (gul matn)" value={content.designs.accent} onChange={(v) => setNested("designs", (d) => ({ ...d, accent: v }))} />
          <Field label="Ta'rif" value={content.designs.subtitle} textarea onChange={(v) => setNested("designs", (d) => ({ ...d, subtitle: v }))} />
        </Section>

        <Section title="Qanday ishlaydi" hint={SECTION_LABELS[3].hint}>
          <Field label="Kichik chiziq (script)" value={content.how.script} onChange={(v) => setNested("how", (h) => ({ ...h, script: v }))} />
          <Field label="Sarlavha" value={content.how.title} onChange={(v) => setNested("how", (h) => ({ ...h, title: v }))} />
          <Field label="Sarlavha (gul matn)" value={content.how.accent} onChange={(v) => setNested("how", (h) => ({ ...h, accent: v }))} />
          <Field label="Ta'rif" value={content.how.subtitle} onChange={(v) => setNested("how", (h) => ({ ...h, subtitle: v }))} />
          {content.how.steps.map((step, i) => (
            <Card key={i} index={i} onRemove={() => setNested("how", (h) => ({ ...h, steps: h.steps.filter((_, j) => j !== i) }))}>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Raqam (01…)" value={step.n} onChange={(v) => setNested("how", (h) => ({ ...h, steps: h.steps.map((x, j) => (j === i ? { ...x, n: v } : x)) }))} />
                <Field label="Sarlavha" value={step.title} onChange={(v) => setNested("how", (h) => ({ ...h, steps: h.steps.map((x, j) => (j === i ? { ...x, title: v } : x)) }))} />
                <Field label="Matn" value={step.body} onChange={(v) => setNested("how", (h) => ({ ...h, steps: h.steps.map((x, j) => (j === i ? { ...x, body: v } : x)) }))} />
              </div>
            </Card>
          ))}
          <div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setNested("how", (h) => ({ ...h, steps: [...h.steps, { n: `${String(h.steps.length + 1).padStart(2, "0")}`, title: "", body: "" }] }))}
            >
              <Plus className="h-4 w-4" />
              Qadam qo‘shish
            </button>
          </div>
        </Section>

        <Section title="Imkoniyatlar" hint={SECTION_LABELS[4].hint}>
          <Field label="Kichik chiziq (script)" value={content.features.script} onChange={(v) => setNested("features", (f) => ({ ...f, script: v }))} />
          <Field label="Sarlavha" value={content.features.title} onChange={(v) => setNested("features", (f) => ({ ...f, title: v }))} />
          <Field label="Sarlavha (gul matn)" value={content.features.accent} onChange={(v) => setNested("features", (f) => ({ ...f, accent: v }))} />
          {content.features.items.map((item, i) => (
            <Card key={i} index={i} onRemove={() => setNested("features", (f) => ({ ...f, items: f.items.filter((_, j) => j !== i) }))}>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Belgi (ikona)</span>
                  <select
                    className="input"
                    value={item.icon}
                    onChange={(e) =>
                      setNested("features", (f) => ({ ...f, items: f.items.map((x, j) => (j === i ? { ...x, icon: e.target.value as never } : x)) }))
                    }
                  >
                    {FEATURE_ICON_KEYS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </label>
                <Field label="Sarlavha" value={item.title} onChange={(v) => setNested("features", (f) => ({ ...f, items: f.items.map((x, j) => (j === i ? { ...x, title: v } : x)) }))} />
                <Field label="Matn" value={item.body} onChange={(v) => setNested("features", (f) => ({ ...f, items: f.items.map((x, j) => (j === i ? { ...x, body: v } : x)) }))} />
              </div>
            </Card>
          ))}
          <div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setNested("features", (f) => ({ ...f, items: [...f.items, { icon: "heart", title: "", body: "" }] }))}
            >
              <Plus className="h-4 w-4" />
              Imkoniyat qo‘shish
            </button>
          </div>
        </Section>

        <Section title="Sovg'a / tuhfa" hint={SECTION_LABELS[5].hint}>
          <Field label="Kichik chiziq (script)" value={content.gift.script} onChange={(v) => setNested("gift", (g) => ({ ...g, script: v }))} />
          <Field label="Sarlavha" value={content.gift.title} onChange={(v) => setNested("gift", (g) => ({ ...g, title: v }))} />
          <Field label="Sarlavha (gul matn)" value={content.gift.accent} onChange={(v) => setNested("gift", (g) => ({ ...g, accent: v }))} />
          <Field label="Ta'rif" value={content.gift.subtitle} textarea onChange={(v) => setNested("gift", (g) => ({ ...g, subtitle: v }))} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="O'lchov birligi (masalan: ta taklifnoma)" value={content.gift.offerCountSuffix} onChange={(v) => setNested("gift", (g) => ({ ...g, offerCountSuffix: v }))} />
            <Field label="Cheksiz o'rnidagi so'z" value={content.gift.unlimitedLabel} onChange={(v) => setNested("gift", (g) => ({ ...g, unlimitedLabel: v }))} />
            <Field label="Bepul qo'shimchasi (tasi BEPUL)" value={content.gift.freeCountSuffix} onChange={(v) => setNested("gift", (g) => ({ ...g, freeCountSuffix: v }))} />
            <Field label="Bepul bo'lmasa yozuv (sevgi bilan)" value={content.gift.loveLabel} onChange={(v) => setNested("gift", (g) => ({ ...g, loveLabel: v }))} />
            <Field label="&quot;To'laysiz&quot;" value={content.gift.payLabel} onChange={(v) => setNested("gift", (g) => ({ ...g, payLabel: v }))} />
            <Field label="&quot;Olasiz&quot;" value={content.gift.getLabel} onChange={(v) => setNested("gift", (g) => ({ ...g, getLabel: v }))} />
            <Field label="Maxsus aloqa" value={content.gift.customLabel} onChange={(v) => setNested("gift", (g) => ({ ...g, customLabel: v }))} />
            <Field label="Yorliq (Eng qulay)" value={content.gift.badge} onChange={(v) => setNested("gift", (g) => ({ ...g, badge: v }))} />
          </div>
          {content.gift.offers.map((offer, i) => (
            <Card key={offer.id} index={i} onRemove={() => setNested("gift", (g) => ({ ...g, offers: g.offers.filter((_, j) => j !== i) }))}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Nomi" value={offer.title} onChange={(v) => setNested("gift", (g) => ({ ...g, offers: g.offers.map((x, j) => (j === i ? { ...x, title: v } : x)) }))} />
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Belgi (ikona)</span>
                  <select
                    className="input"
                    value={offer.icon}
                    onChange={(e) => setNested("gift", (g) => ({ ...g, offers: g.offers.map((x, j) => (j === i ? { ...x, icon: e.target.value as never } : x)) }))}
                  >
                    {FEATURE_ICON_KEYS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </label>
                <Field label="Taklifnoma soni (bo'sh = Cheksiz)" type="number" value={offer.guests ?? ""} onChange={(v) => setNested("gift", (g) => ({ ...g, offers: g.offers.map((x, j) => (j === i ? { ...x, guests: v === "" ? null : Number(v) } : x)) }))} />
                <Field label="Bepul soni (bo'sh = yo'q)" type="number" value={offer.free ?? ""} onChange={(v) => setNested("gift", (g) => ({ ...g, offers: g.offers.map((x, j) => (j === i ? { ...x, free: v === "" ? null : Number(v) } : x)) }))} />
                <label className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    checked={!!offer.featured}
                    onChange={(e) => setNested("gift", (g) => ({ ...g, offers: g.offers.map((x, j) => (j === i ? { ...x, featured: e.target.checked } : x)) }))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                  />
                  <span className="text-sm text-slate-700">Yorliqli (maxsus) karta</span>
                </label>
                <Field label="Tushuntirish matni" value={offer.note} textarea onChange={(v) => setNested("gift", (g) => ({ ...g, offers: g.offers.map((x, j) => (j === i ? { ...x, note: v } : x)) }))} />
              </div>
            </Card>
          ))}
          <div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setNested("gift", (g) => ({ ...g, offers: [...g.offers, { id: String(Date.now()), guests: 10, free: 5, icon: "heart", title: "", note: "" }] }))}
            >
              <Plus className="h-4 w-4" />
              Taklif qo‘shish
            </button>
          </div>
        </Section>

        <Section title="Narxlar" hint={SECTION_LABELS[6].hint}>
          <Field label="Kichik chiziq (script)" value={content.pricing.script} onChange={(v) => setNested("pricing", (p) => ({ ...p, script: v }))} />
          <Field label="Sarlavha" value={content.pricing.title} onChange={(v) => setNested("pricing", (p) => ({ ...p, title: v }))} />
          <Field label="Ta'rif" value={content.pricing.subtitle} onChange={(v) => setNested("pricing", (p) => ({ ...p, subtitle: v }))} />
          <Field label="Ommabop yorlig'i" value={content.pricing.popularBadge} onChange={(v) => setNested("pricing", (p) => ({ ...p, popularBadge: v }))} />
          <Field label="Kirish matni ({count} o'rnida son)" value={content.pricing.accessNote} onChange={(v) => setNested("pricing", (p) => ({ ...p, accessNote: v }))} />
          <Field label="Tugma matni" value={content.pricing.cta} onChange={(v) => setNested("pricing", (p) => ({ ...p, cta: v }))} />
          <Field label="Tugma manzili" value={content.pricing.ctaHref} onChange={(v) => setNested("pricing", (p) => ({ ...p, ctaHref: v }))} />
        </Section>

        <Section title="Bog'lanish" hint={SECTION_LABELS[7].hint}>
          <Field label="Kichik chiziq (script)" value={content.contact.script} onChange={(v) => setNested("contact", (c) => ({ ...c, script: v }))} />
          <Field label="Sarlavha" value={content.contact.title} onChange={(v) => setNested("contact", (c) => ({ ...c, title: v }))} />
          <Field label="Sarlavha (gul matn)" value={content.contact.accent} onChange={(v) => setNested("contact", (c) => ({ ...c, accent: v }))} />
          <Field label="Ta'rif" value={content.contact.subtitle} onChange={(v) => setNested("contact", (c) => ({ ...c, subtitle: v }))} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Telefon yorlig'i" value={content.contact.phoneLabel} onChange={(v) => setNested("contact", (c) => ({ ...c, phoneLabel: v }))} />
            <Field label="Telefon raqam" value={content.contact.phone} onChange={(v) => setNested("contact", (c) => ({ ...c, phone: v }))} />
            <Field label="Telefon manzili (tel:…)" value={content.contact.phoneHref} onChange={(v) => setNested("contact", (c) => ({ ...c, phoneHref: v }))} />
            <Field label="Telegram yorlig'i" value={content.contact.telegramLabel} onChange={(v) => setNested("contact", (c) => ({ ...c, telegramLabel: v }))} />
            <Field label="Telegram manzili" value={content.contact.telegramHref} onChange={(v) => setNested("contact", (c) => ({ ...c, telegramHref: v }))} />
            <Field label="WhatsApp yorlig'i" value={content.contact.whatsappLabel} onChange={(v) => setNested("contact", (c) => ({ ...c, whatsappLabel: v }))} />
            <Field label="WhatsApp manzili" value={content.contact.whatsappHref} onChange={(v) => setNested("contact", (c) => ({ ...c, whatsappHref: v }))} />
          </div>
        </Section>

        <Section title="Modal oyna" hint={SECTION_LABELS[8].hint}>
          <Field label="Sarlavha" value={content.modal.title} onChange={(v) => setNested("modal", (m) => ({ ...m, title: v }))} />
          <Field label="Matn" value={content.modal.body} textarea onChange={(v) => setNested("modal", (m) => ({ ...m, body: v }))} />
          <Field label="Pastki maslahat" value={content.modal.hint} onChange={(v) => setNested("modal", (m) => ({ ...m, hint: v }))} />
        </Section>

        <Section title="Footer" hint={SECTION_LABELS[9].hint}>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Brend (1-qism)" value={content.footer.brand} onChange={(v) => setNested("footer", (f) => ({ ...f, brand: v }))} />
            <Field label="Ajratuvchi (-)" value={content.footer.brandAccent} onChange={(v) => setNested("footer", (f) => ({ ...f, brandAccent: v }))} />
            <Field label="Brend (2-qism)" value={content.footer.brandSuffix} onChange={(v) => setNested("footer", (f) => ({ ...f, brandSuffix: v }))} />
          </div>
          <Field label="Tagline" value={content.footer.tagline} textarea onChange={(v) => setNested("footer", (f) => ({ ...f, tagline: v }))} />
          <Field label="Mahsulot bo'limi nomi" value={content.footer.productTitle} onChange={(v) => setNested("footer", (f) => ({ ...f, productTitle: v }))} />
          {content.footer.productLinks.map((link, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1">
                <Field label="Mahsulot havola — nom" value={link.label} onChange={(v) => setNested("footer", (f) => ({ ...f, productLinks: f.productLinks.map((x, j) => (j === i ? { ...x, label: v } : x)) }))} />
              </div>
              <div className="flex-1">
                <Field label="Mahsulot havola — manzil" value={link.href} onChange={(v) => setNested("footer", (f) => ({ ...f, productLinks: f.productLinks.map((x, j) => (j === i ? { ...x, href: v } : x)) }))} />
              </div>
              <button type="button" onClick={() => setNested("footer", (f) => ({ ...f, productLinks: f.productLinks.filter((_, j) => j !== i) }))} className="mb-1.5 text-slate-400 hover:text-red-600" title="O'chirish">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setNested("footer", (f) => ({ ...f, productLinks: [...f.productLinks, { label: "", href: "/" }] }))}
            >
              <Plus className="h-4 w-4" />
              Havola qo‘shish
            </button>
          </div>
          <Field label="Kompaniya bo'limi nomi" value={content.footer.companyTitle} onChange={(v) => setNested("footer", (f) => ({ ...f, companyTitle: v }))} />
          {content.footer.companyLinks.map((link, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1">
                <Field label="Kompaniya havola — nom" value={link.label} onChange={(v) => setNested("footer", (f) => ({ ...f, companyLinks: f.companyLinks.map((x, j) => (j === i ? { ...x, label: v } : x)) }))} />
              </div>
              <div className="flex-1">
                <Field label="Kompaniya havola — manzil" value={link.href} onChange={(v) => setNested("footer", (f) => ({ ...f, companyLinks: f.companyLinks.map((x, j) => (j === i ? { ...x, href: v } : x)) }))} />
              </div>
              <button type="button" onClick={() => setNested("footer", (f) => ({ ...f, companyLinks: f.companyLinks.filter((_, j) => j !== i) }))} className="mb-1.5 text-slate-400 hover:text-red-600" title="O'chirish">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setNested("footer", (f) => ({ ...f, companyLinks: [...f.companyLinks, { label: "", href: "/" }] }))}
            >
              <Plus className="h-4 w-4" />
              Havola qo‘shish
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Ijtimoiy tarmoqlar nomi" value={content.footer.socialTitle} onChange={(v) => setNested("footer", (f) => ({ ...f, socialTitle: v }))} />
            <Field label="&quot;made with love&quot; yozuvi" value={content.footer.madeWith} onChange={(v) => setNested("footer", (f) => ({ ...f, madeWith: v }))} />
            <Field label="Mualliflik huquqi (© …)" value={content.footer.rights} textarea onChange={(v) => setNested("footer", (f) => ({ ...f, rights: v }))} />
          </div>
        </Section>
      </div>

      <div className="sticky bottom-4 mt-6 flex justify-end">
        <button type="submit" className="btn shadow-lg" disabled={pending}>
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {pending ? "Saqlanmoqda…" : saved ? "Saqlandi" : "Saqlash"}
        </button>
      </div>
    </form>
  );
}