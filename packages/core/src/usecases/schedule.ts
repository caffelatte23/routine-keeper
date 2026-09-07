import {
  weekdayMonday0,
  type Completion,
  type IsoDate,
  type RoutineWithSteps,
} from '../domain';

/** Ids of every step scheduled on `date`, across all routines. */
export function scheduledStepIds(
  routines: RoutineWithSteps[],
  date: IsoDate,
): string[] {
  const wd = weekdayMonday0(date);
  const ids: string[] = [];
  for (const r of routines) {
    if (r.activeDays[wd] !== true) {
      continue;
    }
    for (const s of r.steps) {
      ids.push(s.id);
    }
  }
  return ids;
}

// Neither a uuid nor a 'YYYY-MM-DD' date contains '|', so it is a safe key separator.
const SEP = '|';

/** Set of `${stepId}|${date}` for O(1) "was this step done that day" lookups. */
export function doneSet(completions: Completion[]): Set<string> {
  return new Set(completions.map((c) => c.stepId + SEP + c.date));
}

export function isDone(
  done: Set<string>,
  stepId: string,
  date: IsoDate,
): boolean {
  return done.has(stepId + SEP + date);
}
