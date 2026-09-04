"use client";

import { Lock, Check } from "lucide-react";
import { THEME_PRESETS, isThemeUnlocked, type ThemeDefinition } from "@/lib/themes";
import { PRICE_TIER_LABELS, type PriceTier } from "@/lib/types";

function getSwatchColors(theme: ThemeDefinition) {
  const base =
    theme.colors.cream ??
    theme.colors.ivory ??
    theme.colors.paper ??
    theme.colors.sand ??
    theme.colors["bg-mid"] ??
    theme.colors.bg ??
    "#eeeeee";
  const accent = theme.colors.gold ?? "#b08c4f";
  return { base, accent };
}

export function ThemePicker({
  priceTier,
  value,
  onChange,
}: {
  priceTier: PriceTier;
  value: string;
  onChange: (themeId: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {THEME_PRESETS.map((theme) => {
        const unlocked = isThemeUnlocked(theme.id, priceTier);
        const selected = theme.id === value;
        const { base, accent } = getSwatchColors(theme);

        return (
          <button
            key={theme.id}
            type="button"
            disabled={!unlocked}
            onClick={() => onChange(theme.id)}
            className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition ${
              selected
                ? "border-indigo-500 ring-2 ring-indigo-200"
                : "border-slate-200 hover:border-slate-300"
            } ${unlocked ? "" : "cursor-not-allowed opacity-50"}`}
          >
            {selected && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                <Check className="h-3 w-3" />
              </span>
            )}
            <span
              className="h-10 w-10 rounded-full border border-black/10"
              style={{ background: `linear-gradient(135deg, ${base}, ${accent})` }}
            />
            <span className="text-xs font-medium leading-tight text-slate-700">{theme.name}</span>
            {!unlocked && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                <Lock className="h-3 w-3" />
                {PRICE_TIER_LABELS[theme.minPriceTier]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
