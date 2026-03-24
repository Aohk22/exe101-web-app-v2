import { FileText, FolderTree, Plus, SquarePen } from 'lucide-react'
import { formatLessonLength } from '~/utils/format-course-length'
import type { ModuleDraft } from './types'

type CurriculumPanelProps = {
	modules: ModuleDraft[]
	selectedModuleClientId: string | null
	selectedLessonClientId: string | null
	onSelectModule: (moduleClientId: string) => void
	onSelectLesson: (moduleClientId: string, lessonClientId: string) => void
	onAddModule: () => void
	onUpdateModuleTitle: (moduleClientId: string, title: string) => void
	onAddLesson: (moduleClientId: string) => void
}

export default function CurriculumPanel({
	modules,
	selectedModuleClientId,
	selectedLessonClientId,
	onSelectModule,
	onSelectLesson,
	onAddModule,
	onUpdateModuleTitle,
	onAddLesson,
}: CurriculumPanelProps) {
	const selectedModule =
		modules.find((module) => module.clientId === selectedModuleClientId) ?? null

	return (
		<div className="space-y-5">
			<div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
				<div className="flex items-center gap-3">
					<div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
						<FolderTree className="h-5 w-5" />
					</div>
					<div>
						<h2 className="text-base font-bold text-white">Modules</h2>
						<p className="text-xs text-slate-400">
							Add and rename course modules.
						</p>
					</div>
				</div>

				<div className="mt-5 space-y-3">
					<button
						type="button"
						onClick={onAddModule}
						className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
					>
						<Plus className="h-4 w-4" />
						Add Module
					</button>

					<div className="space-y-3">
						{modules.length > 0 ? (
							modules.map((module) => {
								const isActive = selectedModuleClientId === module.clientId

								return (
									<div
										key={module.clientId}
										className={`rounded-2xl border p-3 ${
											isActive
												? 'border-emerald-500/40 bg-emerald-500/10'
												: 'border-slate-800 bg-slate-950/50'
										}`}
									>
										<div className="flex items-center justify-between gap-3">
											<input
												type="text"
												value={module.title}
												onFocus={() => onSelectModule(module.clientId)}
												onClick={() => onSelectModule(module.clientId)}
												onChange={(event) =>
													onUpdateModuleTitle(
														module.clientId,
														event.target.value,
													)
												}
												className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
												placeholder="Module title"
											/>
											<span className="text-xs text-slate-400">
												{module.lessons.length} lessons
											</span>
										</div>
									</div>
								)
							})
						) : (
							<div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
								No modules yet. Add the first one to start structuring
								this course.
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
				<div className="flex items-center gap-3">
					<div className="rounded-2xl bg-sky-500/10 p-3 text-sky-400">
						<FileText className="h-5 w-5" />
					</div>
					<div>
						<h2 className="text-base font-bold text-white">Lessons</h2>
						<p className="text-xs text-slate-400">
							Add lessons inside the selected module.
						</p>
					</div>
				</div>

				{selectedModule ? (
					<div className="mt-5 space-y-3">
						<button
							type="button"
							onClick={() => onAddLesson(selectedModule.clientId)}
							className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
						>
							<Plus className="h-4 w-4" />
							Add Lesson
						</button>

						<div className="space-y-2">
							{selectedModule.lessons.length > 0 ? (
								selectedModule.lessons.map((lesson) => {
									const isActive =
										selectedLessonClientId === lesson.clientId

									return (
										<button
											key={lesson.clientId}
											type="button"
											onClick={() =>
												onSelectLesson(
													selectedModule.clientId,
													lesson.clientId,
												)
											}
											className={`block w-full rounded-2xl border px-4 py-2.5 text-left transition-colors ${
												isActive
													? 'border-emerald-500/40 bg-emerald-500/10'
													: 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-950'
											}`}
										>
											<div className="flex items-center justify-between gap-4">
												<div className="min-w-0">
													<p className="truncate font-medium text-white">
														{lesson.title || 'Untitled lesson'}
													</p>
													<p className="mt-1 text-xs text-slate-400">
														{formatLessonLength(lesson.length)}
													</p>
												</div>
												<SquarePen className="h-4 w-4 shrink-0 text-slate-500" />
											</div>
										</button>
									)
								})
							) : (
								<div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
									This module has no lessons yet.
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
						Select or create a module first.
					</div>
				)}
			</div>
		</div>
	)
}
