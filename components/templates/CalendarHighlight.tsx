import { HeartIcon } from "./icons";

const WEEKDAYS = ["DU", "SE", "CHOR", "PAY", "JU", "SHA", "YAK"];

export function CalendarHighlight({
  date,
  className,
  cellClassName,
  headClassName,
  emptyClassName,
  highlightClassName,
}: {
  date: string;
  className?: string;
  cellClassName?: string;
  headClassName?: string;
  emptyClassName?: string;
  highlightClassName?: string;
}) {
  const d = new Date(`${date}T00:00:00`);
  const year = d.getFullYear();
  const month = d.getMonth();
  const dayOfMonth = d.getDate();

  const firstOfMonth = new Date(year, month, 1);
  // Dushanba = 0 boshlanadigan hafta indeksi
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className={className}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {WEEKDAYS.map((w) => (
          <span key={w} className={headClassName} style={{ fontSize: "0.7em" }}>
            {w}
          </span>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <span key={i} className={emptyClassName} />
          ) : day === dayOfMonth ? (
            <span key={i} className={highlightClassName} aria-label="To'y kuni">
              <HeartIcon className="h-[1.3em] w-[1.3em]" />
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
