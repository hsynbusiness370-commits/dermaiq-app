# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

DermaIQ is an AI-powered skincare analyzer built with **Expo SDK 54**, **React Native 0.81**, **TypeScript**, and **expo-router**. It runs as a single service with no backend or database dependencies; all data is stored locally via AsyncStorage.

### Running the app

- **Dev server (web):** `npx expo start --web --port 8081`
- The app runs in the browser at `http://localhost:8081`.
- No mobile emulators are available in Cloud Agent VMs; always test via web mode.
- The first load shows an onboarding flow (skin type + goal selection). Completing it navigates to the main Home tab.

### Available npm scripts

See `package.json` for the full list. Key commands:

| Command | Purpose |
|---------|---------|
| `npm start` | Start Expo dev server (interactive mode) |
| `npm run web` | Start Expo dev server in web mode |
| `npm run typecheck` | Run TypeScript type checking (`tsc --noEmit`) |

### Linting / type checking

There is no ESLint configuration; the only static analysis is TypeScript strict mode via `npm run typecheck`.

### Testing

No automated test framework is configured. Manual testing via browser is the primary validation method. Core hello-world flow: Scan tab -> Paste ingredients -> Analyze.

### Codebase structure

- `app/` — Route screens and navigation (expo-router file-based routing)
- `components/` — Reusable UI primitives (Badge, ScoreCard, PrimaryButton, etc.)
- `lib/` — Theme tokens, scoring engine, ingredient database, storage, and app state contexts
