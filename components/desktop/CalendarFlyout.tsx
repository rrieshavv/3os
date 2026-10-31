import { formatMonth } from "@/lib/time";

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CalendarGrid({ now }: { now: Date }) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = Array.from({ length: first }, () => null);
  for (let day = 1; day <= days; day += 1) cells.push(day);

  return (
    <div className="mt-3 grid grid-cols-7 gap-1 text-center">
      {weekdays.map((label) => (
        <span key={label} className="text-[10px] tracking-wide text-white/45 uppercase">
          {label}
        </span>
      ))}
      {cells.map((day, index) =>
        day === null ? (
          <span key={`empty-${index}`} />
        ) : (
          <span
            key={day}
            className={
              day === today
                ? "grid h-8 place-items-center rounded-full bg-[var(--accent)] text-xs font-semibold text-[var(--on-accent)]"
                : "grid h-8 place-items-center rounded-full text-xs text-white/80"
            }
          >
            {day}
          </span>
        ),
      )}
    </div>
  );
}

export function CalendarFlyout({ now }: { now: Date }) {
  return (
    <div className="flyout glass w-[280px] rounded-2xl p-4">
      <p className="text-sm font-medium">{formatMonth(now)}</p>
      <CalendarGrid now={now} />
    </div>
  );
}
