import {
  weekdayMonday0,
  type IsoDate,
  type Completion,
  type RoutineWithSteps,
  type TodayTask,
} from '../domain';
import { computeStepStreak } from './streak';

export interface TodayInput {
  routines: RoutineWithSteps[];
  /** Completions at least up to `date`; extra history is harmless. */
  completions: Completion[];
  date: IsoDate;
}

/**
 * The list the Today screen renders: every step whose routine is scheduled on
 * `date`, with its done state and current streak. Order follows the routines'
 * and steps' `sortOrder` (the repository already returns them sorted).
 */
export function buildTodayTasks({
  routines,
  completions,
  date,
}: TodayInput): TodayTask[] {
  const wd = weekdayMonday0(date);
  const doneToday = new Set(
    completions.filter((c) => c.date === date).map((c) => c.stepId),
  );

  const tasks: TodayTask[] = [];
  for (const r of routines) {
    if (r.activeDays[wd] !== true) {
      continue;
    }
    for (const s of r.steps) {
      tasks.push({
        step: s,
        group: r.group,
        time: s.timeLabel ?? r.startTime,
        streak: computeStepStreak(s.id, r.activeDays, completions, date),
        done: doneToday.has(s.id),
      });
    }
  }
  return tasks;
}
