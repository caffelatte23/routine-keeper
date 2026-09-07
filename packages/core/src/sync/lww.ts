import type { SyncRow } from './types';

/**
 * Merge two sets of rows by id, keeping whichever has the greater `updatedAt`.
 * A tombstone (`deleted: 1`) is just a value — a newer delete wins over an older
 * edit and vice-versa. Ties keep the local row.
 */
export function lwwMerge<T extends SyncRow>(local: T[], remote: T[]): T[] {
  const byId = new Map<string, T>();
  for (const row of local) {
    byId.set(row.id, row);
  }
  for (const row of remote) {
    const current = byId.get(row.id);
    if (current === undefined || row.updatedAt > current.updatedAt) {
      byId.set(row.id, row);
    }
  }
  return [...byId.values()];
}
