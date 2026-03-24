import type { ChangeEvent } from 'react'
import type { Category } from '~/.server/database/schema'
import type { CourseDraft } from './types'

type CourseDetailsFormProps = {
	categories: Category[]
	draft: CourseDraft
	isCreating: boolean
	onFieldChange: (
		field: 'title' | 'description' | 'instructor' | 'thumbnail',
		value: string,
	) => void
	onLengthChange: (value: number) => void
	onCategoryChange: (value: number | null) => void
}

export default function CourseDetailsForm({
	categories,
	draft,
	isCreating,
	onFieldChange,
	onLengthChange,
	onCategoryChange,
}: CourseDetailsFormProps) {
	function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
		onLengthChange(Number(event.target.value))
	}

	function handleCategorySelect(event: ChangeEvent<HTMLSelectElement>) {
		const value = event.target.value
		onCategoryChange(value === '' ? null : Number(value))
	}

	return (
		<div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
			<div>
				<h2 className="text-lg font-bold text-white">
					{isCreating ? 'Create Course' : 'Edit Course'}
				</h2>
				<p className="mt-1 text-xs text-slate-400">
					{isCreating
						? 'Build the whole course locally, then save everything in one pass.'
						: 'Changes stay local until you use the single save button.'}
				</p>
			</div>

			<div className="mt-5 space-y-4">
				<div className="grid gap-4 md:grid-cols-2">
					<label className="space-y-2">
						<span className="text-sm font-medium text-slate-300">
							Title
						</span>
						<input
							type="text"
							value={draft.title}
							onChange={(event) =>
								onFieldChange('title', event.target.value)
							}
							className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
						/>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-medium text-slate-300">
							Instructor
						</span>
						<input
							type="text"
							value={draft.instructor}
							onChange={(event) =>
								onFieldChange('instructor', event.target.value)
							}
							className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
						/>
					</label>
				</div>

				<label className="space-y-2">
					<span className="text-sm font-medium text-slate-300">
						Description
					</span>
					<textarea
						value={draft.description}
						onChange={(event) =>
							onFieldChange('description', event.target.value)
						}
						rows={4}
						maxLength={255}
						className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
					/>
				</label>

				<div className="grid gap-4 md:grid-cols-[1.5fr_0.8fr_1fr]">
					<label className="space-y-2">
						<span className="text-sm font-medium text-slate-300">
							Thumbnail URL
						</span>
						<input
							type="url"
							value={draft.thumbnail}
							onChange={(event) =>
								onFieldChange('thumbnail', event.target.value)
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
							value={draft.length}
							onChange={handleNumberChange}
							className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
						/>
					</label>

					<label className="space-y-2">
						<span className="text-sm font-medium text-slate-300">
							Category
						</span>
						<select
							value={draft.categoryId == null ? '' : String(draft.categoryId)}
							onChange={handleCategorySelect}
							className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
						>
							<option value="">Select category</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</label>
				</div>
			</div>
		</div>
	)
}
