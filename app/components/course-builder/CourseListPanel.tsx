import { BookOpen, Clock3, SquarePen } from 'lucide-react'
import { Link } from 'react-router'
import { formatCourseLength } from '~/utils/format-course-length'
import type { BuilderCourse } from './types'

type CourseListPanelProps = {
	courses: BuilderCourse[]
	selectedCourseId: number | null
	buildPath: (params: { courseId?: number }) => string
}

export default function CourseListPanel({
	courses,
	selectedCourseId,
	buildPath,
}: CourseListPanelProps) {
	return (
		<section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h2 className="text-lg font-bold text-white">
						Existing Courses
					</h2>
					<p className="mt-1 text-xs text-slate-400">
						Switch between courses without leaving the builder.
					</p>
				</div>
				<div className="rounded-2xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 w-fit">
					{courses.length} total
				</div>
			</div>

			<div className="mt-4 overflow-x-auto pb-1">
				<div className="flex gap-3 min-w-max">
					{courses.map((course) => {
						const isActive = selectedCourseId === course.id
						return (
							<Link
								key={course.id}
								to={buildPath({ courseId: course.id })}
								className={`w-60 shrink-0 rounded-2xl border p-3 transition-colors ${
									isActive
										? 'border-emerald-500/40 bg-emerald-500/10'
										: 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
								}`}
							>
								<div className="flex items-start justify-between gap-4">
									<div className="min-w-0">
										<p className="truncate text-sm font-semibold text-white">
											{course.title}
										</p>
										<p className="mt-1 line-clamp-2 text-xs text-slate-400">
											{course.description}
										</p>
									</div>
									<SquarePen className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
								</div>
								<div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-400">
									<span className="inline-flex items-center gap-1">
										<BookOpen className="h-3.5 w-3.5" />
										{course.categoryName}
									</span>
									<span className="inline-flex items-center gap-1">
										<Clock3 className="h-3.5 w-3.5" />
										{formatCourseLength(course.length)}
									</span>
								</div>
							</Link>
						)
					})}
				</div>
			</div>
		</section>
	)
}
