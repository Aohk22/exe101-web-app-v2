import type { ReactNode } from 'react'

function renderInline(text: string): ReactNode[] {
	const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean)

	return parts.map((part, index) => {
		if (part.startsWith('`') && part.endsWith('`')) {
			return (
				<code
					key={index}
					className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[0.9em] text-slate-100"
				>
					{part.slice(1, -1)}
				</code>
			)
		}

		if (part.startsWith('**') && part.endsWith('**')) {
			return <strong key={index}>{part.slice(2, -2)}</strong>
		}

		if (part.startsWith('*') && part.endsWith('*')) {
			return <em key={index}>{part.slice(1, -1)}</em>
		}

		return part
	})
}

export default function MarkdownContent({ content }: { content: string }) {
	const blocks = content.trim().split(/\n\s*\n/)

	return (
		<div className="space-y-5">
			{blocks.map((block, index) => {
				const lines = block.split('\n')
				const firstLine = lines[0]

				if (block.startsWith('```') && block.endsWith('```')) {
					const code = lines.slice(1, -1).join('\n')
					return (
						<pre
							key={index}
							className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200"
						>
							<code>{code}</code>
						</pre>
					)
				}

				if (firstLine.startsWith('# ')) {
					return (
						<h1 key={index} className="text-3xl font-bold text-white">
							{firstLine.slice(2)}
						</h1>
					)
				}

				if (firstLine.startsWith('## ')) {
					return (
						<h2 key={index} className="text-2xl font-bold text-white">
							{firstLine.slice(3)}
						</h2>
					)
				}

				if (firstLine.startsWith('### ')) {
					return (
						<h3 key={index} className="text-xl font-bold text-white">
							{firstLine.slice(4)}
						</h3>
					)
				}

				if (lines.every((line) => line.startsWith('- '))) {
					return (
						<ul key={index} className="list-disc space-y-2 pl-6 text-slate-300">
							{lines.map((line, lineIndex) => (
								<li key={lineIndex}>{renderInline(line.slice(2))}</li>
							))}
						</ul>
					)
				}

				if (lines.every((line) => /^\d+\.\s/.test(line))) {
					return (
						<ol key={index} className="list-decimal space-y-2 pl-6 text-slate-300">
							{lines.map((line, lineIndex) => (
								<li key={lineIndex}>
									{renderInline(line.replace(/^\d+\.\s/, ''))}
								</li>
							))}
						</ol>
					)
				}

				if (firstLine.startsWith('> ')) {
					return (
						<blockquote
							key={index}
							className="border-l-4 border-emerald-500/50 pl-4 italic text-slate-300"
						>
							{renderInline(lines.map((line) => line.replace(/^>\s?/, '')).join(' '))}
						</blockquote>
					)
				}

				return (
					<p key={index} className="leading-7 text-slate-300">
						{renderInline(lines.join(' '))}
					</p>
				)
			})}
		</div>
	)
}
