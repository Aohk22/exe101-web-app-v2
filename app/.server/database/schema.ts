import { pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
// import { defineRelations } from 'drizzle-orm'

export const USER_ROLES = ['learner', 'staff'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const users = pgTable('users', (t) => ({
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
	name: t.varchar({ length: 255 }).notNull(),
	email: t.varchar({ length: 255 }).notNull().unique(),
	password: t.text().notNull(),
	role: t.varchar({ length: 20 }).notNull().default('learner'),
}))

export const reviews = pgTable('reviews', (t) => ({
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: t.integer('user_id'),
	courseId: t.integer('course_id'),
	content: t.varchar({ length: 255 }).notNull(),
	rating: t.integer().notNull(),
}))

export const categories = pgTable('categories', (t) => ({
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
	name: t.varchar({ length: 255 }).notNull().unique(),
}))

export const courses = pgTable('courses', (t) => ({
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
	title: t.text().notNull(),
	description: t.varchar({ length: 255 }).notNull(),
	instructor: t.varchar({ length: 255 }).notNull(),
	thumbnail: t.text().notNull(),
	length: t.integer().notNull(),

	categoryId: t
		.integer('category_id')
		.notNull()
		.references(() => categories.id),
}))

export const modules = pgTable('modules', (t) => ({
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
	title: t.varchar({ length: 255 }).notNull(),
	courseId: t.integer('course_id').notNull(),
}))

export const lessons = pgTable('lessons', (t) => ({
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
	title: t.varchar({ length: 255 }).notNull(),
	length: t.integer().notNull(),
	contentMd: t.text('content_md').notNull().default(''),

	moduleId: t.integer('module_id').notNull(),
}))

export const usersToCourses = pgTable(
	'users_to_courses',
	(t) => ({
		userId: t
			.integer('user_id')
			.notNull()
			.references(() => users.id),
		courseId: t
			.integer('course_id')
			.notNull()
			.references(() => courses.id),
	}),
	(t) => [primaryKey({ columns: [t.userId, t.courseId] })],
)

export const usersToLessons = pgTable(
	'users_to_lessons',
	(t) => ({
		userId: t
			.integer('user_id')
			.notNull()
			.references(() => users.id),
		lessonId: t
			.integer('lesson_id')
			.notNull()
			.references(() => lessons.id),
		completed: t.boolean().notNull().default(false),
	}),
	(t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
)

// Not needed.
// export const relations = defineRelations(
// 	{ users, courses, modules, lessons, reviews, usersToCourses },
// 	(r) => ({
// 		users: {
// 			courses: r.many.courses({
// 				from: r.users.id.through(r.usersToCourses.userId),
// 				to: r.courses.id.through(r.usersToCourses.courseId),
// 			}),
// 			reviews: r.many.reviews(),
// 		},

// 		courses: {
// 			users: r.many.users(),
// 			modules: r.many.modules(),
// 			reviews: r.many.reviews(),
// 		},

// 		modules: {
// 			course: r.one.courses({
// 				from: r.modules.courseId,
// 				to: r.courses.id,
// 			}),
// 			lessons: r.many.lessons(),
// 		},

// 		lessons: {
// 			modules: r.one.modules({
// 				from: r.lessons.moduleId,
// 				to: r.modules.id,
// 			}),
// 		},

// 		reviews: {
// 			users: r.one.users({
// 				from: r.reviews.userId,
// 				to: r.users.id,
// 			}),
// 			courses: r.one.courses({
// 				from: r.reviews.courseId,
// 				to: r.courses.id,
// 			}),
// 		},
// 	}),
// )

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
