import type { Completion, RoutineStep, RoutineWithSteps } from '../domain';

let seq = 0;
export function nextId(prefix = 'id'): string {
  seq += 1;
  return `${prefix}-${seq}`;
}
export function resetIds(): void {
  seq = 0;
}

const EVERY_DAY = [true, true, true, true, true, true, true];
const WEEKDAYS = [true, true, true, true, true, false, false];
export { EVERY_DAY, WEEKDAYS };

export function aRoutine(
  over: Partial<RoutineWithSteps> = {},
): RoutineWithSteps {
  return {
    id: over.id ?? nextId('r'),
    group: over.group ?? '朝',
    icon: over.icon ?? 'Sun',
    windowLabel: over.windowLabel ?? '6:00 – 8:00',
    startTime: over.startTime ?? '6:00',
    durationLabel: over.durationLabel ?? '120分',
    activeDays: over.activeDays ?? [...EVERY_DAY],
    sortOrder: over.sortOrder ?? 0,
    steps: over.steps ?? [],
  };
}

export function aStep(
  routineId: string,
  over: Partial<RoutineStep> = {},
): RoutineStep {
  return {
    id: over.id ?? nextId('s'),
    routineId,
    name: over.name ?? 'step',
    detail: over.detail ?? '',
    minsLabel: over.minsLabel ?? '5分',
    timeLabel: over.timeLabel ?? null,
    sortOrder: over.sortOrder ?? 0,
    notify: over.notify ?? false,
    notifyAt: over.notifyAt ?? null,
  };
}

export function aCompletion(stepId: string, date: string): Completion {
  return { id: nextId('c'), stepId, date, completedAt: 0 };
}
