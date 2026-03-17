import { COURSES } from '~/constants'
import { Search, Filter, Clock, BookOpen, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { useState } from 'react'

export default function Courses() {
	const [activeCategory, setActiveCategory] = useState('All')
	const categories = [
		'All',
		'Offensive Security',
		'Defensive Security',
		'Forensics',
		'Cloud Security',
		'Compliance',
	]

	const filteredCourses =
		activeCategory === 'All'
			? COURSES
			: COURSES.filter((c) => c.category === activeCategory)

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div>
					<h1 className="text-3xl font-bold text-white">
						Explore Courses
					</h1>
					<p className="text-slate-400 mt-1">
						Find the perfect course to advance your career.
					</p>
				</div>

				<div className="flex items-center gap-2">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
						<input
							type="text"
							placeholder="Search courses..."
							className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all w-full md:w-64"
						/>
					</div>
					<button className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
						<Filter className="w-5 h-5 text-slate-400" />
					</button>
				</div>
			</div>

			{/* Categories */}
			<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
				{categories.map((cat) => (
					<button
						key={cat}
						onClick={() => setActiveCategory(cat)}
						className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
							activeCategory === cat
								? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
								: 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
						}`}
					>
						{cat}
					</button>
				))}
			</div>

			{/* Course Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{filteredCourses.map((course) => (
					<Link
						key={course.id}
						to={`/courses/${course.id}`}
						className="group flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
					>
						<div className="aspect-[16/10] overflow-hidden relative">
							<img
								src={course.thumbnail}
								alt={course.title}
								className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
									{course.duration}
								</div>
								<div className="w-1 h-1 bg-slate-700 rounded-full"></div>
								<div className="flex items-center gap-1">
									<BookOpen className="w-3 h-3" />
									{course.lessonsCount} lessons
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
								<div className="text-emerald-500 group-hover:translate-x-1 transition-transform">
									<ChevronRight className="w-5 h-5" />
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
