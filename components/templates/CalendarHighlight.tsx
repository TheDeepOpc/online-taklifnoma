import { HeartIcon } from "./icons";

const WEEKDAYS = ["DU", "SE", "CHOR", "PAY", "JU", "SHA", "YAK"];

export function CalendarHighlight({
  date,
  className,
  gridClassName,
  cellClassName,
  headClassName,
  emptyClassName,
  highlightClassName,
  heartSrc,
  weekOnly = false,
  weekdays = WEEKDAYS,
}: {
  date: string;
  className?: string;
  /** Agar berilsa, inline grid uslublari o'rniga shu klass ishlatiladi. */
  gridClassName?: string;
  cellClassName?: string;
  headClassName?: string;
  emptyClassName?: string;
  highlightClassName?: string;
  /** To'y kuni uchun SVG yurak o'rniga rasm (background) ishlatiladi. */
  heartSrc?: string;
  /** Butun oy o'rniga faqat to'y kuni tushgan haftani ko'rsatish (MILLIY). */
  weekOnly?: boolean;
  /** Hafta kunlari yorliqlari — dushanbadan boshlanadi. */
  weekdays?: readonly string[];
}) {
  const d = new Date(`${date}T00:00:00`);
  const year = d.getFullYear();
  const month = d.getMonth();
  const dayOfMonth = d.getDate();

  const firstOfMonth = new Date(year, month, 1);
  // Dushanba = 0 boshlanadigan hafta indeksi
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let cells: (number | null)[];
  if (weekOnly) {
    // To'y kuni tushgan haftaning dushanbasidan yakshanbasigacha.
    const weekdayIndex = (d.getDay() + 6) % 7;
    cells = Array.from({ length: 7 }, (_, i) => {
      const day = dayOfMonth - weekdayIndex + i;
      return day >= 1 && day <= daysInMonth ? day : null;
    });
  } else {
    cells = [
      ...Array(leadingBlanks).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);
  }

  const gridStyle = gridClassName
    ? undefined
    : ({ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" } as const);
  const headStyle = gridClassName ? undefined : ({ fontSize: "0.7em" } as const);

  return (
    <div className={className}>
      <div className={gridClassName} style={gridStyle}>
        {weekdays.map((w) => (
          <span key={w} className={headClassName} style={headStyle}>
            {w}
          </span>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <span key={i} className={emptyClassName} />
          ) : day === dayOfMonth ? (
            <span key={i} className={highlightClassName} aria-label="To'y kuni">
              {heartSrc ? (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `url(${heartSrc}) center / contain no-repeat`,
                  }}
                />
              ) : (
                <HeartIcon className="h-[1.3em] w-[1.3em]" />
              )}
              <span>{day}</span>
            </span>
          ) : (
            <span key={i} className={cellClassName}>
              {day}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
