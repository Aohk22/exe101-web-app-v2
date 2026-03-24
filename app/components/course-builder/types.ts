import type { Lesson, Module } from '~/.server/database/schema'
import type { courses } from '~/.server/database/schema'

export type BuilderCourse = typeof courses.$inferSelect & {
	categoryName: string
}

export type CurriculumModule = Module & {
	lessons: Lesson[]
}

export type LessonDraft = {
	clientId: string
	id: number | null
	title: string
	length: number
	contentMd: string
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
