"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartHandshake } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("Email yoki parol noto'g'ri.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-2 text-slate-900">
          <HeartHandshake className="h-6 w-6 text-indigo-600" />
          <span className="font-display text-xl">Taklifnoma</span>
        </div>

        <h1 className="mb-1 text-xl font-semibold text-slate-800">Admin kirish</h1>
        <p className="mb-6 text-sm text-slate-500">Taklifnomalarni boshqarish paneli</p>

        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mb-4"
        />

        <label className="mb-1 block text-sm font-medium text-slate-700">Parol</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mb-4"
        />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn w-full">
          {loading ? "Kirilmoqda..." : "Kirish"}
        </button>
      </form>
    </main>
  );
}
