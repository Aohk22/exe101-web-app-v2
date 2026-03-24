import type { LucideIcon } from 'lucide-react'
import { use } from 'react'
import { Suspense } from 'react'

type StatCardProps = {
	label: string
	value: Promise<string | number> | string | number
	icon: LucideIcon
	color: string
	bg: string
}

function StatValue({ value }: { value: Promise<string | number> | string | number }) {
	const resolved = value instanceof Promise ? use(value) : value
	return <p className="text-2xl font-bold text-white mt-1">{resolved}</p>
}

function StatValueSkeleton() {
	return <div className="h-7 w-16 bg-slate-800 rounded animate-pulse mt-1" />
}

export default function StatCard({ label, value, icon: Icon, color, bg }: StatCardProps) {
	return (
		<div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
			<div className={bg + ' w-10 h-10 rounded-lg flex items-center justify-center mb-4'}>
				<Icon className={color + ' w-5 h-5'} />
			</div>
			<p className="text-slate-400 text-sm font-medium">{label}</p>
			<Suspense fallback={<StatValueSkeleton />}>
				<StatValue value={value} />
			</Suspense>
		</div>
	)
}
