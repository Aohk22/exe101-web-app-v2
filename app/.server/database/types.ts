import { createSelectSchema } from 'drizzle-zod'
import {
	users,
	courses,
	modules,
	lessons,
	reviews,
	categories,
} from './schema'

export const USER_ROLES = ['learner', 'staff'] as const
export type UserRole = (typeof USER_ROLES)[number]

export type User = typeof users.$inferSelect
export type Course = typeof courses.$inferSelect
export type Module = typeof modules.$inferSelect
export type Lesson = typeof lessons.$inferSelect
export type Review = typeof reviews.$inferSelect
export type Category = typeof categories.$inferSelect

export const userSchema = createSelectSchema(users)
export const courseSchema = createSelectSchema(courses)
export const moduleSchema = createSelectSchema(modules)
export const lessonSchema = createSelectSchema(lessons)
export const categorySchema = createSelectSchema(categories)
