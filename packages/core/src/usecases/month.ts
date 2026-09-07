import {
  daysInMonth,
  weekdayMonday0,
  type DayStatus,
  type IsoDate,
  type Completion,
  type RoutineWithSteps,
} from '../domain';
import { doneSet, isDone, scheduledStepIds } from './schedule';

export interface MonthInput {
  routines: RoutineWithSteps[];
  completions: Completion[];
  year: number;
  month1: number; // 1-12
  today: IsoDate;
}

export interface MonthResult {
  /** Weekday of the 1st (Monday=0), for leading blanks in the calendar grid. */
  firstWeekday: number;
  /** Status per day; index 0 === the 1st. */
  statuses: DayStatus[];
  /** Count of `full` days so far this month. */
  fullDays: number;
}

function isoOf(year: number, month1: number, day: number): IsoDate {
  return `${year}-${String(month1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Per-day completion status for a calendar month. */
export function buildMonthStatus({
  routines,
  completions,
  year,
  month1,
  today,
}: MonthInput): MonthResult {
  const done = doneSet(completions);
  const total = daysInMonth(year, month1);
  const statuses: DayStatus[] = [];
  let fullDays = 0;

  for (let day = 1; day <= total; day += 1) {
    const date = isoOf(year, month1, day);
    if (date > today) {
      statuses.push('none');
      continue;
    }
    const scheduled = scheduledStepIds(routines, date);
    if (scheduled.length === 0) {
      statuses.push('none');
      continue;
    }
    const doneCount = scheduled.filter((id) => isDone(done, id, date)).length;
    if (doneCount >= scheduled.length) {
      statuses.push('full');
      fullDays += 1;
    } else if (doneCount > 0) {
      statuses.push('partial');
    } else {
      statuses.push('missed');
    }
  }

  return {
    firstWeekday: weekdayMonday0(isoOf(year, month1, 1)),
    statuses,
    fullDays,
  };
}
