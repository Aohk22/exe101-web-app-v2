import { ArrowRight, PlayCircle } from 'lucide-react'
import { Link } from 'react-router'
import type { DashboardData } from '~/.server/queries/dashboard'

export default function ContinueLearningCard({
	course,
}: {
	course: DashboardData
}) {
	if (!course) {
		return (
			<section className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
				<h2 className="text-xl font-semibold text-white mb-2">
					No courses in progress
				</h2>
				<p className="text-slate-400 mb-6">
					Ready to level up your skills? Start your first lesson
					today.
				</p>
				<Link
					to="/courses"
					className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium"
				>
					Browse Courses <ArrowRight className="w-4 h-4" />
				</Link>
			</section>
		)
	}
	const percent = (
		(course.lessonsCompleted / course.lessonsCount) *
		100
	).toFixed(2)
	return (
		<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
			<div className="w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden relative group">
				<img
					src={course.thumbnail}
					alt={course.title}
					className="w-full h-full object-cover"
					referrerPolicy="no-referrer"
				/>
				<div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
					<PlayCircle className="w-12 h-12 text-white" />
				</div>
			</div>

			<div className="flex-1 space-y-4">
				<div>
					<span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
						{course.category}
					</span>
					<h3 className="text-2xl font-bold text-white mt-2">
						{course.title}
					</h3>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-slate-400 font-medium">
							{percent}% complete
						</span>
						<span className="text-slate-500">
							{`${course.lessonsCompleted}/${course.lessonsCount}`}{' '}
							lessons
						</span>
					</div>
					<div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
						<div
							className="h-full bg-emerald-500 rounded-full"
							style={{ width: `${percent}%` }}
						/>
					</div>
				</div>

				<Link
					to={`/courses/${course.id}`}
					className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
				>
					Resume Lesson
				</Link>
			</div>
		</div>
	)
}
