"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, ExternalLink } from "lucide-react";
import { CopyLinkButton } from "./CopyLinkButton";
import { PRICE_TIER_LABELS, type Invitation } from "@/lib/types";

type StatusFilter = "all" | "paid" | "unpaid";

export function InvitationList({
  invitations,
  onDelete,
}: {
  invitations: Invitation[];
  onDelete: (id: string) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return invitations.filter((invitation) => {
      const matchesSearch =
        !term ||
        invitation.groom_name.toLowerCase().includes(term) ||
        invitation.bride_name.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "paid" && invitation.is_paid) ||
        (statusFilter === "unpaid" && !invitation.is_paid);
      return matchesSearch && matchesStatus;
    });
  }, [invitations, search, statusFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism bo'yicha qidirish..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-slate-300 p-1 text-sm">
          {(
            [
              { value: "all", label: "Hammasi" },
              { value: "paid", label: "To'langan" },
              { value: "unpaid", label: "To'lanmagan" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-md px-3 py-1 transition ${
                statusFilter === opt.value
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
          Hech narsa topilmadi.
        </p>
      )}

      <div className="space-y-3">
        {filtered.map((invitation) => (
          <div
            key={invitation.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-medium text-slate-900">
                {invitation.groom_name} &amp; {invitation.bride_name}
              </p>
              <p className="text-sm text-slate-500">
                {PRICE_TIER_LABELS[invitation.price_tier]} ·{" "}
                {invitation.is_paid ? (
                  <span className="text-green-600">To&apos;langan</span>
                ) : (
                  <span className="text-amber-600">To&apos;lanmagan</span>
                )}{" "}
                · {invitation.wedding_date}
              </p>
              <p className="text-xs text-slate-400">/t/{invitation.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <CopyLinkButton path={`/t/${invitation.slug}`} />
              <Link
                href={`/t/${invitation.slug}`}
                target="_blank"
                className="btn-secondary"
                title="Ko'rish"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                href={`/admin/invitations/${invitation.id}/edit`}
                className="btn-secondary"
                title="Tahrirlash"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => onDelete(invitation.id)}
                className="btn-secondary text-red-600"
                title="O'chirish"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
