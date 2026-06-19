import { sql } from 'drizzle-orm'
import {
	Activity,
	BadgeDollarSign,
	BarChart3,
	CheckCircle2,
	CreditCard,
	Eye,
	GraduationCap,
	MousePointerClick,
	TrendingUp,
	Users,
} from 'lucide-react'
import { redirect, useLoaderData } from 'react-router'
import { z } from 'zod'
import { db } from '~/.server/database/connection'
import { userContext } from '~/context'
import { NoUserContextError } from '~/error'
import type { Route } from './+types/AdminDashboard'

export const handle = {
	section: {
		title: 'Admin Dashboard',
		subtitle: 'Revenue, traffic, and learning performance overview.',
	},
}

const adminMetricsSchema = z.object({
	totalUsers: z.coerce.number(),
	totalCourses: z.coerce.number(),
	totalEnrollments: z.coerce.number(),
	completedLessons: z.coerce.number(),
	totalTrackedLessons: z.coerce.number(),
})

const completionRowSchema = z.object({
	courseId: z.coerce.number(),
	title: z.string(),
	enrollments: z.coerce.number(),
	completedLessons: z.coerce.number(),
	totalTrackedLessons: z.coerce.number(),
	completionRate: z.coerce.number(),
})

type CompletionRow = z.infer<typeof completionRowSchema>

const showcasePurchases = [
	{
		id: 'PX-1048',
		customer: 'Mina Tran',
		plan: 'Professional Annual',
		amount: '$249.00',
		status: 'Paid',
	},
	{
		id: 'PX-1047',
		customer: 'Duc Nguyen',
		plan: 'Team Seats',
		amount: '$799.00',
		status: 'Pending',
	},
	{
		id: 'PX-1046',
		customer: 'Avery Chen',
		plan: 'Professional Monthly',
		amount: '$29.00',
		status: 'Paid',
	},
]

const showcaseVisits = [
	{ label: 'Mon', value: 420 },
	{ label: 'Tue', value: 560 },
	{ label: 'Wed', value: 510 },
	{ label: 'Thu', value: 690 },
	{ label: 'Fri', value: 740 },
	{ label: 'Sat', value: 610 },
	{ label: 'Sun', value: 830 },
]

const showcaseFunnels = [
	{ label: 'Landing visits', value: 12480 },
	{ label: 'Course views', value: 4820 },
	{ label: 'Checkout starts', value: 920 },
	{ label: 'Purchases', value: 386 },
]

function formatPercent(value: number) {
	return `${Math.round(value)}%`
}

function compactNumber(value: number) {
	return new Intl.NumberFormat('en', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(value)
}

function ShowcaseBadge() {
	return (
		<span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
			Showcase
		</span>
	)
}

function MetricCard({
	label,
	value,
	icon: Icon,
	tone,
	meta,
	showcase = false,
}: {
	label: string
	value: string
	icon: typeof Activity
	tone: string
	meta: string
	showcase?: boolean
}) {
	return (
		<div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
			<div className="flex items-start justify-between gap-4">
				<div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
					<Icon className="h-5 w-5" />
				</div>
				{showcase ? <ShowcaseBadge /> : null}
			</div>
			<p className="mt-5 text-sm font-medium text-slate-400">{label}</p>
			<p className="mt-2 text-3xl font-bold text-white">{value}</p>
			<p className="mt-2 text-xs text-slate-500">{meta}</p>
		</div>
	)
}

function CompletionBarChart({ rows }: { rows: CompletionRow[] }) {
	const chartRows = rows.length > 0 ? rows : []

	return (
		<div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
			<div className="mb-6 flex items-center justify-between gap-4">
				<div>
					<h2 className="text-lg font-bold text-white">
						Course Completions
					</h2>
					<p className="mt-1 text-sm text-slate-500">
						Based on completed tracked lessons.
					</p>
				</div>
				<BarChart3 className="h-5 w-5 text-emerald-400" />
			</div>

			{chartRows.length > 0 ? (
				<div className="space-y-5">
					{chartRows.map((course) => (
						<div key={course.courseId}>
							<div className="mb-2 flex items-center justify-between gap-4 text-sm">
								<p className="min-w-0 truncate font-medium text-slate-200">
									{course.title}
								</p>
								<span className="shrink-0 font-bold text-white">
									{formatPercent(course.completionRate)}
								</span>
							</div>
							<div className="h-3 overflow-hidden rounded-full bg-slate-800">
								<div
									className="h-full rounded-full bg-emerald-500"
									style={{
										width: `${Math.min(course.completionRate, 100)}%`,
									}}
								/>
							</div>
							<p className="mt-1 text-xs text-slate-500">
								{course.completedLessons}/{course.totalTrackedLessons}{' '}
								lesson records complete
							</p>
						</div>
					))}
				</div>
			) : (
				<div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
					<p className="text-sm font-medium text-slate-300">
						No completion records yet.
					</p>
				</div>
			)}
		</div>
	)
}

function VisitsLineChart() {
	const max = Math.max(...showcaseVisits.map((visit) => visit.value))
	const points = showcaseVisits
		.map((visit, index) => {
			const x = (index / (showcaseVisits.length - 1)) * 100
			const y = 100 - (visit.value / max) * 82 - 8
			return `${x},${y}`
		})
		.join(' ')

	return (
		<div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
			<div className="mb-6 flex items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-3">
						<h2 className="text-lg font-bold text-white">Visits</h2>
						<ShowcaseBadge />
					</div>
					<p className="mt-1 text-sm text-slate-500">
						Prepared for analytics integration.
					</p>
				</div>
				<Eye className="h-5 w-5 text-blue-400" />
			</div>
			<svg
				viewBox="0 0 100 100"
				className="h-56 w-full overflow-visible"
				preserveAspectRatio="none"
				aria-label="Visits trend chart"
			>
				<polyline
					points={points}
					fill="none"
					stroke="rgb(96 165 250)"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
			<div className="mt-4 grid grid-cols-7 gap-2">
				{showcaseVisits.map((visit) => (
					<div key={visit.label} className="text-center">
						<p className="text-xs font-bold text-slate-300">
							{compactNumber(visit.value)}
						</p>
						<p className="mt-1 text-[10px] uppercase text-slate-500">
							{visit.label}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}

function PurchaseTable() {
	return (
		<div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
			<div className="mb-6 flex items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-3">
						<h2 className="text-lg font-bold text-white">
							Recent Purchases
						</h2>
						<ShowcaseBadge />
					</div>
					<p className="mt-1 text-sm text-slate-500">
						Ready for payment provider events.
					</p>
				</div>
				<CreditCard className="h-5 w-5 text-amber-400" />
			</div>
			<div className="overflow-hidden rounded-xl border border-slate-800">
				<table className="w-full text-left text-sm">
					<thead className="bg-slate-800/50 text-xs uppercase tracking-widest text-slate-500">
						<tr>
							<th className="px-4 py-3">Order</th>
							<th className="px-4 py-3">Customer</th>
							<th className="px-4 py-3">Plan</th>
							<th className="px-4 py-3 text-right">Amount</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-800">
						{showcasePurchases.map((purchase) => (
							<tr key={purchase.id}>
								<td className="px-4 py-4 font-medium text-white">
									{purchase.id}
								</td>
								<td className="px-4 py-4 text-slate-300">
									{purchase.customer}
								</td>
								<td className="px-4 py-4 text-slate-400">
									{purchase.plan}
								</td>
								<td className="px-4 py-4 text-right font-bold text-white">
									{purchase.amount}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

function ConversionFunnel() {
	const max = Math.max(...showcaseFunnels.map((step) => step.value))

	return (
		<div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
			<div className="mb-6 flex items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-3">
						<h2 className="text-lg font-bold text-white">
							Visit To Purchase
						</h2>
						<ShowcaseBadge />
					</div>
					<p className="mt-1 text-sm text-slate-500">
						Funnel placeholder for event tracking.
					</p>
				</div>
				<MousePointerClick className="h-5 w-5 text-purple-400" />
			</div>
			<div className="space-y-4">
				{showcaseFunnels.map((step) => (
					<div key={step.label}>
						<div className="mb-2 flex items-center justify-between gap-4 text-sm">
							<p className="font-medium text-slate-300">{step.label}</p>
							<p className="font-bold text-white">
								{compactNumber(step.value)}
							</p>
						</div>
						<div className="h-3 overflow-hidden rounded-full bg-slate-800">
							<div
								className="h-full rounded-full bg-purple-500"
								style={{ width: `${(step.value / max) * 100}%` }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(userContext)
	if (user === null) {
		throw new NoUserContextError('User context resolved to null.')
	}

	if (user.role !== 'staff') {
		throw redirect('/')
	}

	const [metricsResult, completionsResult] = await Promise.all([
		db.execute(sql`
			SELECT
				(SELECT COUNT(*) FROM users)::int AS "totalUsers",
				(SELECT COUNT(*) FROM courses)::int AS "totalCourses",
				(SELECT COUNT(*) FROM users_to_courses)::int AS "totalEnrollments",
				(SELECT COUNT(*) FROM users_to_lessons WHERE completed = true)::int AS "completedLessons",
				(SELECT COUNT(*) FROM users_to_lessons)::int AS "totalTrackedLessons"
		`),
		db.execute(sql`
			SELECT
				c.id AS "courseId",
				c.title,
				COUNT(DISTINCT utc.user_id)::int AS "enrollments",
				COUNT(CASE WHEN utl.completed = true THEN 1 END)::int AS "completedLessons",
				COUNT(utl.lesson_id)::int AS "totalTrackedLessons",
				CASE
					WHEN COUNT(utl.lesson_id) = 0 THEN 0
					ELSE ROUND(
						COUNT(CASE WHEN utl.completed = true THEN 1 END)::numeric
						/ COUNT(utl.lesson_id)::numeric
						* 100
					)
				END AS "completionRate"
			FROM courses c
			LEFT JOIN users_to_courses utc ON utc.course_id = c.id
			LEFT JOIN modules m ON m.course_id = c.id
			LEFT JOIN lessons l ON l.module_id = m.id
			LEFT JOIN users_to_lessons utl
				ON utl.lesson_id = l.id
				AND utl.user_id = utc.user_id
			GROUP BY c.id
			ORDER BY "completionRate" DESC, c.id DESC
			LIMIT 8
		`),
	])

	return {
		metrics: adminMetricsSchema.parse(metricsResult.rows[0]),
		completions: z.array(completionRowSchema).parse(completionsResult.rows),
	}
}

export default function AdminDashboard() {
	const { metrics, completions } = useLoaderData<typeof loader>()
	const completionRate =
		metrics.totalTrackedLessons === 0
			? 0
			: (metrics.completedLessons / metrics.totalTrackedLessons) * 100

	return (
		<div className="space-y-8">
			<section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					label="Purchases"
					value="$18.4K"
					icon={BadgeDollarSign}
					tone="bg-amber-400/10 text-amber-400"
					meta="Payment integration showcase"
					showcase
				/>
				<MetricCard
					label="Visits"
					value="12.5K"
					icon={Eye}
					tone="bg-blue-400/10 text-blue-400"
					meta="Analytics integration showcase"
					showcase
				/>
				<MetricCard
					label="Course Completion"
					value={formatPercent(completionRate)}
					icon={CheckCircle2}
					tone="bg-emerald-400/10 text-emerald-400"
					meta={`${metrics.completedLessons}/${metrics.totalTrackedLessons} lesson records`}
				/>
				<MetricCard
					label="Learners"
					value={compactNumber(metrics.totalUsers)}
					icon={Users}
					tone="bg-purple-400/10 text-purple-400"
					meta={`${metrics.totalEnrollments} enrollments across ${metrics.totalCourses} courses`}
				/>
			</section>

			<section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
				<CompletionBarChart rows={completions} />
				<VisitsLineChart />
			</section>

			<section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
				<PurchaseTable />
				<ConversionFunnel />
			</section>

			<section className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
					<GraduationCap className="h-5 w-5 text-emerald-400" />
					<p className="mt-4 text-sm font-medium text-slate-400">
						Tracked Lessons
					</p>
					<p className="mt-2 text-2xl font-bold text-white">
						{compactNumber(metrics.totalTrackedLessons)}
					</p>
				</div>
				<div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
					<TrendingUp className="h-5 w-5 text-blue-400" />
					<p className="mt-4 text-sm font-medium text-slate-400">
						Weekly Visit Lift
					</p>
					<p className="mt-2 text-2xl font-bold text-white">+18.2%</p>
					<div className="mt-3">
						<ShowcaseBadge />
					</div>
				</div>
				<div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
					<Activity className="h-5 w-5 text-rose-400" />
					<p className="mt-4 text-sm font-medium text-slate-400">
						Refund Risk
					</p>
					<p className="mt-2 text-2xl font-bold text-white">Low</p>
					<div className="mt-3">
						<ShowcaseBadge />
					</div>
				</div>
			</section>
		</div>
	)
}
