import { sql } from "drizzle-orm";
import { db } from "../database/connection";
import { z } from 'zod'

const dashboardDataSchema = z.object({
    id: z.coerce.number(),
    title: z.string(),
    description: z.string(),
    instructor: z.string(),
    thumbnail: z.string(),
    length: z.coerce.number(),
    category: z.string(),
    lessonsCount: z.coerce.number(),
    lessonsCompleted: z.coerce.number(),
    completed: z.boolean(),
})

export type DashboardData = z.infer<typeof dashboardDataSchema>

export async function getDashboardData(
    userId: number
): Promise<DashboardData[]> {
    const res = (await db.execute(sql`
		SELECT 
			c.id, 
            c.title,
            c.description,
            c.instructor,
            c.thumbnail,
            c.length,

			cat.name AS category,

			COUNT(l.id) 
                AS "lessonsCount",
			COUNT(CASE WHEN utl.completed = true THEN 1 END)
                AS "lessonsCompleted",
            COUNT(l.id) = COUNT(CASE WHEN utl.completed = true THEN 1 END) 
                AS "completed"

		FROM courses c
        INNER JOIN users_to_courses utc ON c.id = utc.course_id AND utc.user_id = ${userId}
		INNER JOIN categories cat ON c.category_id = cat.id
		INNER JOIN modules m ON c.id = m.course_id
		INNER JOIN lessons l ON m.id = l.module_id
		INNER JOIN users_to_lessons utl ON l.id = utl.lesson_id
		INNER JOIN users u on utl.user_id = u.id
		WHERE u.id = ${userId}
		GROUP BY c.id, cat.name
	`)).rows

    console.log(res)

    if (res.length === 0) {
        return []
    }

    const data = z.array(dashboardDataSchema).parse(res)
    return data
}