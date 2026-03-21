import { Link, redirect, useLoaderData } from 'react-router'
import {
	Play,
	CheckCircle2,
	Clock,
	BookOpen,
	User,
	Star,
	Share2,
	ChevronRight,
	GraduationCap,
} from 'lucide-react'
import { userContext } from '~/context'
import type { Route } from './+types/CourseDetail'
import { NoUserContextError } from '~/error'
import { getCourseDetailData } from '~/.server/queries/course-detail'
import type { CourseDetails } from '~/.server/queries/course-detail'

export async function loader({ context, params }: Route.LoaderArgs) {
	const user = context.get(userContext)
	if (user === null) {
		throw new NoUserContextError('User resoved')
	}
	const courseId = parseInt(params.courseId)
	if (isNaN(courseId)) {
		throw new Error('Invalid path parameter')
	}

	const data = await getCourseDetailData(courseId, user.id)
	if (data == null) {
		throw redirect('/courses')
	}

	return data
}

export default function CourseDetail() {
	const {enrolled: isEnrolled, course}: {
		enrolled: boolean,
		course: CourseDetails
	} = useLoaderData()
	const modules = course.modules
	const lessonsCount = modules.reduce(
		(acc, module) => acc + module.lessons.length,
		0,
	)

	function enrollUser() {  }

	return (
		<div className="space-y-8">
			<div className="space-y-8">
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
							{course?.title ?? 'Course'}
						</span>
					</div>
					<h1 className="text-4xl font-bold text-white tracking-tight">
						{course?.title ?? 'Course'}
					</h1>
					<p className="text-lg text-slate-400 leading-relaxed">
						{course?.description ?? 'Enroll to unlock this course.'}
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-800">
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden">
							<img
								src={`https://ui-avatars.com/api/?name=${course?.instructor ?? 'Instructor'}&background=random`}
								alt={course?.instructor ?? 'Instructor'}
							/>
						</div>
						<div>
							<p className="text-xs text-slate-500 font-medium">
								Instructor
							</p>
							<p className="text-sm font-bold text-white">
								{course?.instructor ?? 'Instructor'}
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

				<div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/20 space-y-6">
					<div className="aspect-video rounded-2xl overflow-hidden relative group">
						<img
							src={course?.thumbnail ?? 'https://picsum.photos/seed/course/1280/720'}
							alt={course?.title ?? 'Course'}
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
						{isEnrolled ? (
							<button
								onClick={enrollUser}
								className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
							>
								Continue
							</button>
						) : (
							<button
								type="button"
								className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
							>
								Enroll Now
							</button>
						)}

						<div className="grid grid-cols-1 gap-2">
							<button className="w-full py-4 flex items-center justify-center gap-2 border border-slate-800 rounded-2xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
								<Share2 className="w-4 h-4" /> Share
							</button>
						</div>
					</div>
				</div>

				{/* Curriculum */}
				{isEnrolled ? (
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-bold text-white">
								Course Content
							</h2>
							<p className="text-sm text-slate-500">
								{modules.length} modules • {lessonsCount}{' '}
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
																	? ' text-slate-500'
																	: ' text-slate-200 group-hover:text-emerald-400')
															}
														>
															{lesson.title}
														</p>
														<div className="flex items-center gap-2 mt-0.5">
															<span className="text-[10px] font-bold uppercase text-slate-500">
																Video
															</span>
															<span className="w-0.5 h-0.5 bg-slate-700 rounded-full"></span>
															<span className="text-[10px] text-slate-500">
																{lesson.length} min
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
				) : (
					<div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
							Enrollment Required
						</p>
						<h2 className="text-2xl font-bold text-white">
							Course Summary
						</h2>
						<p className="text-slate-400 leading-relaxed">
							{course.description}
						</p>
						<div className="space-y-3 pt-2">
							<div className="flex items-center gap-2 text-sm font-medium text-slate-300">
								<BookOpen className="w-4 h-4 text-emerald-500" />
								Modules in this course
							</div>
							<div className="space-y-3">
								{modules.map((module, index) => (
									<div
										key={module.id}
										className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-4"
									>
										<div className="flex items-start justify-between gap-4">
											<div className="min-w-0">
												<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
													Module {index + 1}
												</p>
												<p className="mt-2 text-sm text-slate-200">
													{module.title}
												</p>
											</div>
											<p className="shrink-0 text-xs text-slate-500">
												{module.lessons.length} lessons
											</p>
										</div>
										<div className="mt-4 space-y-2 border-t border-slate-800 pt-4">
											{module.lessons.map((lesson, lessonIndex) => (
												<div
													key={lesson.id}
													className="flex items-center justify-between gap-4 text-sm"
												>
													<div className="min-w-0 text-slate-300">
														<p className="truncate">
															Lesson {lessonIndex + 1}: {lesson.title}
														</p>
													</div>
													<p className="shrink-0 text-xs text-slate-500">
														{lesson.length} min
													</p>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
