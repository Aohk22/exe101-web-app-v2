import { useParams, Link, useLoaderData } from 'react-router'
import { COURSES, MODULES } from '~/constants'
import {
	Play,
	CheckCircle2,
	Clock,
	BookOpen,
	User,
	Star,
	Share2,
	Heart,
	ChevronRight,
	GraduationCap,
} from 'lucide-react'
import type { Route } from './+types/CourseDetail'
import { userContext } from '~/context'
import { getCourse, getCourseModules } from '~/.server/database/utils'

export async function loader({ context, params }: Route.LoaderArgs) {
	const courseId = parseInt(params.courseId)
	if (isNaN(courseId)) {
		throw new Error('Invalid path parameter')
	}

	var mode = 'db'
	const course = await getCourse(courseId)
	var modules

	switch (mode) {
		case 'db':
			modules = await getCourseModules(courseId)
			return { course, modules }
		case 'local':
			modules = MODULES
			return { course, modules }
		default:
			break
	}
}

export default function CourseDetail() {
	const { course, modules } = useLoaderData()

	function enrollUser() {}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
			{/* Left Content */}
			<div className="lg:col-span-2 space-y-8">
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Link
							to="/courses"
							className="text-sm text-slate-500 hover:text-emerald-400 transition-colors"
						>
							Courses
						</Link>
						<ChevronRight className="w-4 h-4 text-slate-700" />
						<span className="text-sm text-slate-200 font-medium">
							{course.title}
						</span>
					</div>
					<h1 className="text-4xl font-bold text-white tracking-tight">
						{course.title}
					</h1>
					<p className="text-lg text-slate-400 leading-relaxed">
						{course.description}
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-800">
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden">
							<img
								src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`}
								alt={course.instructor}
							/>
						</div>
						<div>
							<p className="text-xs text-slate-500 font-medium">
								Instructor
							</p>
							<p className="text-sm font-bold text-white">
								{course.instructor}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
							<Star className="w-5 h-5 text-amber-400 fill-amber-400" />
						</div>
						<div>
							<p className="text-xs text-slate-500 font-medium">
								Rating
							</p>
							<p className="text-sm font-bold text-white">
								4.9 (2.4k reviews)
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
							<User className="w-5 h-5 text-emerald-400" />
						</div>
						<div>
							<p className="text-xs text-slate-500 font-medium">
								Students
							</p>
							<p className="text-sm font-bold text-white">
								15,420 enrolled
							</p>
						</div>
					</div>
				</div>

				{/* Curriculum */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold text-white">
							Course Content
						</h2>
						<p className="text-sm text-slate-500">
							{modules.length} modules • {course.lessonsCount}{' '}
							lessons
						</p>
					</div>

					<div className="space-y-4">
						{modules.map((module, i) => (
							<div
								key={module.id}
								className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm"
							>
								<div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
									<h3 className="font-bold text-white">
										Module {i + 1}: {module.title}
									</h3>
									<span className="text-xs text-slate-500 font-medium">
										{module.lessons.length} lessons
									</span>
								</div>
								<div className="divide-y divide-slate-800/50">
									{module.lessons.map((lesson) => (
										<Link
											key={lesson.id}
											to={`/courses/${course.id}/lessons/${lesson.id}`}
											className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors group"
										>
											<div className="flex items-center gap-4">
												<div
													className={
														'w-8 h-8 rounded-full flex items-center justify-center transition-colors' +
														(lesson.completed
															? 'bg-emerald-500/10 text-emerald-500'
															: 'bg-slate-800 text-slate-600 group-hover:bg-emerald-500/10 group-hover:text-emerald-400')
													}
												>
													{lesson.completed ? (
														<CheckCircle2 className="w-5 h-5" />
													) : (
														<Play className="w-4 h-4" />
													)}
												</div>
												<div>
													<p
														className={
															'text-sm font-medium transition-colors' +
															(lesson.completed
																? 'text-slate-500'
																: 'text-slate-200 group-hover:text-emerald-400')
														}
													>
														{lesson.title}
													</p>
													<div className="flex items-center gap-2 mt-0.5">
														<span className="text-[10px] font-bold uppercase text-slate-500">
															{lesson.type}
														</span>
														<span className="w-0.5 h-0.5 bg-slate-700 rounded-full"></span>
														<span className="text-[10px] text-slate-500">
															{lesson.duration}
														</span>
													</div>
												</div>
											</div>
											{!lesson.completed && (
												<span className="text-xs font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
													Start
												</span>
											)}
										</Link>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Right Sidebar - Sticky Card */}
			<div className="space-y-6">
				<div className="sticky top-24 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/20 space-y-6">
					<div className="aspect-video rounded-2xl overflow-hidden relative group">
						<img
							src={course.thumbnail}
							alt={course.title}
							className="w-full h-full object-cover"
							referrerPolicy="no-referrer"
						/>
						<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
							<div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
								<Play className="w-6 h-6 text-emerald-600 fill-emerald-600 ml-1" />
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<button
							onClick={enrollUser}
							className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
						>
							Start Learning
						</button>

						<div className="grid grid-cols-2 gap-2">
							{/* <button className="flex items-center justify-center gap-2 py-3 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
								<Heart className="w-4 h-4" /> Wishlist
							</button> */}
							<button className="flex items-center justify-center gap-2 py-3 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
								<Share2 className="w-4 h-4" /> Share
							</button>
						</div>
					</div>

					<div className="space-y-4 pt-4 border-t border-slate-800">
						<p className="text-sm font-bold text-white">
							This course includes:
						</p>
						<ul className="space-y-3">
							{[
								{ icon: Clock, text: 'Full lifetime access' },
								{
									icon: BookOpen,
									text: '24 downloadable resources',
								},
								{
									icon: GraduationCap,
									text: 'Certificate of completion',
								},
								{ icon: Play, text: 'Access on mobile and TV' },
							].map((item, i) => (
								<li
									key={i}
									className="flex items-center gap-3 text-sm text-slate-400"
								>
									<item.icon className="w-4 h-4 text-emerald-500" />
									{item.text}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}
