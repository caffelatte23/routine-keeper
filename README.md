# routine-keeper

A daily-routine tracker built with Expo — Japanese UI, "Loop" design language,
swipe-to-complete tasks and an animated progress ring.

Local-first: data lives in on-device SQLite, works with no network. Cloud sync
(Cloudflare or Google Drive — undecided) and a lightweight Chrome extension are
planned; the code is structured so neither needs a rewrite. See
[the foundation plan](~/.claude/plans/wobbly-munching-blum.md) and [AGENTS.md](./AGENTS.md).

## Stack

- Expo SDK ~57 · React 19 · React Native 0.86 · TypeScript ~6
- Expo Router (file-based routing, tabs + form-sheet modals)
- react-native-reanimated + react-native-gesture-handler
- phosphor-react-native · @expo-google-fonts (Inter + Noto Sans JP)
- expo-sqlite + Drizzle ORM (local persistence — added in Phase 2)
- pnpm workspace · oxlint / oxfmt · jest-expo + ts-jest

## Layout

```
apps/mobile/     the Expo app  (@routine-keeper/mobile)
packages/core/   platform-agnostic domain layer  (@routine-keeper/core) — pure TS
```

Full policy and file map: [AGENTS.md](./AGENTS.md).

## Setup

```sh
pnpm install                       # from repo root

cd apps/mobile
pnpm start                         # Expo dev server (dev client)
pnpm web                           # expo start --web
pnpm android                       # expo run:android
```

Native/Expo packages: `npx expo install <pkg>` from `apps/mobile/`.
Other JS packages: `pnpm --filter @routine-keeper/<pkg> add <dep>`.

## Checks (from repo root)

| Command | What |
|---|---|
| `npx oxlint` | lint (both packages) |
| `pnpm -r typecheck` | `tsc --noEmit` per package |
| `pnpm -r test` | jest per package |
| `pnpm --filter @routine-keeper/mobile test -- --ci` | one-shot app tests |

Run `npx oxlint` and `pnpm -r typecheck` before considering a change done.

## Testing

`apps/mobile` uses the `jest-expo` preset; `packages/core` uses `ts-jest` (node). Tests
are colocated in `__tests__/` next to the code. Note `@testing-library/react-native` v14
makes `render` / `renderHook` / `fireEvent` / `act` async — always `await` them. Details in
[AGENTS.md](./AGENTS.md).

## License

See [LICENSE](./LICENSE).
