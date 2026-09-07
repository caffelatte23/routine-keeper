/**
 * Sync seam — SHAPE ONLY, no implementation in this phase.
 *
 * When cloud sync is added, a Cloudflare Workers+D1 backend and a Google-Drive
 * backend would each implement `SyncAdapter`; nothing in the domain layer or the
 * UI changes. Conflict resolution is record-level last-write-wins: every row
 * carries `updatedAt` (epoch ms) and `deleted` (0/1) tombstone.
 */

export interface SyncRow {
  id: string;
  updatedAt: number;
  deleted: number; // 0 | 1
  [column: string]: unknown;
}

export interface ChangeSet {
  /** Server clock lower bound this set was computed from. */
  since: number;
  /** Server clock at which this set was produced. */
  now: number;
  /** Rows changed since `since`, keyed by table name (tombstones included). */
  tables: Record<string, SyncRow[]>;
}

export interface SyncAdapter {
  pull(since: number): Promise<ChangeSet>;
  push(changes: ChangeSet): Promise<void>;
}

export interface AuthProvider {
  getUserId(): Promise<string | null>;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
}
