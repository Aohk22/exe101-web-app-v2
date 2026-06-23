import { Clock } from 'lucide-react'
import { Link } from 'react-router'
import type { DashboardData } from '~/.server/queries/dashboard'
import { formatCourseLength } from '~/utils/format-course-length'

export default function RecommendedCourseCard({
	course,
}: {
	course: DashboardData
}) {
	if (course.length === 0) {
		return null
	}
	return (
		<Link
			key={course.id}
			to={`/course/${course.id}`}
			className="group flex gap-3 p-3 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
		>
			<div className="w-20 h-14 shrink-0 rounded-lg overflow-hidden">
				<img
					src={course.thumbnail}
					alt={course.title}
					className="w-full h-full object-cover"
					referrerPolicy="no-referrer"
				/>
			</div>
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2 mb-0.5">
					<span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
						{course.category}
					</span>
					<div className="flex items-center gap-1 text-[10px] text-slate-500">
						<Clock className="w-2.5 h-2.5" />
						{formatCourseLength(course.length)}
					</div>
				</div>
				<h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
					{course.title}
				</h3>
				<p className="text-[11px] text-slate-500 mt-0.5">
					By {course.instructor} &middot; {course.lessonsCount}{' '}
					lessons
				</p>
			</div>
		</Link>
	)
}
