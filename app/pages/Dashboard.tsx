import { BookOpen, Clock, Star, GraduationCap } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { userContext } from '~/context'
import type { Route } from './+types/Dashboard'
import ContinueLearning from '~/components/ContinueLearning'
import RecommendedCourses from '~/components/RecommendedCourses'
import type { User } from '~/.server/database/schema'
import { NoUserContextError } from '~/error'
import { getDashboardData, type DashboardData } from '~/.server/queries/dashboard'
import { formatCourseLength } from '~/utils/format-course-length'

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(userContext)
	if (user === null) {
		throw new NoUserContextError('User context resolved to null.')
	}

	const courses = await getDashboardData(user.id)

	return { user, courses }
}

export default function Dashboard() {
	const { user, courses }: { user: User, courses: DashboardData[] } = useLoaderData()
	const continueCourse = courses[0]
	const recommendedCourses = courses.slice(1)
	const completedCourses = courses.filter((c) => c.completed === true)
	const totalCourseSeconds = courses.reduce((acc, course) => acc + course.length, 0)
	const learningSeconds = completedCourses.reduce((acc, course) => acc + course.length, 0)
	const goalProgress =
		totalCourseSeconds === 0
			? 0
			: Math.round((learningSeconds / totalCourseSeconds) * 100)

	return (
		<div className="space-y-10">
			{/* Welcome Section */}
			<section>
				<h1 className="text-3xl font-bold text-white">
					Welcome back, {user.name}!
				</h1>
				<p className="text-slate-400 mt-1">
					You've completed {goalProgress}% of your goal. Keep it up!
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
						value: completedCourses.length,
						icon: GraduationCap,
						color: 'text-emerald-400',
						bg: 'bg-emerald-400/10',
					},
					{
						label: 'Learning Hours',
						value: formatCourseLength(learningSeconds),
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
						className="bg-slate-900 border border-slate-800 p-6 rounded-xl"
					>
						<div
							className={
								stat.bg +
								' w-10 h-10 rounded-lg flex items-center justify-center mb-4'
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
