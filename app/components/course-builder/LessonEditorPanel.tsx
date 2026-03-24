import { useState } from 'react'
import MarkdownContent from '~/components/MarkdownContent'
import type { ModuleDraft } from './types'

type LessonEditorPanelProps = {
	courseId: number | null
	modules: ModuleDraft[]
	selectedModuleClientId: string | null
	selectedLessonClientId: string | null
	onSelectModule: (moduleClientId: string) => void
	onLessonFieldChange: (
		moduleClientId: string,
		lessonClientId: string,
		field: 'title' | 'contentMd',
		value: string,
	) => void
	onLessonLengthChange: (
		moduleClientId: string,
		lessonClientId: string,
		value: number,
	) => void
}

export default function LessonEditorPanel({
	courseId,
	modules,
	selectedModuleClientId,
	selectedLessonClientId,
	onSelectModule,
	onLessonFieldChange,
	onLessonLengthChange,
}: LessonEditorPanelProps) {
	const selectedModule =
		modules.find((module) => module.clientId === selectedModuleClientId) ?? null
	const selectedLesson =
		selectedModule?.lessons.find(
			(lesson) => lesson.clientId === selectedLessonClientId,
		) ?? null
	const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

	return (
		<div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h2 className="text-base font-bold text-white">
						Lesson Editor
					</h2>
					<p className="mt-1 text-xs text-slate-400">
						Write markdown freely. Nothing is submitted until you save
						the draft.
					</p>
				</div>
				{courseId != null && selectedLesson?.id != null ? (
					<a
						href={`/courses/${courseId}/lessons/${selectedLesson.id}`}
						className="rounded-xl border border-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
					>
						Open Lesson
					</a>
				) : null}
			</div>

			{selectedModule && selectedLesson ? (
				<>
					<div className="mt-5 flex items-center gap-2 border-b border-slate-800">
						<button
							type="button"
							onClick={() => setActiveTab('write')}
							className={`rounded-t-xl px-4 py-2 text-sm font-medium transition-colors ${
								activeTab === 'write'
									? 'bg-slate-950 text-white border border-slate-800 border-b-slate-950'
									: 'text-slate-400 hover:text-slate-200'
							}`}
						>
							Write
						</button>
						<button
							type="button"
							onClick={() => setActiveTab('preview')}
							className={`rounded-t-xl px-4 py-2 text-sm font-medium transition-colors ${
								activeTab === 'preview'
									? 'bg-slate-950 text-white border border-slate-800 border-b-slate-950'
									: 'text-slate-400 hover:text-slate-200'
							}`}
						>
							Preview
						</button>
					</div>

					<div className="mt-4 space-y-4">
						<div className="grid gap-4 md:grid-cols-[1.2fr_0.7fr]">
							<label className="space-y-2">
								<span className="text-sm font-medium text-slate-300">
									Lesson title
								</span>
								<input
									type="text"
									value={selectedLesson.title}
									onChange={(event) =>
										onLessonFieldChange(
											selectedModule.clientId,
											selectedLesson.clientId,
											'title',
											event.target.value,
										)
									}
									className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
								/>
							</label>

							<label className="space-y-2">
								<span className="text-sm font-medium text-slate-300">
									Length (seconds)
								</span>
								<input
									type="number"
									min={0}
									step={1}
									value={selectedLesson.length}
									onChange={(event) =>
										onLessonLengthChange(
											selectedModule.clientId,
											selectedLesson.clientId,
											Number(event.target.value),
										)
									}
									className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
								/>
							</label>
						</div>

						<label className="space-y-2">
							<span className="text-sm font-medium text-slate-300">
								Module
							</span>
							<select
								value={selectedModule.clientId}
								onChange={(event) => onSelectModule(event.target.value)}
								className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
							>
								{modules.map((module) => (
									<option key={module.clientId} value={module.clientId}>
										{module.title || 'Untitled module'}
									</option>
								))}
							</select>
						</label>

						{activeTab === 'write' ? (
							<label className="space-y-2">
								<span className="text-sm font-medium text-slate-300">
									Markdown
								</span>
								<textarea
									value={selectedLesson.contentMd}
									onChange={(event) =>
										onLessonFieldChange(
											selectedModule.clientId,
											selectedLesson.clientId,
											'contentMd',
											event.target.value,
										)
									}
									rows={18}
									className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 font-mono text-sm leading-6 text-slate-100 outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
									placeholder="# Lesson title&#10;&#10;Start writing markdown here..."
								/>
							</label>
						) : (
							<div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
								{selectedLesson.contentMd.trim() ? (
									<MarkdownContent content={selectedLesson.contentMd} />
								) : (
									<p className="text-sm text-slate-400">
										No markdown yet for this lesson.
									</p>
								)}
							</div>
						)}
					</div>
				</>
			) : (
				<div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-6 text-sm text-slate-400">
					Select a lesson to edit its markdown.
				</div>
			)}
		</div>
	)
}
