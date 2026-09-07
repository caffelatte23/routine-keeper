import path from 'node:path';

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { schema } from '../../schema';
import { EVERY_DAY, WEEKDAYS } from '../../testing/factories';
import { createRepositories } from '../drizzle';

import type { RepoDeps } from '../types';

const MIGRATIONS = path.join(__dirname, '../../../drizzle');

function setup(
  nowValues: number[] = [],
): { deps: RepoDeps } & ReturnType<typeof createRepositories> {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: MIGRATIONS });

  let idn = 0;
  let nowIdx = 0;
  const deps: RepoDeps = {
    db,
    newId: () => `id-${(idn += 1)}`,
    clock: { now: () => nowValues[nowIdx++] ?? 1_000 },
  };
  return { deps, ...createRepositories(deps) };
}

describe('drizzle repositories', () => {
  it('migrates cleanly and starts empty', () => {
    const { routines, completions, meta } = setup();
    expect(routines.all()).toEqual([]);
    expect(completions.between('2000-01-01', '2100-01-01')).toEqual([]);
    expect(meta.all()).toEqual({});
  });

  it('creates routines with steps and round-trips activeDays', () => {
    const { routines } = setup();
    const r = routines.create({
      group: '朝',
      icon: 'Sun',
      windowLabel: '6:45 – 8:00',
      startTime: '6:45',
      durationLabel: '75分',
      activeDays: [...WEEKDAYS],
    });
    routines.addStep({ routineId: r.id, name: 'ベッドを整える', sortOrder: 0 });
    routines.addStep({ routineId: r.id, name: 'ストレッチ', sortOrder: 1 });

    const withSteps = routines.withSteps();
    expect(withSteps).toHaveLength(1);
    expect(withSteps[0].activeDays).toEqual(WEEKDAYS);
    expect(withSteps[0].steps.map((s) => s.name)).toEqual([
      'ベッドを整える',
      'ストレッチ',
    ]);
  });

  it('activeOn filters by the weekday of the date', () => {
    const { routines } = setup();
    const daily = routines.create({
      group: '夜',
      icon: 'Moon',
      windowLabel: 'x',
      startTime: '21:00',
      durationLabel: 'x',
      activeDays: [...EVERY_DAY],
    });
    const weekday = routines.create({
      group: '朝',
      icon: 'Sun',
      windowLabel: 'x',
      startTime: '6:45',
      durationLabel: 'x',
      activeDays: [...WEEKDAYS],
    });
    routines.addStep({ routineId: daily.id, name: 'd' });
    routines.addStep({ routineId: weekday.id, name: 'w' });

    // 2026-01-03 is a Saturday.
    const sat = routines.activeOn('2026-01-03');
    expect(sat.map((r) => r.id)).toEqual([daily.id]);
    // 2026-01-15 is a Thursday.
    const thu = routines
      .activeOn('2026-01-15')
      .map((r) => r.id)
      .sort();
    expect(thu).toEqual([daily.id, weekday.id].sort());
  });

  it('set() upserts, tombstones, and reactivates a completion', () => {
    const { completions } = setup([10, 20, 30]);
    completions.set('s1', '2026-01-15', true);
    expect(completions.onDate('2026-01-15').map((c) => c.stepId)).toEqual([
      's1',
    ]);

    completions.set('s1', '2026-01-15', false);
    expect(completions.onDate('2026-01-15')).toEqual([]);

    completions.set('s1', '2026-01-15', true);
    expect(completions.onDate('2026-01-15').map((c) => c.stepId)).toEqual([
      's1',
    ]);
  });

  it('keeps at most one completion row per (step, date)', () => {
    const { completions, deps } = setup();
    completions.set('s1', '2026-01-15', true);
    completions.set('s1', '2026-01-15', true);
    const rows = deps.db
      .select()
      .from(schema.completion)
      .all()
      .filter((r) => r.stepId === 's1');
    expect(rows).toHaveLength(1);
  });

  it('soft-deletes routines out of reads', () => {
    const { routines } = setup();
    const r = routines.create({
      group: '朝',
      icon: 'Sun',
      windowLabel: 'x',
      startTime: 'x',
      durationLabel: 'x',
      activeDays: [...EVERY_DAY],
    });
    expect(routines.all()).toHaveLength(1);
    routines.remove(r.id);
    expect(routines.all()).toEqual([]);
  });

  it('meta stores strings and JSON by key', () => {
    const { meta } = setup();
    meta.set('profile.userName', 'あかり');
    meta.setJson('onboarding.enabledGroups', ['朝', '夜']);

    expect(meta.get('profile.userName')).toBe('あかり');
    expect(meta.getJson<string[]>('onboarding.enabledGroups')).toEqual([
      '朝',
      '夜',
    ]);
    expect(meta.all()).toMatchObject({ 'profile.userName': 'あかり' });

    meta.set('profile.userName', 'そら'); // upsert
    expect(meta.get('profile.userName')).toBe('そら');
  });
});
