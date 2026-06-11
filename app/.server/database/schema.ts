import {
	pgTable,
	primaryKey,
	integer,
	varchar,
	text,
	boolean,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
	password: text().notNull(),
	role: varchar({ length: 20 }).notNull().default('learner'),
})

export const reviews = pgTable('reviews', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: integer('user_id'),
	courseId: integer('course_id'),
	content: varchar({ length: 255 }).notNull(),
	rating: integer().notNull(),
})

export const categories = pgTable('categories', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull().unique(),
})

export const courses = pgTable('courses', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	title: text().notNull(),
	description: varchar({ length: 255 }).notNull(),
	instructor: varchar({ length: 255 }).notNull(),
	thumbnail: text().notNull(),
	length: integer().notNull(),

	categoryId: integer('category_id')
		.notNull()
		.references(() => categories.id),
})

export const modules = pgTable('modules', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	title: varchar({ length: 255 }).notNull(),

	courseId: integer('course_id')
		.notNull()
		.references(() => courses.id),
})

export const lessons = pgTable('lessons', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	title: varchar({ length: 255 }).notNull(),
	length: integer().notNull(),
	contentMd: text('content_md').notNull().default(''),

	moduleId: integer('module_id')
		.notNull()
		.references(() => modules.id),
})

export const usersToCourses = pgTable(
	'users_to_courses',
	{
		userId: integer('user_id')
			.notNull()
			.references(() => users.id),
		courseId: integer('course_id')
			.notNull()
			.references(() => courses.id),
	},
	(t) => [primaryKey({ columns: [t.userId, t.courseId] })],
)

export const usersToLessons = pgTable(
	'users_to_lessons',
	{
		userId: integer('user_id')
			.notNull()
			.references(() => users.id),
		lessonId: integer('lesson_id')
			.notNull()
			.references(() => lessons.id),
		completed: boolean().notNull().default(false),
	},
	(t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
)
