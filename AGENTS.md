# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Tech Stack

- Expo SDK ~57.0.16
- React 19.2.3
- React Native 0.86.2
- TypeScript ~6.0.3 (entry point: `expo-router/entry`, routes under `apps/mobile/src/app/`)
- Expo Router ~57.0.16 (file-based navigation: `Tabs` for the bottom nav, `formSheet` presentation for modals)
- react-native-reanimated 4.5.1 + react-native-gesture-handler ~2.32.0 (swipe-to-complete, animated progress ring)
- phosphor-react-native (icon set matching the Loop design; note some icons export as `<Name>Icon`, e.g. `CircleIcon`)
- @expo-google-fonts/inter + @expo-google-fonts/noto-sans-jp (Japanese UI copy)
- expo-status-bar ~57.0.1
- Package manager: pnpm **workspace** (monorepo). Install native/Expo packages from `apps/mobile/` via `npx expo install <pkg>`; non-Expo JS packages via `pnpm --filter <pkg> add <dep>`. `eas build` / `eas submit` also run from `apps/mobile/`.

# Project Structure

pnpm-workspace monorepo, two packages:

```
apps/mobile/     the Expo app  (@routine-keeper/mobile)
packages/core/   platform-agnostic domain layer  (@routine-keeper/core) — pure TS,
                 no react-native / expo imports, so a future Chrome extension can reuse it
```

Root holds only shared tooling: `pnpm-workspace.yaml`, `tsconfig.json` (thin, editor/lint
convenience), `oxlint.config.ts`, `oxfmt.config.ts`, `package.json` (lint/format/test/typecheck
run recursively). Per-package builds: `tsc --noEmit -p apps/mobile` and `-p packages/core`.

## `apps/mobile/` — bullet-proof react layout

Base layout follows **bullet-proof react**
(https://github.com/alan2207/bullet-proof-react/blob/master/docs/project-structure.md),
adapted for Expo Router:

```
apps/mobile/
  app.json eas.json babel.config.js metro.config.js   # config (babel/metro are CJS — this
                                                       # package has NO "type":"module")
  assets/                                              # app icons / splash (paths in app.json)
  src/
    app/          Expo Router routes ONLY — thin screens that compose feature modules
    shared/       cross-feature building blocks, structured like a features/<feature>/ folder
                  (api/ components/ hooks/ stores/ types/ utils/); promote here only once a
                  2nd feature needs it
    features/     one folder per product feature (not created yet — add on first real use)
    theme/        design tokens (colors, typography) — app-only, imports react-native
    db/           expo-sqlite + Drizzle wiring (added in Phase 2)
    lib/ config/  configured libs / env — add on first real use
  drizzle/        generated migration SQL (added in Phase 2; committed, bundled)
```

Import boundaries (convention; lint rule optional):

- `features/*` MUST NOT import from another `features/*` — go through `src/shared/`.
- `src/app/*` composes features + shared; nothing imports back from `app/`.
- `packages/core` MUST NOT import `react-native*`, `expo*`, or anything from `apps/*`.

Expo Router: `src/app/` is auto-detected as the router root. `@/*` path alias → `apps/mobile/src/*`;
`@routine-keeper/core` resolves via the workspace symlink.

## `packages/core/` — domain layer

Pure TypeScript, no build step (`main` points at `src/index.ts`; Metro / ts-jest transpile it).
Populated in **Phase 2**: domain types, Drizzle schema, repository interfaces + Drizzle-backed
implementations (constructed with an injected DB — no `expo-sqlite` import), pure
selector/use-case functions, and the `SyncAdapter` seam. Every table carries
`updatedAt` (epoch ms) + `deleted` (0/1) for record-level last-write-wins sync later.
Regenerate migrations with `npx drizzle-kit generate` (from `apps/mobile/`) after schema edits.

# Linting

`oxlint.config.ts` (repo root) extends `oxlint-config-universe` (native + typescript-analysis) and
covers both packages. Before considering a change done, run from the repo root: `npx oxlint`,
`pnpm -r typecheck` (or `npx tsc --noEmit -p apps/mobile` / `-p packages/core`).

# Testing

Setup follows https://docs.expo.dev/develop/unit-testing.md and is complete:

- `apps/mobile`: `jest-expo` preset + `@testing-library/react-native` v14; `jest` config (with the
  pnpm-specific `transformIgnorePatterns`) lives in `apps/mobile/package.json`; `"jest"` is in
  `apps/mobile/tsconfig.json` `compilerOptions.types`.
- `packages/core`: plain `ts-jest`, `testEnvironment: node` (`packages/core/jest.config.cjs`).

Run all tests from the repo root with `pnpm -r test`, or one package with
`pnpm --filter @routine-keeper/mobile test` (add `-- --ci` for one-shot).

Conventions:

- Name test files `*.test.ts` / `*.test.tsx`.
- Colocate tests in a `__tests__/` directory next to the code under test (e.g.
  `apps/mobile/src/shared/components/__tests__/task-row.test.tsx`,
  `packages/core/src/usecases/__tests__/streak.test.ts`).
- Snapshots land in `__tests__/__snapshots__/` automatically; don't hand-write them.
- Prioritize `packages/core` pure functions (schema/selectors/use-cases) and presentational
  components over screens under `apps/mobile/src/app/`, since screens are mostly composition and are
  covered by the build/lint verification.

`@testing-library/react-native` is v14, which made `render`, `renderHook`, `fireEvent`, and `act` all return Promises (React 19's async rendering model) — always `await` them, or `result.current` silently stays `undefined`. See `node_modules/@testing-library/react-native/docs/guides/migration-v14.md` if something that looks right isn't updating.
