import { Outlet, useMatches } from 'react-router'

type SectionValue =
	| string
	| ((match: {
			data?: unknown
			params?: Record<string, string | undefined>
	  }) => string)

type SectionHandle = {
	title: SectionValue
	subtitle?: SectionValue
	contentClassName?: string
}

function resolveSectionValue(
	value: SectionValue | undefined,
	match: { data?: unknown; params?: Record<string, string | undefined> },
) {
	if (typeof value === 'function') {
		return value(match)
	}

	return value
}

export default function SectionLayout() {
	const matches = useMatches()
	const activeMatch = [...matches].reverse().find((match) => {
		if (!match.handle || typeof match.handle !== 'object') {
			return false
		}

		return 'section' in match.handle
	})
	const section =
		activeMatch &&
		activeMatch.handle &&
		typeof activeMatch.handle === 'object' &&
		'section' in activeMatch.handle
			? (activeMatch.handle.section as SectionHandle)
			: null
	const title =
		section && activeMatch
			? resolveSectionValue(section.title, activeMatch)
			: null
	const subtitle = section
		&& activeMatch
			? resolveSectionValue(section.subtitle, activeMatch)
		: null
	const contentClassName = section?.contentClassName ?? ''

	return (
		<div className={contentClassName ? `${contentClassName} pb-20` : 'pb-20'}>
			{title ? (
				<header className="mb-10">
					<h1 className="text-3xl font-bold text-white">{title}</h1>
					{subtitle ? (
						<p className="mt-1 text-slate-400">{subtitle}</p>
					) : null}
				</header>
			) : null}
			<Outlet />
		</div>
	)
}
