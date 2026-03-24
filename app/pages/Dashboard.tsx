import { BookOpen, Clock, Star, GraduationCap } from 'lucide-react'
import { Await } from 'react-router'
import { userContext } from '~/context'
import type { Route } from './+types/Dashboard'
import ContinueLearningCard from '~/components/ContinueLearning'
import RecommendedCourseCard from '~/components/RecommendedCourseCard'
import { NoUserContextError } from '~/error'
import {
	getDashboardData,
	type DashboardData,
} from '~/.server/queries/dashboard'
import React from 'react'
import StatCard from '~/components/StatCard'
import ContinueLearningFallback from '~/components/fallbacks/ContinueLearningFallback'
import RecommendedCourseFallback from '~/components/fallbacks/RecommendedCourseFallback'
// import { delay } from 'utils'

export const handle = {
}

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(userContext)
	if (user === null) throw new NoUserContextError('User context resolved to null.')

	// let courses = delay(2000).then(() => getDashboardData(user.id))
	let courses = getDashboardData(user.id)

	return { courses }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
	let { courses } = loaderData

	return (
		<div className="space-y-10">
			<section className="grid grid-cols-4 gap-4">
				<StatCard label="Courses in Progress"
					value={courses.then(cs => cs.filter(c => c.completed === false).length)}
					icon={BookOpen} color="text-blue-400" bg="bg-blue-400/10" />

				<StatCard label="Completed Courses"
					value={courses.then(cs => cs.filter(c => c.completed === true).length)}
					icon={GraduationCap} color="text-emerald-400" bg="bg-emerald-400/10" />

				<StatCard label="Total learning hours"
					value={courses.then(cs => cs.reduce((acc, c) => c.completed ? acc + c.length : acc, 0))}
					icon={Clock} color="text-amber-400" bg="bg-amber-400/10" />

				<StatCard label="Achievement Points"
					value="2,450"
					icon={Star} color="text-purple-400" bg="bg-purple-400/10" />
			</section>

			<section>
				<h2 className="text-xl font-semibold text-white mb-6">
					Continue Learning
				</h2>
				<React.Suspense fallback={<ContinueLearningFallback />}>
					<Await resolve={courses}>
						{(value) => <ContinueLearningCard course={value[0]} />}
					</Await>
				</React.Suspense>
			</section>

			<section>
				<h2 className="text-xl font-semibold text-white mb-6">
					Recommended for you
				</h2>
				<React.Suspense fallback={<RecommendedCourseFallback />}>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<Await resolve={courses}>
							{(courses: DashboardData[]) => (courses.map((c) => (
								<RecommendedCourseCard course={c} />
							)))}
						</Await>
					</div>
				</React.Suspense>
			</section>
		</div>
	)
}
