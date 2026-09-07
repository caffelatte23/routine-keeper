import { and, asc, between, eq } from 'drizzle-orm';

import {
  weekdayMonday0,
  type IsoDate,
  type Completion,
  type Routine,
  type RoutineStep,
  type RoutineWithSteps,
} from '../domain';
import { completion, meta, routine, routineStep } from '../schema';
import { metaRowsToMap, toCompletion, toRoutine, toStep } from './mappers';

import type {
  CompletionRepo,
  MetaRepo,
  RepoDeps,
  Repositories,
  RoutineCreate,
  RoutineRepo,
  StepCreate,
} from './types';

const NOT_DELETED = 0;

export function createRepositories(deps: RepoDeps): Repositories {
  return {
    routines: createRoutineRepo(deps),
    completions: createCompletionRepo(deps),
    meta: createMetaRepo(deps),
  };
}

function createRoutineRepo({ db, clock, newId }: RepoDeps): RoutineRepo {
  const listRoutines = (): Routine[] =>
    db
      .select()
      .from(routine)
      .where(eq(routine.deleted, NOT_DELETED))
      .orderBy(asc(routine.sortOrder))
      .all()
      .map(toRoutine);

  const listSteps = (): RoutineStep[] =>
    db
      .select()
      .from(routineStep)
      .where(eq(routineStep.deleted, NOT_DELETED))
      .orderBy(asc(routineStep.sortOrder))
      .all()
      .map(toStep);

  const withSteps = (): RoutineWithSteps[] => {
    const steps = listSteps();
    return listRoutines().map((r) => ({
      ...r,
      steps: steps.filter((s) => s.routineId === r.id),
    }));
  };

  return {
    all: listRoutines,
    withSteps,

    activeOn(date: IsoDate): RoutineWithSteps[] {
      const wd = weekdayMonday0(date);
      return withSteps().filter((r) => r.activeDays[wd] === true);
    },

    create(input: RoutineCreate): Routine {
      const now = clock.now();
      const row = {
        id: newId(),
        group: input.group,
        icon: input.icon,
        windowLabel: input.windowLabel,
        startTime: input.startTime,
        durationLabel: input.durationLabel,
        activeDays: JSON.stringify(input.activeDays),
        sortOrder: input.sortOrder ?? 0,
        updatedAt: now,
        deleted: NOT_DELETED,
      };
      db.insert(routine).values(row).run();
      return toRoutine(row);
    },

    update(id, patch): void {
      const next: Record<string, unknown> = { updatedAt: clock.now() };
      if (patch.icon !== undefined) {
        next.icon = patch.icon;
      }
      if (patch.windowLabel !== undefined) {
        next.windowLabel = patch.windowLabel;
      }
      if (patch.startTime !== undefined) {
        next.startTime = patch.startTime;
      }
      if (patch.durationLabel !== undefined) {
        next.durationLabel = patch.durationLabel;
      }
      if (patch.activeDays !== undefined) {
        next.activeDays = JSON.stringify(patch.activeDays);
      }
      if (patch.sortOrder !== undefined) {
        next.sortOrder = patch.sortOrder;
      }
      db.update(routine).set(next).where(eq(routine.id, id)).run();
    },

    remove(id): void {
      db.update(routine)
        .set({ deleted: 1, updatedAt: clock.now() })
        .where(eq(routine.id, id))
        .run();
    },

    addStep(input: StepCreate): RoutineStep {
      const now = clock.now();
      const row = {
        id: newId(),
        routineId: input.routineId,
        name: input.name,
        detail: input.detail ?? '',
        minsLabel: input.minsLabel ?? '',
        timeLabel: input.timeLabel ?? null,
        sortOrder: input.sortOrder ?? 0,
        notify: input.notify ? 1 : 0,
        notifyAt: input.notifyAt ?? null,
        updatedAt: now,
        deleted: NOT_DELETED,
      };
      db.insert(routineStep).values(row).run();
      return toStep(row);
    },

    updateStep(id, patch): void {
      const next: Record<string, unknown> = { updatedAt: clock.now() };
      if (patch.name !== undefined) {
        next.name = patch.name;
      }
      if (patch.detail !== undefined) {
        next.detail = patch.detail;
      }
      if (patch.minsLabel !== undefined) {
        next.minsLabel = patch.minsLabel;
      }
      if (patch.timeLabel !== undefined) {
        next.timeLabel = patch.timeLabel;
      }
      if (patch.sortOrder !== undefined) {
        next.sortOrder = patch.sortOrder;
      }
      if (patch.notify !== undefined) {
        next.notify = patch.notify ? 1 : 0;
      }
      if (patch.notifyAt !== undefined) {
        next.notifyAt = patch.notifyAt;
      }
      db.update(routineStep).set(next).where(eq(routineStep.id, id)).run();
    },

    removeStep(id): void {
      db.update(routineStep)
        .set({ deleted: 1, updatedAt: clock.now() })
        .where(eq(routineStep.id, id))
        .run();
    },
  };
}

function createCompletionRepo({ db, clock, newId }: RepoDeps): CompletionRepo {
  const live = () => eq(completion.deleted, NOT_DELETED);

  return {
    between(from, to): Completion[] {
      return db
        .select()
        .from(completion)
        .where(and(live(), between(completion.date, from, to)))
        .all()
        .map(toCompletion);
    },

    onDate(date): Completion[] {
      return db
        .select()
        .from(completion)
        .where(and(live(), eq(completion.date, date)))
        .all()
        .map(toCompletion);
    },

    forStep(stepId): Completion[] {
      return db
        .select()
        .from(completion)
        .where(and(live(), eq(completion.stepId, stepId)))
        .all()
        .map(toCompletion);
    },

    set(stepId, date, done): void {
      const now = clock.now();
      const existing = db
        .select()
        .from(completion)
        .where(and(eq(completion.stepId, stepId), eq(completion.date, date)))
        .get();

      if (existing) {
        db.update(completion)
          .set({ deleted: done ? 0 : 1, completedAt: now, updatedAt: now })
          .where(eq(completion.id, existing.id))
          .run();
        return;
      }
      if (!done) {
        return;
      } // nothing to tombstone

      db.insert(completion)
        .values({
          id: newId(),
          stepId,
          date,
          completedAt: now,
          updatedAt: now,
          deleted: NOT_DELETED,
        })
        .run();
    },
  };
}

function createMetaRepo({ db, clock }: RepoDeps): MetaRepo {
  const read = (key: string): string | undefined =>
    db.select().from(meta).where(eq(meta.key, key)).get()?.value;

  const write = (key: string, value: string): void => {
    const now = clock.now();
    db.insert(meta)
      .values({ key, value, updatedAt: now, deleted: NOT_DELETED })
      .onConflictDoUpdate({
        target: meta.key,
        set: { value, deleted: 0, updatedAt: now },
      })
      .run();
  };

  return {
    get: read,
    set: write,
    getJson<T>(key: string): T | undefined {
      const raw = read(key);
      return raw === undefined ? undefined : (JSON.parse(raw) as T);
    },
    setJson(key, value): void {
      write(key, JSON.stringify(value));
    },
    all(): Record<string, string> {
      return metaRowsToMap(
        db.select().from(meta).where(eq(meta.deleted, NOT_DELETED)).all(),
      );
    },
  };
}
