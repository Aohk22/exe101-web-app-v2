import { Link, Clock } from 'lucide-react'
import type { CourseUserProgress } from '~/pages/Dashboard'

export default function RecommendedCourses({ courses }: { courses: CourseUserProgress[] }) {
	if (courses.length === 0) {
		return null
	}
	return (
		<section>
			<h2 className="text-xl font-semibold text-white mb-6">
				Recommended for you
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{courses.map((course) => (
					<Link
						key={course.id}
						to={`/courses/${course.id}`}
						className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
					>
						<div className="aspect-video overflow-hidden">
							<img
								src={course.thumbnail}
								alt={course.title}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								referrerPolicy="no-referrer"
							/>
						</div>
						<div className="p-5 space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
									{course.category}
								</span>
								<div className="flex items-center gap-1 text-xs text-slate-400">
									<Clock className="w-3 h-3" />
									{course.length}
								</div>
							</div>
							<h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
								{course.title}
							</h3>
							<div className="flex items-center justify-between pt-2 border-t border-slate-800">
								<p className="text-xs text-slate-500">
									By {course.instructor}
								</p>
								<p className="text-xs font-bold text-slate-300">
									{course.lessons_count} lessons
								</p>
							</div>
						</div>
					</Link>
				))}
			</div>
		</section>
	)
}
