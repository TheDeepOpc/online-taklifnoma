/**
 * Admin sahifalari o'rtasida o'tishda darhol ko'rinadigan skelet.
 *
 * Bu sahifalar dinamik (har so'rovda bazadan o'qiladi), shuning uchun ma'lumot
 * kelguncha bir necha yuz millisekund ketadi. `loading.tsx` bo'lmasa brauzer
 * eski sahifada qotib turadi va "bosdim — hech nima bo'lmadi" hissi paydo
 * bo'ladi. Endi bosilishi bilan skelet chiqadi.
 */
export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-8 w-52 rounded-lg bg-slate-200" />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 h-3 w-20 rounded bg-slate-200" />
            <div className="h-6 w-24 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="mb-4 flex gap-3">
        <div className="h-10 flex-1 rounded-lg bg-slate-200" />
        <div className="h-10 w-56 rounded-lg bg-slate-200" />
      </div>

      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="space-y-2">
              <div className="h-4 w-44 rounded bg-slate-200" />
              <div className="h-3 w-64 rounded bg-slate-100" />
              <div className="h-3 w-28 rounded bg-slate-100" />
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((b) => (
                <div key={b} className="h-9 w-9 rounded-lg bg-slate-200" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
