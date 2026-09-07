# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Tech Stack

- Expo SDK ~57.0.16
- React 19.2.3
- React Native 0.86.2
- TypeScript ~6.0.3 (entry point: `expo-router/entry`, routes under `src/app/`)
- Expo Router ~57.0.16 (file-based navigation: `Tabs` for the bottom nav, `formSheet` presentation for modals)
- react-native-reanimated 4.5.1 + react-native-gesture-handler ~2.32.0 (swipe-to-complete, animated progress ring)
- phosphor-react-native (icon set matching the Loop design; note some icons export as `<Name>Icon`, e.g. `CircleIcon`)
- @expo-google-fonts/inter + @expo-google-fonts/noto-sans-jp (Japanese UI copy)
- expo-status-bar ~57.0.1
- Package manager: pnpm — always install native/Expo packages via `npx expo install <pkg>` (it invokes pnpm and resolves SDK-compatible versions), and non-Expo JS packages via plain `pnpm add`

# Project Structure

## Design policy (target architecture)

Everything lives under `src/`. The base layout follows **bullet-proof react**
(https://github.com/alan2207/bullet-proof-react/blob/master/docs/project-structure.md),
adapted for Expo Router:

```
src/
  app/                  Expo Router routes ONLY — thin screens that compose feature modules
  shared/               cross-feature building blocks (see below)
  features/
    <feature>/          one folder per product feature
      api/              data fetching / store bindings for this feature
      components/        UI used only by this feature
      hooks/
      stores/            feature-local state (Context / store slices)
      types/
      utils/
  lib/                  configured third-party libs (fonts, reanimated setup, etc.)
  theme/               design tokens (colors, typography) — global by nature
  config/              env / constants
```

`src/shared/` holds anything reused across 2+ features and is structured **identically
to a `features/<feature>/` folder** — same subfolders (`api/`, `components/`, `hooks/`,
`stores/`, `types/`, `utils/`), just without belonging to a single feature. Put a piece
in `shared/` only once a second feature needs it; until then it stays feature-local.

Import boundaries (enforced by convention, lint later):

- `features/*` MUST NOT import from another `features/*`. Shared needs go through `src/shared/`.
- `src/app/*` composes features and shared; nothing imports back from `app/`.
- `src/shared/*` MUST NOT import from `features/*`.

Expo Router note: `src/app/` is auto-detected as the router root because there is no
root-level `app/`. `main` stays `expo-router/entry`; `app.json` is unchanged. Colocated
`_layout.tsx`, `(tabs)/`, `[id].tsx`, and `formSheet` presentation all work under
`src/app/`. The `@/*` path alias points at `./src/*` (see `tsconfig.json`).

## Current layout

- `src/app/` — Expo Router routes: `index.tsx` (onboarding), `(tabs)/` (today/routines/calendar/settings), `routine/[id].tsx` and `task/[id].tsx` (form-sheet modals)
- `src/shared/components/` — UI pieces reused across 2+ screens (task-row, progress-ring, toggle-row, etc.)
- `src/shared/stores/routine-store.tsx` — in-memory React Context store for tasks/routines/settings (no persistence backend; this is a mockup)
- `src/theme/colors.ts` — dark/light palette transcribed from the Claude Design source, keyed off `useColorScheme()`
- `src/theme/typography.ts` — Google Fonts loading
- `src/features/`, `src/lib/`, `src/config/` — not created yet; add on first real use per the policy above
- `assets/` stays at repo root (app icons / splash referenced by `app.json`, not imported by code)

# Linting

`oxlint.config.ts` extends `oxlint-config-universe` (native + typescript-analysis). Run `npx oxlint` and `npx tsc --noEmit` before considering a change done.

# Testing

Setup follows https://docs.expo.dev/develop/unit-testing.md and is complete:

- `jest`, `jest-expo`, `@types/jest`, and `@testing-library/react-native` are installed
- `package.json` has `"test": "jest --watchAll"` and `"jest": { "preset": "jest-expo", "transformIgnorePatterns": [...] }` (the pnpm-specific pattern from the docs, since this repo uses pnpm)
- `tsconfig.json` has `"jest"` in `compilerOptions.types`

Run tests with `npx jest --ci` (non-watch, for one-shot verification) or `pnpm test` (watch mode).

Conventions:

- Name test files `*.test.ts` / `*.test.tsx`.
- Colocate tests in a `__tests__/` directory next to the code under test (e.g. `src/shared/stores/__tests__/routine-store.test.tsx`, `src/shared/components/__tests__/task-row.test.tsx`) rather than one root-level `__tests__` directory — this project's modules are small and feature-scoped.
- Snapshots land in `__tests__/__snapshots__/` automatically; don't hand-write them.
- Prioritize `src/shared/stores/routine-store.tsx` (pure state transitions: `setTaskDone`, `toggleTask`, `resetDay`, `toggleSetting`) and presentational components over screens under `src/app/`, since screens are mostly composition and are already covered by the build/lint verification described above.

`@testing-library/react-native` is v14, which made `render`, `renderHook`, `fireEvent`, and `act` all return Promises (React 19's async rendering model) — always `await` them, or `result.current` silently stays `undefined`. See `node_modules/@testing-library/react-native/docs/guides/migration-v14.md` if something that looks right isn't updating.
