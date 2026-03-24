import { FileText, FolderTree, Save, SlidersHorizontal } from 'lucide-react'
import { Form, useNavigation } from 'react-router'
import { useMemo, useState } from 'react'
import type { Category } from '~/.server/database/schema'
import CourseDetailsForm from './CourseDetailsForm'
import CurriculumPanel from './CurriculumPanel'
import LessonEditorPanel from './LessonEditorPanel'
import type {
	BuilderCourse,
	CourseDraft,
	CurriculumModule,
	LessonDraft,
	ModuleDraft,
} from './types'

type CourseBuilderWorkspaceProps = {
	categories: Category[]
	selectedCourse: BuilderCourse | null
	curriculum: CurriculumModule[]
	selectedModuleId: number | null
	selectedLessonId: number | null
}

function createClientId(prefix: string) {
	return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function toLessonDraft(lesson: CurriculumModule['lessons'][number]): LessonDraft {
	return {
		clientId: `lesson-${lesson.id}`,
		id: lesson.id,
		title: lesson.title,
		length: lesson.length,
		contentMd: lesson.contentMd,
	}
}

function toModuleDraft(module: CurriculumModule): ModuleDraft {
	return {
		clientId: `module-${module.id}`,
		id: module.id,
		title: module.title,
		lessons: module.lessons.map(toLessonDraft),
	}
}

function buildInitialDraft(
	selectedCourse: BuilderCourse | null,
	curriculum: CurriculumModule[],
	selectedModuleId: number | null,
	selectedLessonId: number | null,
): CourseDraft {
	const modules = curriculum.map(toModuleDraft)
	const initialSelectedModule =
		modules.find((module) => module.id === selectedModuleId) ?? modules[0] ?? null
	const initialSelectedLesson =
		initialSelectedModule?.lessons.find((lesson) => lesson.id === selectedLessonId) ??
		initialSelectedModule?.lessons[0] ??
		null

	return {
		id: selectedCourse?.id ?? null,
		title: selectedCourse?.title ?? '',
		description: selectedCourse?.description ?? '',
		instructor: selectedCourse?.instructor ?? '',
		thumbnail: selectedCourse?.thumbnail ?? '',
		length: selectedCourse?.length ?? 0,
		categoryId: selectedCourse?.categoryId ?? null,
		modules,
		selectedModuleClientId: initialSelectedModule?.clientId ?? null,
		selectedLessonClientId: initialSelectedLesson?.clientId ?? null,
	}
}

export default function CourseBuilderWorkspace({
	categories,
	selectedCourse,
	curriculum,
	selectedModuleId,
	selectedLessonId,
}: CourseBuilderWorkspaceProps) {
	const navigation = useNavigation()
	const [draft, setDraft] = useState(() =>
		buildInitialDraft(
			selectedCourse,
			curriculum,
			selectedModuleId,
			selectedLessonId,
		),
	)
	const isSaving = navigation.state === 'submitting'
	const [activeSection, setActiveSection] = useState<
		'course' | 'curriculum' | 'lesson'
	>('course')
	const selectedModule = useMemo(
		() =>
			draft.modules.find(
				(module) => module.clientId === draft.selectedModuleClientId,
			) ?? null,
		[draft.modules, draft.selectedModuleClientId],
	)

	function updateDraft(updater: (current: CourseDraft) => CourseDraft) {
		setDraft((current) => updater(current))
	}

	function handleCourseFieldChange(
		field: 'title' | 'description' | 'instructor' | 'thumbnail',
		value: string,
	) {
		updateDraft((current) => ({ ...current, [field]: value }))
	}

	function handleLengthChange(value: number) {
		updateDraft((current) => ({
			...current,
			length: Number.isFinite(value) ? value : 0,
		}))
	}

	function handleCategoryChange(value: number | null) {
		updateDraft((current) => ({ ...current, categoryId: value }))
	}

	function handleSelectModule(moduleClientId: string) {
		updateDraft((current) => {
			const selected = current.modules.find(
				(module) => module.clientId === moduleClientId,
			)

			return {
				...current,
				selectedModuleClientId: moduleClientId,
				selectedLessonClientId: selected?.lessons[0]?.clientId ?? null,
			}
		})
	}

	function handleSelectLesson(moduleClientId: string, lessonClientId: string) {
		updateDraft((current) => ({
			...current,
			selectedModuleClientId: moduleClientId,
			selectedLessonClientId: lessonClientId,
		}))
	}

	function handleAddModule() {
		const moduleClientId = createClientId('module')
		updateDraft((current) => ({
			...current,
			modules: [
				...current.modules,
				{
					clientId: moduleClientId,
					id: null,
					title: '',
					lessons: [],
				},
			],
			selectedModuleClientId: moduleClientId,
			selectedLessonClientId: null,
		}))
	}

	function handleUpdateModuleTitle(moduleClientId: string, title: string) {
		updateDraft((current) => ({
			...current,
			modules: current.modules.map((module) =>
				module.clientId === moduleClientId ? { ...module, title } : module,
			),
		}))
	}

	function handleAddLesson(moduleClientId: string) {
		const lessonClientId = createClientId('lesson')
		updateDraft((current) => ({
			...current,
			modules: current.modules.map((module) =>
				module.clientId === moduleClientId
					? {
							...module,
							lessons: [
								...module.lessons,
								{
									clientId: lessonClientId,
									id: null,
									title: '',
									length: 0,
									contentMd: '',
								},
							],
						}
					: module,
			),
			selectedModuleClientId: moduleClientId,
			selectedLessonClientId: lessonClientId,
		}))
	}

	function handleLessonFieldChange(
		moduleClientId: string,
		lessonClientId: string,
		field: 'title' | 'contentMd',
		value: string,
	) {
		updateDraft((current) => ({
			...current,
			modules: current.modules.map((module) =>
				module.clientId === moduleClientId
					? {
							...module,
							lessons: module.lessons.map((lesson) =>
								lesson.clientId === lessonClientId
									? { ...lesson, [field]: value }
									: lesson,
							),
						}
					: module,
			),
		}))
	}

	function handleLessonLengthChange(
		moduleClientId: string,
		lessonClientId: string,
		value: number,
	) {
		updateDraft((current) => ({
			...current,
			modules: current.modules.map((module) =>
				module.clientId === moduleClientId
					? {
							...module,
							lessons: module.lessons.map((lesson) =>
								lesson.clientId === lessonClientId
									? {
											...lesson,
											length: Number.isFinite(value) ? value : 0,
										}
									: lesson,
							),
						}
					: module,
			),
		}))
	}

	function handleMoveSelectedLesson(nextModuleClientId: string) {
		if (
			draft.selectedModuleClientId == null ||
			draft.selectedLessonClientId == null ||
			draft.selectedModuleClientId === nextModuleClientId
		) {
			handleSelectModule(nextModuleClientId)
			return
		}

		updateDraft((current) => {
			const sourceModule = current.modules.find(
				(module) => module.clientId === current.selectedModuleClientId,
			)
			const movingLesson = sourceModule?.lessons.find(
				(lesson) => lesson.clientId === current.selectedLessonClientId,
			)

			if (!movingLesson) {
				return {
					...current,
					selectedModuleClientId: nextModuleClientId,
				}
			}

			return {
				...current,
				modules: current.modules.map((module) => {
					if (module.clientId === current.selectedModuleClientId) {
						return {
							...module,
							lessons: module.lessons.filter(
								(lesson) => lesson.clientId !== movingLesson.clientId,
							),
						}
					}

					if (module.clientId === nextModuleClientId) {
						return {
							...module,
							lessons: [...module.lessons, movingLesson],
						}
					}

					return module
				}),
				selectedModuleClientId: nextModuleClientId,
				selectedLessonClientId: movingLesson.clientId,
			}
		})
	}

	return (
		<Form method="post" className="space-y-6">
			<input type="hidden" name="intent" value="save-draft" />
			<input type="hidden" name="draftJson" value={JSON.stringify(draft)} />

			<div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
				<aside className="xl:sticky xl:top-24 h-fit rounded-3xl border border-slate-800 bg-slate-900 p-3">
					<p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
						Builder Nav
					</p>
					<div className="mt-2 space-y-2">
						<button
							type="button"
							onClick={() => setActiveSection('course')}
							className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-colors ${
								activeSection === 'course'
									? 'bg-emerald-500/10 text-emerald-300'
									: 'text-slate-300 hover:bg-slate-800'
							}`}
						>
							<SlidersHorizontal className="h-4 w-4" />
							<div>
								<p>Course Details</p>
								<p className="text-xs text-slate-500">
									Title, category, thumbnail
								</p>
							</div>
						</button>

						<button
							type="button"
							onClick={() => setActiveSection('curriculum')}
							className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-colors ${
								activeSection === 'curriculum'
									? 'bg-emerald-500/10 text-emerald-300'
									: 'text-slate-300 hover:bg-slate-800'
							}`}
						>
							<FolderTree className="h-4 w-4" />
							<div>
								<p>Curriculum</p>
								<p className="text-xs text-slate-500">
									Manage modules and lessons
								</p>
							</div>
						</button>

						<button
							type="button"
							onClick={() => setActiveSection('lesson')}
							className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-colors ${
								activeSection === 'lesson'
									? 'bg-emerald-500/10 text-emerald-300'
									: 'text-slate-300 hover:bg-slate-800'
							}`}
						>
							<FileText className="h-4 w-4" />
							<div>
								<p>Lesson Editor</p>
								<p className="text-xs text-slate-500">
									Edit markdown and preview
								</p>
							</div>
						</button>
					</div>

					<div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
						<div>{draft.modules.length} modules in draft</div>
						<div className="mt-1">
							{draft.modules.reduce(
								(total, module) => total + module.lessons.length,
								0,
							)}{' '}
							lessons in draft
						</div>
					</div>

					<button
						type="submit"
						className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
						disabled={isSaving}
					>
						<Save className="h-4 w-4" />
						{isSaving ? 'Saving...' : 'Save All Changes'}
					</button>
				</aside>

				<div className="min-w-0 space-y-6">
					{activeSection === 'course' ? (
						<CourseDetailsForm
							categories={categories}
							draft={draft}
							isCreating={selectedCourse == null}
							onFieldChange={handleCourseFieldChange}
							onLengthChange={handleLengthChange}
							onCategoryChange={handleCategoryChange}
						/>
					) : null}

					{activeSection === 'curriculum' ? (
						<CurriculumPanel
							modules={draft.modules}
							selectedModuleClientId={draft.selectedModuleClientId}
							selectedLessonClientId={draft.selectedLessonClientId}
							onSelectModule={handleSelectModule}
							onSelectLesson={handleSelectLesson}
							onAddModule={handleAddModule}
							onUpdateModuleTitle={handleUpdateModuleTitle}
							onAddLesson={handleAddLesson}
						/>
					) : null}

					{activeSection === 'lesson' ? (
						<LessonEditorPanel
							courseId={selectedCourse?.id ?? null}
							modules={draft.modules}
							selectedModuleClientId={draft.selectedModuleClientId}
							selectedLessonClientId={draft.selectedLessonClientId}
							onSelectModule={handleMoveSelectedLesson}
							onLessonFieldChange={handleLessonFieldChange}
							onLessonLengthChange={handleLessonLengthChange}
						/>
					) : null}
				</div>
			</div>
		</Form>
	)
}
