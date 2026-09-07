import {
  addDays,
  dateRange,
  type IsoDate,
  type Completion,
  type RoutineWithSteps,
} from '../domain';
import { doneSet, isDone, scheduledStepIds } from './schedule';

export interface HeatmapInput {
  routines: RoutineWithSteps[];
  completions: Completion[];
  endDate: IsoDate;
  days: number;
}

/**
 * Per-day intensity for the last `days` days ending on `endDate`, oldest first:
 * `0` nothing scheduled or nothing done, `1` some done, `2` all scheduled done.
 */
export function buildHeatmap({
  routines,
  completions,
  endDate,
  days,
}: HeatmapInput): number[] {
  const done = doneSet(completions);
  const start = addDays(endDate, -(days - 1));
  return dateRange(start, endDate).map((date) => {
    const scheduled = scheduledStepIds(routines, date);
    if (scheduled.length === 0) {
      return 0;
    }
    const doneCount = scheduled.filter((id) => isDone(done, id, date)).length;
    if (doneCount === 0) {
      return 0;
    }
    return doneCount >= scheduled.length ? 2 : 1;
  });
}
