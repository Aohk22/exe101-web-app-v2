/*
This file contains display types for the frontend code.
For actual entity types see schema.ts.
*/

import type { LucideIcon } from 'lucide-react'
import { z } from 'zod'

export const CourseSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	instructor: z.string(),
	thumbnail: z.string(),
	progress: z.number(),
	category: z.string(),
	duration: z.string(),
	lessonsCount: z.number(),
})

export const LessonSchema = z.object({
	id: z.string(),
	title: z.string(),
	duration: z.string(),
	completed: z.boolean(),
	type: z.enum(['video', 'text', 'quiz']),
})

export const ModuleSchema = z.object({
	id: z.string(),
	title: z.string(),
	lessons: z.array(LessonSchema),
})

export const NavItemSchema = z.object({
	label: z.string(),
	href: z.string(),
	icon: z.custom<LucideIcon>(),
})

export type Course = z.infer<typeof CourseSchema>
export type Lesson = z.infer<typeof LessonSchema>
export type Module = z.infer<typeof ModuleSchema>
export type NavItem = z.infer<typeof NavItemSchema>
