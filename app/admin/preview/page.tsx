import type { Metadata } from "next";
import { InvitationPreviewCanvas } from "@/components/admin/InvitationPreviewCanvas";

export const metadata: Metadata = { title: "Taklifnoma — jonli ko‘rish", robots: { index: false, follow: false } };

export default function AdminPreviewPage() {
  return <InvitationPreviewCanvas />;
}
