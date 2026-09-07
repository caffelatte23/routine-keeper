import {
  addDays,
  weekdayMonday0,
  type IsoDate,
  type Completion,
  type RoutineWithSteps,
} from '../domain';
import { doneSet, isDone, scheduledStepIds } from './schedule';

const MAX_LOOKBACK = 400;

/**
 * Consecutive scheduled days, counting back from `today`, on which the step was
 * completed. `today` gets a grace pass: if it is a scheduled day and not done yet,
 * the run through yesterday is returned rather than 0 (the day isn't over).
 */
export function computeStepStreak(
  stepId: string,
  activeDays: boolean[],
  completions: Completion[],
  today: IsoDate,
): number {
  const done = doneSet(completions);
  let streak = 0;
  let cursor = today;
  for (let i = 0; i < MAX_LOOKBACK; i += 1) {
    if (activeDays[weekdayMonday0(cursor)] === true) {
      if (isDone(done, stepId, cursor)) {
        streak += 1;
      } else if (cursor !== today) {
        break;
      }
    }
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/**
 * Consecutive days, counting back from `today`, on which every scheduled step was
 * completed. Days with no scheduled steps are transparent (neither count nor break).
 * `today` gets the same grace pass as {@link computeStepStreak}.
 */
export function computeGlobalStreak(
  routines: RoutineWithSteps[],
  completions: Completion[],
  today: IsoDate,
): number {
  const done = doneSet(completions);
  let streak = 0;
  let cursor = today;
  for (let i = 0; i < MAX_LOOKBACK; i += 1) {
    const scheduled = scheduledStepIds(routines, cursor);
    if (scheduled.length > 0) {
      const allDone = scheduled.every((id) => isDone(done, id, cursor));
      if (allDone) {
        streak += 1;
      } else if (cursor !== today) {
        break;
      }
    }
    cursor = addDays(cursor, -1);
  }
  return streak;
}
