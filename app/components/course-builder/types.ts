import type { Lesson, Module } from '~/.server/database/types'
import type { courses } from '~/.server/database/schema'

export type BuilderCourse = typeof courses.$inferSelect & {
	categoryName: string
}

export type CurriculumModule = Module & {
	lessons: Lesson[]
}

export type ChallengeOptionDraft = {
	clientId: string
	id: number | null
	optionText: string
	isCorrect: boolean
}

export type ChallengeQuestionDraft = {
	clientId: string
	id: number | null
	questionText: string
	type: 'multiple_choice' | 'flag'
	correctAnswer: string
	options: ChallengeOptionDraft[]
}

export type LessonDraft = {
	clientId: string
	id: number | null
	title: string
	length: number
	contentMd: string
	challengeQuestions: ChallengeQuestionDraft[]
}

export type ModuleDraft = {
	clientId: string
	id: number | null
	title: string
	lessons: LessonDraft[]
}

export type CourseDraft = {
	id: number | null
	title: string
	description: string
	instructor: string
	thumbnail: string
	length: number
	categoryId: number | null
	modules: ModuleDraft[]
	selectedModuleClientId: string | null
	selectedLessonClientId: string | null
}

export type ActionResult = {
	error?: string
}
