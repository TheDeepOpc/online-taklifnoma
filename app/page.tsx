import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-stone-50 to-amber-50 px-4 text-center">
      <p className="font-display text-4xl text-stone-800 sm:text-5xl">
        Onlayn to&apos;y taklifnomasi
      </p>
      <p className="max-w-md text-stone-600">
        Kelin-kuyov uchun romantik, musiqali onlayn taklifnoma yarating va bir havola orqali
        mehmonlaringizga ulashing.
      </p>
      <Link href="/admin/login" className="btn">
        Admin panelga kirish
      </Link>
    </main>
  );
}
