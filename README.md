# routine-keeper

A daily-routine tracker mockup built with Expo — Japanese UI, "Loop" design language,
swipe-to-complete tasks and an animated progress ring. State is in-memory only (no
backend); this is a design prototype.

## Stack

- Expo SDK ~57 · React 19 · React Native 0.86 · TypeScript ~6
- Expo Router (file-based routing, tabs + form-sheet modals)
- react-native-reanimated + react-native-gesture-handler
- phosphor-react-native · @expo-google-fonts (Inter + Noto Sans JP)
- pnpm · oxlint / oxfmt · jest-expo + @testing-library/react-native

## Setup

```sh
pnpm install
pnpm start          # Expo dev server
pnpm android        # expo run:android (dev client)
pnpm ios            # expo run:ios
pnpm web            # expo start --web
```

Native/Expo packages: `npx expo install <pkg>`. Other JS packages: `pnpm add <pkg>`.

## Scripts

| Command | What |
|---|---|
| `pnpm start` | Expo dev server |
| `pnpm android` / `pnpm ios` / `pnpm web` | run on a platform |
| `pnpm test` | jest in watch mode |
| `npx jest --ci` | one-shot test run |
| `npx oxlint` | lint |
| `npx tsc --noEmit` | type-check |

Run `npx oxlint` and `npx tsc --noEmit` before considering a change done.

## Project structure

Target architecture (bullet-proof react under `src/`, migrated incrementally) and the
current pre-migration layout are both documented in [AGENTS.md](./AGENTS.md).

## Testing

`jest-expo` preset, tests colocated in `__tests__/` next to the code. Note
`@testing-library/react-native` v14 makes `render` / `renderHook` / `fireEvent` / `act`
async — always `await` them. Details in [AGENTS.md](./AGENTS.md).

## License

See [LICENSE](./LICENSE).
