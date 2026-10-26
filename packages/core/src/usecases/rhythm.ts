import {
  dateRange,
  type Completion,
  type IsoDate,
  type RoutineWithSteps,
} from '../domain';
import { doneSet, isDone, scheduledStepIds } from './schedule';

export interface RhythmInput {
  routines: RoutineWithSteps[];
  completions: Completion[];
  from: IsoDate;
  to: IsoDate; // inclusive
}

export interface Rhythm {
  /** Days where at least half of the scheduled steps were done. */
  kept: number;
  /** Days with something scheduled. */
  active: number;
  /** Days with nothing scheduled — planned rest, never counted against you. */
  rest: number;
}

/**
 * The forgiving replacement for a streak: how many scheduled days kept their
 * rhythm. Half the steps counts as a kept day; rest days are left out entirely.
 */
export function computeRhythm({
  routines,
  completions,
  from,
  to,
}: RhythmInput): Rhythm {
  const done = doneSet(completions);
  const out: Rhythm = { kept: 0, active: 0, rest: 0 };
  if (from > to) {
    return out;
  }
  for (const date of dateRange(from, to)) {
    const scheduled = scheduledStepIds(routines, date);
    if (scheduled.length === 0) {
      out.rest += 1;
      continue;
    }
    out.active += 1;
    const n = scheduled.filter((id) => isDone(done, id, date)).length;
    if (n * 2 >= scheduled.length) {
      out.kept += 1;
    }
  }
  return out;
}

/** 0–100, or `null` when nothing was scheduled. */
export function rhythmPercent({ kept, active }: Rhythm): number | null {
  return active === 0 ? null : Math.round((kept / active) * 100);
}
