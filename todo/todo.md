# Learning Path Implementation

## Phase 1 — Path Browsing & Enrollment

- [x] Add `learning_paths` table to DB schema
- [x] Add `path_courses` table to DB schema
- [x] Add zod schemas and types for learning paths
- [x] Create `app/.server/queries/learning-paths.ts` (getLearningPaths, getLearningPathDetail)
- [x] Add `/paths` and `/paths/:pathId` routes to route manifest
- [x] Create `app/pages/Paths.tsx`
- [x] Create `app/pages/PathDetail.tsx`
- [x] Create `app/components/PathCard.tsx`
- [x] Add "Learning Paths" nav item to sidebar layout
- [x] Update seed data with 2 learning paths
- [x] Run `pnpm run db:push` to apply schema changes

## Phase 2 — Path Progress Tracking (future)

- [ ] Add `users_to_paths` table
- [ ] `enrollInPath()` query function
- [ ] `getUserPathProgress()` query function
- [ ] Dashboard "My Learning Paths" section
- [ ] Auto-mark path complete when last course finished
- [ ] `PathProgressCard` component

## Phase 3 — Path Admin Interface (future)

- [ ] Separate staff-only `/admin/paths` page
- [ ] CRUD for learning paths
- [ ] Course assignment and ordering UI
