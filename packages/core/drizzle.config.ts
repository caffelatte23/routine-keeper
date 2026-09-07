import { defineConfig } from 'drizzle-kit';

// Migrations are generated here (next to the schema that defines them) and consumed by
// apps/mobile via `@routine-keeper/core/drizzle/migrations` at runtime.
export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/schema/index.ts',
  out: './drizzle',
});
