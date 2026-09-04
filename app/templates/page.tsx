"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { THEME_PRESETS, type ThemeDefinition } from "@/lib/themes";
import { DEMO_INVITATION } from "@/lib/demoInvitation";
import { PRICE_TIER_LABELS } from "@/lib/types";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

function TemplateCard({ theme }: { theme: ThemeDefinition }) {
  const router = useRouter();
  const invitation = { ...DEMO_INVITATION, template_id: theme.id };

  function openDemo() {
    router.push(`/templates/${theme.id}`);
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openDemo}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openDemo();
      }}
      className="group flex cursor-pointer flex-col items-center gap-3"
    >
      <div className="relative h-[320px] w-[180px] overflow-hidden rounded-[1.3rem] border-[4px] border-[#2E2A27] bg-[#2E2A27] shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl sm:h-[480px] sm:w-[260px] sm:rounded-[1.6rem] sm:border-[5px] sm:shadow-2xl">
        <div className="absolute left-1/2 top-0 z-50 h-3 w-16 -translate-x-1/2 rounded-b-lg bg-[#2E2A27] sm:h-4 sm:w-20 sm:rounded-b-xl" />
        <div className="pointer-events-none h-full w-full overflow-y-auto bg-white">
          <TemplateRenderer invitation={invitation} musicTrack={null} previewMode />
        </div>
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#2E2A27] shadow-lg sm:px-5 sm:py-2.5 sm:text-sm">
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            To&apos;liq ko&apos;rish
          </span>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-[#2E2A27]">{theme.name}</h3>
        <p className="text-xs text-[#2E2A27]/45">{PRICE_TIER_LABELS[theme.minPriceTier]}</p>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const [filter, setFilter] = useState<string>("all");

  const families = [...new Set(THEME_PRESETS.map((t) => t.family))];
  const filtered = filter === "all" ? THEME_PRESETS : THEME_PRESETS.filter((t) => t.family === filter);

  return (
    <div className="min-h-screen bg-[#FDFBFB] font-sans text-[#2E2A27] antialiased selection:bg-[#D69E82] selection:text-[#FDFBFB]">
      <SiteHeader showCta={false} />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <h1 className="font-display text-2xl text-[#2E2A27] sm:text-3xl lg:text-4xl">
              To&apos;y taklifnomasi shablonlari
            </h1>
            <p className="mt-3 text-sm text-[#2E2A27]/55 sm:mt-4 sm:text-base">
              O&apos;zingizga yoqqan shablonni tanlang — to&apos;liq ko&apos;rish uchun kartaga bosing
            </p>
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10 sm:gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-2 text-xs font-medium transition sm:px-5 sm:text-sm ${
                filter === "all"
                  ? "bg-[#2E2A27] text-[#FDFBFB] shadow-md"
                  : "border border-[#2E2A27]/15 text-[#2E2A27]/60 hover:bg-[#2E2A27]/5"
              }`}
            >
              Barchasi
            </button>
            {families.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition sm:px-5 sm:text-sm ${
                  filter === f
                    ? "bg-[#2E2A27] text-[#FDFBFB] shadow-md"
                    : "border border-[#2E2A27]/15 text-[#2E2A27]/60 hover:bg-[#2E2A27]/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 justify-items-center gap-10 sm:gap-12 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((theme) => (
              <TemplateCard key={theme.id} theme={theme} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
