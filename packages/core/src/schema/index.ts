import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

/**
 * Columns every table carries for record-level last-write-wins sync:
 * `updatedAt` is stamped on every write; `deleted` is a tombstone (never hard-delete).
 */
const sync = {
  updatedAt: integer('updated_at').notNull(),
  deleted: integer('deleted').notNull().default(0),
};

export const routine = sqliteTable('routine', {
  id: text('id').primaryKey(),
  group: text('group').notNull(),
  icon: text('icon').notNull(),
  windowLabel: text('window_label').notNull(),
  startTime: text('start_time').notNull(),
  durationLabel: text('duration_label').notNull(),
  activeDays: text('active_days').notNull(), // JSON-encoded boolean[7]
  sortOrder: integer('sort_order').notNull().default(0),
  ...sync,
});

export const routineStep = sqliteTable('routine_step', {
  id: text('id').primaryKey(),
  routineId: text('routine_id').notNull(),
  name: text('name').notNull(),
  detail: text('detail').notNull().default(''),
  minsLabel: text('mins_label').notNull().default(''),
  timeLabel: text('time_label'),
  sortOrder: integer('sort_order').notNull().default(0),
  notify: integer('notify').notNull().default(0),
  notifyAt: text('notify_at'),
  ...sync,
});

export const completion = sqliteTable(
  'completion',
  {
    id: text('id').primaryKey(),
    stepId: text('step_id').notNull(),
    date: text('date').notNull(), // 'YYYY-MM-DD' local
    completedAt: integer('completed_at').notNull(),
    ...sync,
  },
  (t) => [uniqueIndex('completion_step_date').on(t.stepId, t.date)],
);

export const meta = sqliteTable('meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  ...sync,
});

export const schema = { routine, routineStep, completion, meta };

export type RoutineRow = typeof routine.$inferSelect;
export type RoutineStepRow = typeof routineStep.$inferSelect;
export type CompletionRow = typeof completion.$inferSelect;
export type MetaRow = typeof meta.$inferSelect;
