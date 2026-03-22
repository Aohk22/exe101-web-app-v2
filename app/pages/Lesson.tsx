import { Link, redirect, useLoaderData } from 'react-router'
import {
	ChevronLeft,
	ChevronRight,
	BookOpen,
} from 'lucide-react'
import { userContext } from '~/context'
import type { Route } from './+types/Lesson'
import { NoUserContextError } from '~/error'
import { getLessonPageData } from '~/.server/queries/lesson'
import type { LessonPageData } from '~/.server/queries/lesson'
import { formatLessonLength } from '~/utils/format-course-length'
import MarkdownContent from '~/components/MarkdownContent'

export async function loader({ context, params }: Route.LoaderArgs) {
	const user = context.get(userContext)
	if (user === null) {
		throw new NoUserContextError('User resolved')
	}

	const courseId = parseInt(params.courseId)
	const lessonId = parseInt(params.lessonId)
	if (isNaN(courseId) || isNaN(lessonId)) {
		throw new Error('Invalid path parameter')
	}

	const data = await getLessonPageData({
		courseId,
		lessonId,
		userId: user.id,
	})

	if (data == null) {
		throw redirect(`/courses/${courseId}`)
	}

	return data
}

export default function Lesson() {
	const data = useLoaderData<typeof loader>()
	if (data == null) {
		return null
	}

	const {
		course,
		currentLesson,
		previousLessonId,
		nextLessonId,
		completedLessonsCount,
		totalLessonsCount,
		progressPercent,
	}: LessonPageData = data

	return (
		<div className="flex flex-col text-slate-200">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<Link
						to={`/courses/${course.id}`}
						className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
					>
						<ChevronLeft className="w-6 h-6" />
					</Link>
					<div>
						<h1 className="text-xl font-bold text-white">
							{currentLesson.lessonIndex + 1}. {currentLesson.title}
						</h1>
						<p className="text-sm text-slate-400">{course.title}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{previousLessonId ? (
						<Link
							to={`/courses/${course.id}/lessons/${previousLessonId}`}
							className="px-4 py-2 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
						>
							Previous
						</Link>
					) : (
						<span className="px-4 py-2 border border-slate-800 rounded-xl text-sm font-medium text-slate-500">
							Previous
						</span>
					)}
					{nextLessonId ? (
						<Link
							to={`/courses/${course.id}/lessons/${nextLessonId}`}
							className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
						>
							Next Lesson
						</Link>
					) : (
						<span className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-sm font-medium">
							Completed
						</span>
					)}
				</div>
			</div>

			<div>
				<div className="mb-8 flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
							{currentLesson.moduleTitle}
						</p>
						<h2 className="mt-2 text-2xl font-bold text-white">
							{currentLesson.title}
						</h2>
						<p className="mt-2 text-sm text-slate-400">
							{completedLessonsCount}/{totalLessonsCount} lessons completed • {progressPercent}% progress
						</p>
					</div>
					<div className="shrink-0 rounded-xl border border-slate-800 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300">
						{formatLessonLength(currentLesson.length)}
					</div>
				</div>

				<MarkdownContent content={currentLesson.contentMd} />
			</div>
		</div>
	)
}
