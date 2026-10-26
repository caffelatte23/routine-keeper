import type { GroupName } from '@routine-keeper/core';

/** '6:45' -> 405 (minutes since midnight). */
export function parseClock(label: string): number {
  const [h = 0, m = 0] = label.split(':').map(Number);
  return h * 60 + m;
}

/** '6:45 – 8:00' -> { start: 405, end: 480 }. A missing end means a 1-hour block. */
export function parseWindow(label: string): { start: number; end: number } {
  const [a = '0:00', b] = label.split(/\s*[–-]\s*/);
  const start = parseClock(a);
  return { start, end: b ? parseClock(b) : start + 60 };
}

/** '10分' -> 10 */
export function parseMins(label: string): number {
  return Number.parseInt(label, 10) || 0;
}

export interface PhaseTask {
  group: GroupName;
  done: boolean;
}

export interface PhaseWindow {
  group: GroupName;
  start: number;
  end: number;
}

/**
 * The routine Today should put up front: the first one, in day order, that
 * still has open steps and hasn't ended yet; failing that, any one with open
 * steps (an overdue morning is still worth surfacing). `null` = all done.
 */
export function pickFeatured(
  windows: PhaseWindow[],
  tasks: PhaseTask[],
  nowMin: number,
): GroupName | null {
  const open = windows.filter((w) =>
    tasks.some((t) => t.group === w.group && !t.done),
  );
  return (open.find((w) => w.end >= nowMin) ?? open[0])?.group ?? null;
}

/** 0..1 position of `min` on a 6:00–24:00 day bar. */
export function dayFraction(min: number): number {
  return Math.min(Math.max((min - 360) / (1440 - 360), 0), 1);
}

/** 134 -> '2:14' */
export function formatTimer(secs: number): string {
  const s = Math.max(secs, 0);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

/** activeDays (月..日) -> '毎日' / '平日' / '月水金' / 'おやすみ中' */
export function daysSummary(days: boolean[]): string {
  const on = days.filter(Boolean).length;
  if (on === 7) {
    return '毎日';
  }
  if (on === 0) {
    return 'おやすみ中';
  }
  if (on === 5 && days.slice(0, 5).every(Boolean)) {
    return '平日';
  }
  return DAY_LABELS.filter((_, i) => days[i]).join('');
}
