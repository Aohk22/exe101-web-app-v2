import { BookOpen, Clock, Star, GraduationCap } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { userContext } from '~/context'
import type { Route } from './+types/Dashboard'
import ContinueLearning from '~/components/ContinueLearning'
import RecommendedCourses from '~/components/RecommendedCourses'
import { db } from '~/.server/database/connection'
import { sql } from 'drizzle-orm'
import { courseSchema, type User } from '~/.server/database/schema'
import z from 'zod'
import { NoUserContextError } from '~/error'

const courseUserProgressScheme = courseSchema.extend({
	category: z.string(),
	lessonsCount: z.coerce.number(),
	progress: z.coerce.number(),
})

export type CourseUserProgress = z.infer<typeof courseUserProgressScheme>

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(userContext)
	if (user === null) {
		throw new NoUserContextError('User context resolved to null.')
	}
	const query = sql`
		SELECT 
			c.id, c.title, c.description, c.instructor, c.thumbnail, c.length, 
			cat.name AS category,
			COUNT(l.id) AS lessons_count,
			COUNT(CASE WHEN utl.completed = true THEN 1 END) as progress
		FROM courses c
		INNER JOIN categories cat ON c.category_id = cat.id
		INNER JOIN modules m ON c.id = m.course_id
		INNER JOIN lessons l ON m.id = l.module_id
		LEFT JOIN users_to_lessons utl ON l.id = utl.lesson_id
		INNER JOIN users u on utl.user_id = u.id
		WHERE u.id = ${user.id}
		GROUP BY c.id, cat.name
	`
	const res = await db.execute(query)
	const resMapped = res.rows.map((c) => ({
		...c,
		lessonsCount: c.lessons_count,
	}))

	const courses = z.array(courseUserProgressScheme).parse(resMapped)

	return { user, courses }
}

export default function Dashboard() {
	const { user, courses }: { user: User, courses: CourseUserProgress[] } = useLoaderData()
	const continueCourse = courses[0]
	const recommendedCourses = courses.slice(1)

	return (
		<div className="space-y-10">
			{/* Welcome Section */}
			<section>
				<h1 className="text-3xl font-bold text-white">
					Welcome back, {user.name}! 👋
				</h1>
				<p className="text-slate-400 mt-1">
					You've completed 45% of your weekly goal. Keep it up!
				</p>
			</section>

			{/* Stats Grid */}
			<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						label: 'Courses in Progress',
						value: courses.length,
						icon: BookOpen,
						color: 'text-blue-400',
						bg: 'bg-blue-400/10',
					},
					{
						label: 'Completed Courses',
						value: '12',
						icon: GraduationCap,
						color: 'text-emerald-400',
						bg: 'bg-emerald-400/10',
					},
					{
						label: 'Learning Hours',
						value: '124h',
						icon: Clock,
						color: 'text-amber-400',
						bg: 'bg-amber-400/10',
					},
					{
						label: 'Achievement Points',
						value: '2,450',
						icon: Star,
						color: 'text-purple-400',
						bg: 'bg-purple-400/10',
					},
				].map((stat, i) => (
					<div
						key={i}
						className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm"
					>
						<div
							className={
								stat.bg +
								' w-10 h-10 rounded-xl flex items-center justify-center mb-4'
							}
						>
							<stat.icon className={stat.color + ' w-5 h-5'} />
						</div>
						<p className="text-slate-400 text-sm font-medium">
							{stat.label}
						</p>
						<p className="text-2xl font-bold text-white mt-1">
							{stat.value}
						</p>
					</div>
				))}
			</section>

			<ContinueLearning course={continueCourse} />
			<RecommendedCourses courses={recommendedCourses} />
		</div>
	)
}
