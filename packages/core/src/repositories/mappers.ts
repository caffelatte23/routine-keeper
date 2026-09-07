import type { Completion, GroupName, Routine, RoutineStep } from '../domain';
import type {
  CompletionRow,
  MetaRow,
  RoutineRow,
  RoutineStepRow,
} from '../schema';

export function toRoutine(row: RoutineRow): Routine {
  return {
    id: row.id,
    group: row.group as GroupName,
    icon: row.icon,
    windowLabel: row.windowLabel,
    startTime: row.startTime,
    durationLabel: row.durationLabel,
    activeDays: JSON.parse(row.activeDays) as boolean[],
    sortOrder: row.sortOrder,
  };
}

export function toStep(row: RoutineStepRow): RoutineStep {
  return {
    id: row.id,
    routineId: row.routineId,
    name: row.name,
    detail: row.detail,
    minsLabel: row.minsLabel,
    timeLabel: row.timeLabel,
    sortOrder: row.sortOrder,
    notify: row.notify === 1,
    notifyAt: row.notifyAt,
  };
}

export function toCompletion(row: CompletionRow): Completion {
  return {
    id: row.id,
    stepId: row.stepId,
    date: row.date,
    completedAt: row.completedAt,
  };
}

export function metaRowsToMap(rows: MetaRow[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const r of rows) {
    out[r.key] = r.value;
  }
  return out;
}
