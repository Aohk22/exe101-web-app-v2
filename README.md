# CyberSpace Academy

An interactive cybersecurity e-learning platform built with React Router, featuring course enrollment, progress tracking, Markdown-based lessons, and an AI tutor.

## Introduction

CyberSpace Academy is a full-stack web application designed to make cybersecurity education accessible and engaging. It serves as the digital learning arm of CyberSpace, an organization focused on bridging the cybersecurity skills gap through hands-on, structured training.

The platform was built to replace static course delivery with an interactive experience — one where learners can track their progress, receive AI-powered tutoring, and staff can author and manage curriculum through a dedicated course builder.

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9
- **PostgreSQL** >= 14

### Setup

```sh
# 1. Clone the repo
git clone <repo-url>
cd exe101-web-app-v2

# 2. Install dependencies
pnpm install

# 3. Copy environment variables and fill them in
cp example.env .env
```

Required environment variables (see `example.env`):

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Random string for session cookie signing |
| `OPENROUTER_API_KEY` | No | API key for the AI tutor feature |

```sh
# 4. Push the database schema and seed data
pnpm run db:push
pnpm run db:seed

# 5. Start the dev server
pnpm run dev
```

The app is now running at `http://localhost:5173`.

### Quick DB reset

```sh
pnpm run db:wipe && pnpm run db:push && pnpm run db:seed
```

## I'm a developer working on this project, where do I start?

### Architecture overview

```
app/
├── .server/          # Server-only code (DB, auth, queries) — never imported on client
├── components/       # Shared UI components
├── layouts/          # Page layout wrappers (sidebar, header, themes)
├── middleware/       # Route middleware (auth checks)
├── pages/            # Page components (one per route)
├── routes/           # Route logic (loaders, actions, middleware)
├── utils/            # Utility functions
├── root.tsx          # Root layout with error boundary
└── routes.ts         # Single route manifest — add routes here
```

### Key conventions

- **Routes**: Declared in `app/routes.ts`, not by filesystem convention. Each route maps a URL path to a page component and optionally a route module with loader/action logic.
- **Server-only code**: Anything in `app/.server/` must never be imported on the client. This includes database queries, auth logic, and session handling.
- **Database queries**: Written as raw SQL using Drizzle's `sql` tagged template, parsed at runtime with **Zod** schemas. The Drizzle query builder is not used.
- **Auth**: Cookie-based sessions (`__session` cookie, 1hr maxAge, httpOnly). Protected routes use `authMiddleware` applied via `app/routes/protected.tsx` layout.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`. Formatting uses Prettier with tabs, single quotes, no semicolons, 4-space tab width.
- **Lesson tracking**: When a user enrolls in a course, a PostgreSQL trigger (`on_course_enrollment`) auto-populates `users_to_lessons` rows for every lesson with `completed = false`.

### Available scripts

| Command | Description |
|---|---|
| `pnpm run dev` | Start dev server at `localhost:5173` |
| `pnpm run build` | Production build to `build/client/` and `build/server/` |
| `pnpm run start` | Serve production build |
| `pnpm run typecheck` | `react-router typegen && tsc` |
| `pnpm run fmt` | Format code with Prettier |
| `pnpm run db:push` | Push Drizzle schema to PostgreSQL |
| `pnpm run db:seed` | Seed database with sample data |
| `pnpm run db:wipe` | Delete all database data |

### Making changes

1. **Adding a new route**: Add the route to `app/routes.ts`, create a page component in `app/pages/`, and optionally add a route module in `app/routes/` for loader/action logic.
2. **Modifying the schema**: Edit `app/.server/database/schema.ts`, then run `pnpm run db:push`.
3. **Adding a query**: Create or extend a file in `app/.server/queries/`. Use raw SQL with `sql` tagged template and Zod for row parsing. See existing query files for the pattern.
4. **Protecting a route**: Nest it under the layout route in `app/routes/protected.tsx` — the `authMiddleware` handles session checks automatically.
5. **Changing styles**: Tailwind classes are used throughout. Run `pnpm run fmt` after making changes to keep formatting consistent.

Before committing, always run `pnpm run typecheck` to verify types. There are no test or lint scripts.
