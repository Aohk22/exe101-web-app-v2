import type { Course, Module } from '~/.server/database/schema'
import {
	courses,
	lessons,
	modules,
	users,
	usersToCourses,
} from '~/.server/database/schema'
import { db } from '~/.server/database/connection'
import { eq, sql } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

const courseSchema = createSelectSchema(courses)
const moduleSchema = createSelectSchema(modules)
const lessonSchema = createSelectSchema(lessons)

export async function getUserById(userId: string) {
	const result = (
		await db
			.select()
			.from(users)
			.where(eq(users.id, parseInt(userId)))
	).at(0)
	return result ? result : null
}

export async function getUserCourses(userId: number): Promise<Course[]> {
	const result = await db.execute(sql`
      SELECT c.*
      FROM users u
      INNER JOIN users_to_courses utc on u.id = utc.user_id
      INNER JOIN courses c on utc.course_id = c.id
      WHERE u.id = ${userId}
    `)
	return z.array(courseSchema).parse(result.rows)
}

export async function getCourse(courseId: number): Promise<Course | null> {
	const result = (
		await db.select().from(courses).where(eq(courses.id, courseId))
	).at(0)
	return result ? result : null
}

export async function getCourseModules(courseId: number): Promise<Module[]> {
	const res = await db.execute(sql`
        SELECT m.*
        FROM courses c
        INNER JOIN modules m ON c.id = m.course_id
        WHERE c.id = ${courseId}
    `)
	return z.array(moduleSchema).parse(res.rows)
}

export async function getCourseLessons(courseId: number) {
	const result = await db.execute(sql`
        SELECT l.*
        FROM courses c
        INNER JOIN modules m ON c.id = m.course_id
        INNER JOIN lessons l ON m.id = l.module_id
        WHERE c.id = ${courseId}
    `)
	return z.array(lessonSchema).parse(result.rows)
}

export async function getCourseLessonCount(courseId: number) {
	const result = await db.execute(sql`
        SELECT COUNT(l.id)
        FROM courses c
        INNER JOIN modules m ON c.id = m.course_id
        INNER JOIN lessons l ON m.id = l.module_id
        WHERE c.id = ${courseId}
    `)
	return z.number().parse(result.rows[0])
}

export async function sync(userId: string) {
	throw new Error('Unimplemented')
}
