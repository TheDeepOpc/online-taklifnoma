import { createClient } from "@/lib/supabase/server";
import { deleteInvitation } from "../invitations/actions";
import { StatsCards } from "@/components/admin/StatsCards";
import { InvitationList } from "@/components/admin/InvitationList";
import type { Invitation } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: invitations } = await supabase
    .from("invitations")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (invitations as Invitation[]) ?? [];
  const paidCount = list.filter((i) => i.is_paid).length;
  const revenue = list
    .filter((i) => i.is_paid)
    .reduce((sum, i) => sum + Number(i.price_tier), 0);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Dashboard</h1>

      <StatsCards
        total={list.length}
        paidCount={paidCount}
        unpaidCount={list.length - paidCount}
        revenue={revenue}
      />

      <InvitationList invitations={list} onDelete={deleteInvitation} />
    </div>
  );
}
