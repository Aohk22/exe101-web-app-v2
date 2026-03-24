import { Search, Clock, BookOpen, ChevronRight } from 'lucide-react'
import { Link, useLoaderData, useSearchParams } from 'react-router'
import { useDeferredValue, useState } from 'react'
import type { Route } from './+types/Courses'
import type { Category } from '~/.server/database/schema'
import { getCategories } from '~/.server/database/utils'
import { getCoursesData, type CoursesView } from '~/.server/queries/courses'
import { formatCourseLength } from '~/utils/format-course-length'

export const handle = {
	section: {
		title: 'Explore Courses',
		subtitle: 'Find the perfect course to advance your career.',
	},
}

export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url)
	const category = url.searchParams.get('cat')
	const categories = await getCategories()
	const courses = await getCoursesData({ category })

	return { categories, courses }
}

export default function Courses() {
	const {
		categories,
		courses,
	}: { categories: Category[]; courses: CoursesView[] } = useLoaderData()
	const [searchParams] = useSearchParams()
	const activeCategory = searchParams.get('cat') ?? 'all'
	const [searchQuery, setSearchQuery] = useState('')
	const deferredSearchQuery = useDeferredValue(searchQuery)
	const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase()
	const filteredCourses = normalizedSearchQuery
		? courses.filter((course) => {
				const haystack = [
					course.title,
					course.description,
					course.instructor,
					course.category,
				]
					.join(' ')
					.toLowerCase()

				return haystack.includes(normalizedSearchQuery)
			})
		: courses

	return (
		<div className="space-y-8">
			<div className="flex justify-end">
				<div className="flex items-center gap-2">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
						<input
							type="text"
							value={searchQuery}
							onChange={(event) =>
								setSearchQuery(event.target.value)
							}
							placeholder="Search courses..."
							className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500/10 focus:border-slate-700 outline-none transition-all w-full md:w-64"
						/>
					</div>
				</div>
			</div>

			{/* Categories */}
			<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
				<Link
					to="/courses"
					className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
						activeCategory === 'all'
							? 'bg-slate-800 text-white border border-slate-700'
							: 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
					}`}
				>
					All Courses
				</Link>
				{categories.map((cat) => (
					<Link
						key={cat.id}
						to={`?cat=${cat.name}`}
						className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
							activeCategory === cat.name
								? 'bg-slate-800 text-white border border-slate-700'
								: 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
						}`}
					>
						{cat.name}
					</Link>
				))}
			</div>

			{/* Course Grid */}
			{filteredCourses.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{filteredCourses.map((course) => {
						return (
							<Link
								key={course.id}
								to={`/courses/${course.id}`}
								className="group flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors duration-300"
							>
								<div className="aspect-[16/10] overflow-hidden relative">
									<img
										src={course.thumbnail}
										alt={course.title}
										className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
										referrerPolicy="no-referrer"
									/>
									<div className="absolute top-4 left-4">
										<span className="bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">
											{course.category}
										</span>
									</div>
								</div>

								<div className="p-6 flex-1 flex flex-col">
									<div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
										<div className="flex items-center gap-1">
											<Clock className="w-3 h-3" />
											{formatCourseLength(course.length)}
										</div>
										<div className="w-1 h-1 bg-slate-700 rounded-full"></div>
										<div className="flex items-center gap-1">
											<BookOpen className="w-3 h-3" />
											{course.lessons_count} lessons
										</div>
									</div>

									<h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
										{course.title}
									</h3>

									<p className="text-sm text-slate-400 line-clamp-2 mb-6">
										{course.description}
									</p>

									<div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
												<img
													src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`}
													alt={course.instructor}
													className="w-full h-full object-cover"
												/>
											</div>
											<span className="text-xs text-slate-400 font-medium">
												{course.instructor}
											</span>
										</div>
										<div className="text-slate-500 group-hover:text-slate-300 transition-colors">
											<ChevronRight className="w-5 h-5" />
										</div>
									</div>
								</div>
							</Link>
						)
					})}
				</div>
			) : (
				<div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-12 text-center">
					<h2 className="text-lg font-bold text-white">
						No courses found
					</h2>
					<p className="mt-2 text-sm text-slate-400">
						Try a different search term
						{activeCategory !== 'all'
							? ` in ${activeCategory}`
							: ''}
						.
					</p>
				</div>
			)}
		</div>
	)
}
