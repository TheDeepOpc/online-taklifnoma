"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { cleanupDiscordMedia } from "@/app/admin/(app)/media/actions";

/**
 * Zaxira tozalash: taklifnoma yaratilmay qolgan yoki sahifa yopilganda
 * o'chmay qolgan Discord fayllari. Bot kanalni ko'rib chiqadi va hech bir
 * taklifnoma/musiqa ishlatmayotgan, 24 soatdan eski yuklamalarni o'chiradi.
 */
export function MediaCleanupButton() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleClick() {
    if (!confirm("Hech qayerda ishlatilmayotgan, 24 soatdan eski fayllar Discord'dan o'chiriladi. Davom etasizmi?")) {
      return;
    }
    startTransition(async () => {
      const result = await cleanupDiscordMedia();
      setMessage(
        result.ok
          ? `${result.scanned} ta fayl tekshirildi, ${result.deleted} tasi o'chirildi.`
          : result.error,
      );
    });
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900">Discord CDN fayllari</p>
        <p className="text-xs text-slate-500">
          Saqlanmay qolgan rasm va musiqalarni tozalaydi. Ishlatilayotgan fayllarga tegmaydi.
        </p>
      </div>
      <button type="button" onClick={handleClick} disabled={pending} className="btn-secondary text-sm">
        <Trash2 className="h-4 w-4" />
        {pending ? "Tozalanmoqda…" : "Keraksiz fayllarni tozalash"}
      </button>
      {message && <p className="w-full text-xs text-slate-600">{message}</p>}
    </div>
  );
}
