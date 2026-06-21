# Challenge Lesson Feature

## Phase 1 — Schema & Types

- [x] Add `challenge_questions` table to DB schema
- [x] Add `challenge_options` table to DB schema
- [x] Add `challenge_submissions` table to DB schema
- [x] Add Zod schemas and TS types for challenge tables
- [x] Run `pnpm run db:push` to apply schema changes

## Phase 2 — Server Queries

- [x] Create `app/.server/queries/challenge.ts`
- [x] `getChallengeData(lessonId, userId)` — fetch questions + options + user submissions
- [x] `submitAnswer(userId, questionId, answerText)` — grade and upsert submission row
- [x] `markLessonComplete(lessonId, userId)` — set `users_to_lessons.completed = true`
- [x] `checkAndMarkIfAllCorrect(lessonId, userId)` — check all questions correct, auto-mark complete

## Phase 3 — Challenge UI Component

- [x] Create `app/components/ChallengeSection.tsx`
- [x] Render MCQ questions as radio buttons
- [x] Render flag questions as text input with submit button
- [x] Show correct/incorrect feedback per question
- [x] Lock correct answers, allow retry on wrong
- [x] Show progress (X/Y correct)

## Phase 4 — Lesson Page Integration

- [x] Extend `Lesson.tsx` loader to fetch challenge data
- [x] Add `Lesson.tsx` action for `submit-challenge` intent
- [x] Add `Lesson.tsx` action for `mark-complete` intent (non-challenge lessons)
- [x] Render `<ChallengeSection>` below markdown for challenge lessons
- [x] Render "Mark as Complete" button for non-challenge lessons
- [x] Ensure prev/next nav works regardless of challenge state

## Phase 5 — Course Builder

- [x] Extend draft types in `app/components/course-builder/types.ts` with challenge questions/options
- [x] Extend `LessonEditorPanel.tsx` with "Challenge" tab
- [x] MCQ editor: add/remove questions, add/remove options, mark correct
- [x] Flag editor: question text input + correct answer input
- [x] Extend `CourseBuilder.tsx` action to persist challenge questions and options

## Phase 6 — Seed Data

- [ ] Add demo challenge to at least 2 existing lessons (1 MCQ, 1 flag)
- [ ] Run `pnpm run db:seed` to verify

## Phase 7 — Build & Verify

- [x] Run `pnpm run build` to verify compilation
- [x] Run `pnpm run typecheck` to verify types
- [x] Dev test flow: navigate lesson → answer questions → verify completion
