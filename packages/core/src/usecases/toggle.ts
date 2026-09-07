import type { IsoDate } from '../domain';

export interface ToggleInput {
  stepId: string;
  date: IsoDate;
  done: boolean;
  /** Ids of every step scheduled today. */
  scheduledTodayStepIds: string[];
  /** Ids of steps already done today, BEFORE this toggle is applied. */
  doneTodayStepIds: string[];
  today: IsoDate;
  lastCelebratedDate: string | undefined;
}

export interface ToggleDecision {
  write: { stepId: string; date: IsoDate; done: boolean };
  /** True when this toggle completes the last of today's scheduled steps (once per day). */
  celebrate: boolean;
}

/**
 * Pure decision for "user toggled a task": what to persist, and whether to fire the
 * day-complete celebration. The caller performs the write and, on `celebrate`,
 * records `today` as the last celebrated date.
 */
export function decideToggle(input: ToggleInput): ToggleDecision {
  const done = new Set(input.doneTodayStepIds);
  if (input.done) {
    done.add(input.stepId);
  } else {
    done.delete(input.stepId);
  }

  const allDone =
    input.date === input.today &&
    input.scheduledTodayStepIds.length > 0 &&
    input.scheduledTodayStepIds.every((id) => done.has(id));

  return {
    write: { stepId: input.stepId, date: input.date, done: input.done },
    celebrate:
      input.done && allDone && input.lastCelebratedDate !== input.today,
  };
}
