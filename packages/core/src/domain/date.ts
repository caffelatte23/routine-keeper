/** Injectable clock so date-dependent logic stays unit-testable. */
export interface Clock {
  now(): number; // epoch milliseconds
}

export const systemClock: Clock = { now: () => Date.now() };

/** A local calendar date, formatted `YYYY-MM-DD`. */
export type IsoDate = string;

export function toIsoDate(d: Date): IsoDate {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayIso(clock: Clock): IsoDate {
  return toIsoDate(new Date(clock.now()));
}

/**
 * Weekday index with Monday = 0 … Sunday = 6 — the order `Routine.activeDays`
 * uses (月火水木金土日).
 */
export function weekdayMonday0(date: IsoDate): number {
  const js = new Date(`${date}T00:00:00`).getDay(); // Sun = 0 … Sat = 6
  return (js + 6) % 7;
}

export function addDays(date: IsoDate, delta: number): IsoDate {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + delta);
  return toIsoDate(d);
}

/** Whole days from `from` to `to` (negative if `to` is earlier). */
export function daysBetween(from: IsoDate, to: IsoDate): number {
  const a = new Date(`${from}T00:00:00`).getTime();
  const b = new Date(`${to}T00:00:00`).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** Inclusive list of dates from `from` to `to`, oldest first. */
export function dateRange(from: IsoDate, to: IsoDate): IsoDate[] {
  const out: IsoDate[] = [];
  const span = daysBetween(from, to);
  for (let i = 0; i <= span; i += 1) {
    out.push(addDays(from, i));
  }
  return out;
}

export function daysInMonth(year: number, month1: number): number {
  return new Date(year, month1, 0).getDate(); // month1 is 1-based
}
