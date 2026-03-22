import { getCourseDetailData, type CourseDetails } from '~/.server/queries/course-detail'

type LessonWithModule = CourseDetails['modules'][number]['lessons'][number] & {
	moduleId: number
	moduleTitle: string
	moduleIndex: number
	lessonIndex: number
}

export type LessonPageData = {
	course: CourseDetails
	currentLesson: LessonWithModule
	previousLessonId: number | null
	nextLessonId: number | null
	completedLessonsCount: number
	totalLessonsCount: number
	progressPercent: number
}

export async function getLessonPageData({
	courseId,
	lessonId,
	userId,
}: {
	courseId: number
	lessonId: number
	userId: number
}): Promise<LessonPageData | null> {
	const courseData = await getCourseDetailData(courseId, userId)
	if (courseData == null || !courseData.enrolled) {
		return null
	}

	const allLessons = courseData.course.modules.flatMap((module, moduleIndex) =>
		module.lessons.map((lesson, lessonIndex) => ({
			...lesson,
			moduleId: module.id,
			moduleTitle: module.title,
			moduleIndex,
			lessonIndex,
		})),
	)

	const currentLessonIndex = allLessons.findIndex((lesson) => lesson.id === lessonId)
	if (currentLessonIndex === -1) {
		return null
	}

	const currentLesson = allLessons[currentLessonIndex]
	const completedLessonsCount = allLessons.filter((lesson) => lesson.completed).length
	const totalLessonsCount = allLessons.length
	const progressPercent =
		totalLessonsCount === 0
			? 0
			: Math.round((completedLessonsCount / totalLessonsCount) * 100)

	return {
		course: courseData.course,
		currentLesson,
		previousLessonId: allLessons[currentLessonIndex - 1]?.id ?? null,
		nextLessonId: allLessons[currentLessonIndex + 1]?.id ?? null,
		completedLessonsCount,
		totalLessonsCount,
		progressPercent,
	}
}
