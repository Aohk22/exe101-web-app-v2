export default function StatCardSkeleton() {
	return (
		<div className="bg-slate-900 border border-slate-800 p-6 rounded-xl animate-pulse">
			<div className="w-10 h-10 rounded-lg bg-slate-800 mb-4" />
			<div className="h-3 w-24 bg-slate-800 rounded mb-3" />
			<div className="h-7 w-16 bg-slate-800 rounded" />
		</div>
	)
}
