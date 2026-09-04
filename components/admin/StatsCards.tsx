import { Users, CheckCircle2, Clock, Wallet } from "lucide-react";
import { formatSom } from "@/lib/format";

export function StatsCards({
  total,
  paidCount,
  unpaidCount,
  revenue,
}: {
  total: number;
  paidCount: number;
  unpaidCount: number;
  revenue: number;
}) {
  const stats = [
    { label: "Jami taklifnoma", value: total, icon: Users, accent: "text-indigo-600 bg-indigo-50" },
    { label: "To'langan", value: paidCount, icon: CheckCircle2, accent: "text-green-600 bg-green-50" },
    { label: "To'lanmagan", value: unpaidCount, icon: Clock, accent: "text-amber-600 bg-amber-50" },
    { label: "Umumiy tushum", value: formatSom(revenue), icon: Wallet, accent: "text-slate-700 bg-slate-100" },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, accent }) => (
        <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-xl font-semibold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
