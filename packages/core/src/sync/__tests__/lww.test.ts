import { lwwMerge } from '../lww';

import type { SyncRow } from '../types';

const row = (
  id: string,
  updatedAt: number,
  deleted = 0,
  extra: Record<string, unknown> = {},
): SyncRow => ({
  id,
  updatedAt,
  deleted,
  ...extra,
});

describe('lwwMerge', () => {
  it('keeps the row with the greater updatedAt', () => {
    const local = [row('a', 100, 0, { name: 'local' })];
    const remote = [row('a', 200, 0, { name: 'remote' })];
    expect(lwwMerge(local, remote)).toEqual([
      row('a', 200, 0, { name: 'remote' }),
    ]);
  });

  it('keeps local on a tie', () => {
    const local = [row('a', 100, 0, { name: 'local' })];
    const remote = [row('a', 100, 0, { name: 'remote' })];
    expect(lwwMerge(local, remote)[0].name).toBe('local');
  });

  it('unions rows that exist on only one side', () => {
    const merged = lwwMerge([row('a', 1)], [row('b', 1)]);
    expect(merged.map((r) => r.id).sort()).toEqual(['a', 'b']);
  });

  it('a newer tombstone wins over an older edit', () => {
    const local = [row('a', 100, 0)];
    const remote = [row('a', 150, 1)];
    expect(lwwMerge(local, remote)[0].deleted).toBe(1);
  });

  it('a newer edit wins over an older tombstone', () => {
    const local = [row('a', 200, 0)];
    const remote = [row('a', 150, 1)];
    expect(lwwMerge(local, remote)[0].deleted).toBe(0);
  });
});
