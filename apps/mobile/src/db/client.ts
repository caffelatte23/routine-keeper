import { createRepositories, schema, systemClock } from '@routine-keeper/core';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as Crypto from 'expo-crypto';
import { openDatabaseSync } from 'expo-sqlite';

import type { Repositories } from '@routine-keeper/core';

export const DB_NAME = 'routine-keeper.db';

// `enableChangeListener` is what makes `useLiveQuery` re-render on writes.
const nativeDb = openDatabaseSync(DB_NAME, { enableChangeListener: true });

export const db = drizzle(nativeDb, { schema });

export const repos: Repositories = createRepositories({
  db,
  clock: systemClock,
  newId: () => Crypto.randomUUID(),
});
