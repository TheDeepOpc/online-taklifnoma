import Link from "next/link";
import { LayoutDashboard, Music, LogOut, Plus, HeartHandshake, Palette } from "lucide-react";
import { signOut } from "./invitations/actions";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/music", label: "Musiqalar", icon: Music },
  { href: "/templates", label: "Shablonlar", icon: Palette, external: true },
];

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
      <aside className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 md:w-60 md:shrink-0 md:border-b-0 md:border-r md:px-5 md:py-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 px-1 text-slate-900">
          <HeartHandshake className="h-5 w-5 text-indigo-600" />
          <span className="font-display text-lg">Taklifnoma</span>
        </Link>

        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {NAV_ITEMS.map(({ href, label, icon: Icon, external }) => (
            <Link
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <Link
            href="/admin/invitations/new"
            className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 md:mt-2"
          >
            <Plus className="h-4 w-4" />
            Yangi taklifnoma
          </Link>
        </nav>

        <form action={signOut} className="md:mt-auto">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Chiqish
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
