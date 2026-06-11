# AGENTS.md — exe101-web-app

## Commands

| Command | What it does |
|---|---|
| `pnpm run dev` | Dev server at `localhost:5173` (Vite + React Router HMR) |
| `pnpm run build` | Production build → `build/client/`, `build/server/` |
| `pnpm run start` | Serve production build |
| `pnpm run typecheck` | **Must run typegen first** — `react-router typegen && tsc` |
| `pnpm run fmt` | Prettier (tabs, 4-space width, single quotes, no semicolons) |
| `pnpm run db:push` | Drizzle-kit push (schema → PostgreSQL) |
| `pnpm run db:seed` | Seed DB via `tsx ./scripts/seed.ts` |
| `pnpm run db:wipe` | Wipe DB via `tsx ./scripts/wipe.ts` |

No test or lint scripts exist.

## Quick DB reset

```sh
pnpm run db:wipe && pnpm run db:push && pnpm run db:seed
```

## Environment

`.env` is gitignored. Copy `example.env` and set:
- `DATABASE_URL` (PostgreSQL required)
- `SESSION_SECRET` (any random string)
- `OPENROUTER_API_KEY` (optional, for AI tutor)

## Architecture

- **Single route manifest**: `app/routes.ts` — add routes here, not by filesystem.
- **Server-only code** in `app/.server/` (DB, auth, queries). Importing on client will crash.
- **Pages** in `app/pages/`. **Route logic** (middleware, loaders, actions) in `app/routes/`.
- **Auth middleware** in `app/middleware/auth.ts`. Applied via `protected.tsx` layout route. Protects all routes nested under it.
- **Session**: Cookie `__session`, 1hr maxAge, `httpOnly`, secure in production. Uses React Router `createCookieSessionStorage`.
- **DB**: PostgreSQL via Drizzle ORM. Most queries use **raw SQL** (`sql` tagged template) with **zod** for row parsing, not the Drizzle query builder.
- **Path alias**: `~/*` → `./app/*`
- **Schema**: `app/.server/database/schema.ts` (Drizzle schema). Drizzle config in `drizzle.config.ts`.
- **Trigger**: `users_to_lessons` rows auto-populated by PostgreSQL trigger `on_course_enrollment` on INSERT into `users_to_courses`.

## Style conventions

- Prettier: tabs, single quotes, no semicolons, 4-space tab width
- Seed passwords are pre-hashed bcrypt (`$2b$10$...`), not plaintext
- `tsx` runner for scripts (`^4.21.0`)
- AI tutor uses OpenRouter API (model `google/gemini-2.0-flash-lite-001`)
