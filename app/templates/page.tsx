"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { THEME_PRESETS, type ThemeDefinition } from "@/lib/themes";
import { DEMO_INVITATION } from "@/lib/demoInvitation";

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
      className="group flex cursor-pointer flex-col items-center gap-4"
    >
      <div className="relative h-[580px] w-[320px] overflow-hidden rounded-[2rem] border-[6px] border-gray-800 bg-gray-800 shadow-2xl transition-transform group-hover:scale-[1.02]">
        <div className="absolute left-1/2 top-0 z-50 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-gray-800" />
        <div className="pointer-events-none h-full w-full overflow-y-auto bg-white">
          <TemplateRenderer invitation={invitation} musicTrack={null} previewMode />
        </div>
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-lg">
            <Eye className="h-4 w-4" />
            To&apos;liq ko&apos;rish
          </span>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">{theme.name}</h3>
        <p className="text-sm text-gray-500">{theme.family}</p>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const [filter, setFilter] = useState<string>("all");

  const families = [...new Set(THEME_PRESETS.map((t) => t.family))];
  const filtered = filter === "all" ? THEME_PRESETS : THEME_PRESETS.filter((t) => t.family === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            To&apos;y taklifnomasi shablonlari
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            O&apos;zingizga yoqqan shablonni tanlang — to&apos;liq ko&apos;rish uchun kartaga bosing
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              filter === "all"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-100 border"
            }`}
          >
            Barchasi
          </button>
          {families.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 justify-items-center">
          {filtered.map((theme) => (
            <TemplateCard key={theme.id} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
}
