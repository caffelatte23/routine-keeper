# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Tech Stack

- Expo SDK ~57.0.16
- React 19.2.3
- React Native 0.86.2
- TypeScript ~6.0.3 (entry point: `expo-router/entry`, routes under `app/`)
- Expo Router ~57.0.16 (file-based navigation: `Tabs` for the bottom nav, `formSheet` presentation for modals)
- react-native-reanimated 4.5.1 + react-native-gesture-handler ~2.32.0 (swipe-to-complete, animated progress ring)
- phosphor-react-native (icon set matching the Loop design; note some icons export as `<Name>Icon`, e.g. `CircleIcon`)
- @expo-google-fonts/inter + @expo-google-fonts/noto-sans-jp (Japanese UI copy)
- expo-status-bar ~57.0.1
- Package manager: pnpm — always install native/Expo packages via `npx expo install <pkg>` (it invokes pnpm and resolves SDK-compatible versions), and non-Expo JS packages via plain `pnpm add`

# Project Structure

- `app/` — Expo Router routes: `index.tsx` (onboarding), `(tabs)/` (today/routines/calendar/settings), `routine/[id].tsx` and `task/[id].tsx` (form-sheet modals)
- `components/` — shared UI pieces reused across 2+ screens (task-row, progress-ring, toggle-row, etc.)
- `state/routine-store.tsx` — in-memory React Context store for tasks/routines/settings (no persistence backend; this is a mockup)
- `theme/colors.ts` — dark/light palette transcribed from the Claude Design source, keyed off `useColorScheme()`
- `theme/typography.ts` — Google Fonts loading

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
- Colocate tests in a `__tests__/` directory next to the code under test (e.g. `state/__tests__/routine-store.test.tsx`, `components/__tests__/task-row.test.tsx`) rather than one root-level `__tests__` directory — this project's modules are small and feature-scoped.
- Snapshots land in `__tests__/__snapshots__/` automatically; don't hand-write them.
- Prioritize `state/routine-store.tsx` (pure state transitions: `setTaskDone`, `toggleTask`, `resetDay`, `toggleSetting`) and presentational components over screens under `app/`, since screens are mostly composition and are already covered by the build/lint verification described above.

`@testing-library/react-native` is v14, which made `render`, `renderHook`, `fireEvent`, and `act` all return Promises (React 19's async rendering model) — always `await` them, or `result.current` silently stays `undefined`. See `node_modules/@testing-library/react-native/docs/guides/migration-v14.md` if something that looks right isn't updating.
