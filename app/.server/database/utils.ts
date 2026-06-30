import type {
	Category,
	Course,
	Lesson,
	Module,
	User,
} from '~/.server/database/types'
import {
	categorySchema,
	courseSchema,
	lessonSchema,
	moduleSchema,
	userSchema,
} from '~/.server/database/types'
import { db } from '~/.server/database/connection'
import { users } from '~/.server/database/schema'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'

export const courseWithLessonCountSchema = courseSchema.extend({
	lessons_count: z.coerce.number(),
})

export const courseWithProgressSchema = courseWithLessonCountSchema.extend({
	progress: z.coerce.number(),
})

export type CourseWithLessonCount = z.infer<typeof courseWithLessonCountSchema>
export type CourseWithProgress = z.infer<typeof courseWithProgressSchema>

export async function updateUser(
	userId: number,
	data: { name?: string; email?: string },
): Promise<User> {
	const [user] = await db
		.update(users)
		.set({ name: data.name, email: data.email })
		.where(eq(users.id, userId))
		.returning()
	return user
}

export async function getUserById(userId: string): Promise<User | null> {
	const result = await db
		.select()
		.from(users)
		.where(eq(users.id, Number(userId)))
		.limit(1)
	return result.at(0) ?? null
}

export async function getCategories(): Promise<Category[]> {
	const res = await db.execute(sql`SELECT * FROM categories`)

	return z.array(categorySchema).parse(res.rows)
}

export async function getCourse(courseId: number): Promise<Course | null> {
	const result = await db.execute(
		sql`SELECT c.* FROM courses WHERE c.id = ${courseId}`,
	)

	const course = z.safeParse(courseSchema, result)
	if (course.success) {
		return course.data
	} else {
		return null
	}
}

export async function getCourses(): Promise<Course[]> {
	const res = await db.execute(sql`SELECT * FROM courses LIMIT 10`)

	return z.array(courseSchema).parse(res.rows)
}

export async function getCoursesWithLessonCount(): Promise<
	CourseWithLessonCount[]
> {
	const res = await db.execute(sql`
		SELECT 
			c.id, c.title, c.description, c.instructor, c.thumbnail, c.length, 
			cat.name AS category,
			COUNT(l.id)::int AS lessons_count
		FROM courses c
		INNER JOIN categories cat ON c.category_id = cat.id
		INNER JOIN modules m ON c.id = m.course_id
		INNER JOIN lessons l ON m.id = l.module_id
		GROUP BY c.id, cat.name
		LIMIT 10
	`)

	return z.array(courseWithLessonCountSchema).parse(res.rows)
}

export async function getCourseByUser(userId: number): Promise<Course[]> {
	const result = await db.execute(sql`
      SELECT c.*
      FROM users u
      INNER JOIN users_to_courses utc on u.id = utc.user_id
      INNER JOIN courses c on utc.course_id = c.id
      WHERE u.id = ${userId}
    `)

	return z.array(courseSchema).parse(result.rows)
}

export async function getCourseByUserWithProgress(
	userId: number,
): Promise<CourseWithProgress[]> {
	const res = await db.execute(sql`
		SELECT 
			c.id, c.title, c.description, c.instructor, c.thumbnail, c.length, 
			cat.name AS category,
			COUNT(l.id)::int AS lessons_count,
			COUNT(CASE WHEN utl.completed = true THEN 1 END)::int as progress
		FROM courses c
		INNER JOIN categories cat ON c.category_id = cat.id
		INNER JOIN modules m ON c.id = m.course_id
		INNER JOIN lessons l ON m.id = l.module_id
		INNER JOIN users_to_courses utc ON utc.course_id = c.id AND utc.user_id = ${userId}
		LEFT JOIN users_to_lessons utl ON utl.lesson_id = l.id AND utl.user_id = ${userId}
		GROUP BY c.id, cat.name
	`)

	return z.array(courseWithProgressSchema).parse(res.rows)
}

export async function getCourseByCategory(category: string): Promise<Course[]> {
	const res = await db.execute(sql`
		SELECT c.* FROM courses c
		INNER JOIN categories cat ON c.category_id = cat.id
		WHERE cat.name=${category} LIMIT 10`)

	return z.array(courseSchema).parse(res.rows)
}

export async function getModulesByCourse(courseId: number): Promise<Module[]> {
	const res = await db.execute(sql`
        SELECT m.*
        FROM courses c
        INNER JOIN modules m ON c.id = m.course_id
        WHERE c.id = ${courseId}
    `)

	return z.array(moduleSchema).parse(res.rows)
}

export async function getLessonsByCourse(courseId: number): Promise<Lesson[]> {
	const result = await db.execute(sql`
        SELECT l.*
        FROM courses c
        INNER JOIN modules m ON c.id = m.course_id
        INNER JOIN lessons l ON m.id = l.module_id
        WHERE c.id = ${courseId}
    `)

	return z.array(lessonSchema).parse(result.rows)
}

export async function getCourseLessonCount(courseId: number): Promise<number> {
	const result = await db.execute(sql`
        SELECT COUNT(l.id)
        FROM courses c
        INNER JOIN modules m ON c.id = m.course_id
        INNER JOIN lessons l ON m.id = l.module_id
        WHERE c.id = ${courseId}
    `)

	return z.number().parse(result.rows[0])
}

export async function updatePassword(
	userId: number,
	currentPassword: string,
	newPassword: string,
): Promise<{ ok: boolean; error?: string }> {
	const bcrypt = await import('bcrypt')

	const userRes = await db.execute(
		sql`SELECT password FROM users WHERE id = ${userId}`,
	)
	const user = userRes.rows[0] as { password: string } | undefined
	if (!user) {
		return { ok: false, error: 'User not found.' }
	}

	const valid = await bcrypt.compare(currentPassword, user.password)
	if (!valid) {
		return { ok: false, error: 'Current password is incorrect.' }
	}

	const hashed = await bcrypt.hash(newPassword, 10)
	await db.execute(
		sql`UPDATE users SET password = ${hashed} WHERE id = ${userId}`,
	)
	return { ok: true }
}

export async function getUserByEmail(email: string) {
	const result = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1)
	return result.at(0) ?? null
}

export async function getUserByIdOrEmail(userId: number | string) {
	const where =
		typeof userId === 'number'
			? sql`u.id = ${userId}`
			: sql`u.email = ${userId}`
	const res = await db.execute(
		sql`SELECT u.* FROM users u WHERE ${where} LIMIT 1`,
	)
	const user = z.safeParse(userSchema, res.rows[0])
	return user.success ? user.data : null
}
