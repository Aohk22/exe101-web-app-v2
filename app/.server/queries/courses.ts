import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/.server/database/connection'
import { courseSchema } from '~/.server/database/schema'

export const coursesViewSchema = courseSchema.extend({
	category: z.string(),
	lessons_count: z.coerce.number(),
})

export type CoursesView = z.infer<typeof coursesViewSchema>

export async function getCoursesData({
	category,
}: {
	category: string | null
}): Promise<CoursesView[]> {
	const res = await db.execute(sql`
		SELECT 
			c.id, c.title, c.description, c.instructor, c.thumbnail, c.length, 
			cat.name AS category,
			COUNT(l.id) AS lessons_count
		FROM courses c
		INNER JOIN categories cat ON c.category_id = cat.id
		LEFT JOIN modules m ON c.id = m.course_id
		LEFT JOIN lessons l ON m.id = l.module_id
		WHERE 1 = 1
		${category ? sql`AND cat.name = ${category}` : sql``}
		GROUP BY c.id, cat.name
		LIMIT 10
	`)

	return z.array(coursesViewSchema).parse(res.rows)
}
