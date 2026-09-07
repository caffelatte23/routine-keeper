import type {
  Clock,
  IsoDate,
  Completion,
  GroupName,
  Routine,
  RoutineStep,
  RoutineWithSteps,
} from '../domain';
import type { schema } from '../schema';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

/**
 * A synchronous Drizzle SQLite database bound to our schema. Both `expo-sqlite`
 * (app) and `better-sqlite3` (tests) satisfy this.
 */
export type CoreDb = BaseSQLiteDatabase<'sync', unknown, typeof schema>;

/** Everything a repository needs beyond the database. */
export interface RepoDeps {
  db: CoreDb;
  clock: Clock;
  newId: () => string;
}

export interface RoutineCreate {
  group: GroupName;
  icon: string;
  windowLabel: string;
  startTime: string;
  durationLabel: string;
  activeDays: boolean[];
  sortOrder?: number;
}

export interface StepCreate {
  routineId: string;
  name: string;
  detail?: string;
  minsLabel?: string;
  timeLabel?: string | null;
  sortOrder?: number;
  notify?: boolean;
  notifyAt?: string | null;
}

export interface RoutineRepo {
  all(): Routine[];
  withSteps(): RoutineWithSteps[];
  /** Routines whose `activeDays` includes the weekday of `date`, each with its steps. */
  activeOn(date: IsoDate): RoutineWithSteps[];
  create(input: RoutineCreate): Routine;
  update(id: string, patch: Partial<Omit<RoutineCreate, 'group'>>): void;
  remove(id: string): void;

  addStep(input: StepCreate): RoutineStep;
  updateStep(id: string, patch: Partial<Omit<StepCreate, 'routineId'>>): void;
  removeStep(id: string): void;
}

export interface CompletionRepo {
  between(from: IsoDate, to: IsoDate): Completion[];
  onDate(date: IsoDate): Completion[];
  forStep(stepId: string): Completion[];
  /** Idempotently set the done state for a (step, date): upsert a row or tombstone it. */
  set(stepId: string, date: IsoDate, done: boolean): void;
}

export interface MetaRepo {
  get(key: string): string | undefined;
  getJson<T>(key: string): T | undefined;
  set(key: string, value: string): void;
  setJson(key: string, value: unknown): void;
  all(): Record<string, string>;
}

export interface Repositories {
  routines: RoutineRepo;
  completions: CompletionRepo;
  meta: MetaRepo;
}
