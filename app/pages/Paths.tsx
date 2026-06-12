import { useLoaderData } from 'react-router'
import type { Route } from './+types/Paths'
import { getLearningPaths } from '~/.server/queries/learning-paths'
import type { LearningPathWithCount } from '~/.server/database/types'
import PathCard from '~/components/PathCard'

export const handle = {
	section: {
		title: 'Learning Paths',
		subtitle: 'Follow a curated sequence of courses to master a topic.',
	},
}

export async function loader(_: Route.LoaderArgs) {
	const paths = await getLearningPaths()
	return { paths }
}

export default function Paths() {
	const { paths }: { paths: LearningPathWithCount[] } = useLoaderData()

	return (
		<div className="space-y-8">
			{paths.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{paths.map((path) => (
						<PathCard key={path.id} path={path} />
					))}
				</div>
			) : (
				<div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-12 text-center">
					<h2 className="text-lg font-bold text-white">
						No learning paths yet
					</h2>
					<p className="mt-2 text-sm text-slate-400">
						Check back soon for curated learning paths.
					</p>
				</div>
			)}
		</div>
	)
}
