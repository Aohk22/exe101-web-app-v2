import {
	Outlet,
	Link,
	useLocation,
	useMatches,
	useNavigation,
	useFetcher,
} from 'react-router'
import {
	LayoutDashboard,
	GraduationCap,
	Settings,
	Zap,
	Sun,
	Moon,
	SquarePen,
	MessageCircle,
	Map,
	Users,
	BookMarked,
	Book,
	Swords,
	Eye,
	EyeOff,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState, useRef, useCallback, lazy, Suspense } from 'react'
import type { UserContext } from '~/context'

const PricingModal = lazy(() => import('~/components/PricingModal'))
const AiTutor = lazy(() => import('~/components/AiTutor'))

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }> }

const userNavItems: NavItem[] = [
	{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
	{ label: 'Challenges', href: '/challenges', icon: Swords },
	{ label: 'Courses', href: '/courses', icon: Book },
	{ label: 'Learning Paths', href: '/learning-path', icon: Map },
	{ label: 'Achievements', href: '/achievements', icon: GraduationCap },
]

const staffNavItems: NavItem[] = [
	{ label: 'Admin Panel', href: '/admin', icon: LayoutDashboard },
	{ label: 'Course Builder', href: '/course-builder', icon: SquarePen },
	{ label: 'Users', href: '/users', icon: Users },
	{ label: 'Categories', href: '/categories', icon: BookMarked },
	{ label: 'Paths', href: '/paths-admin', icon: Map },
	{ label: 'Settings', href: '/settings', icon: Settings },
]

export default function MainLayout() {
	const location = useLocation()
	const matches = useMatches()
	const navigation = useNavigation()
	const [activeLink, setActiveLink] = useState(location.pathname)
	const [isPricingOpen, setIsPricingOpen] = useState(false)
	const [aiOpen, setAiOpen] = useState(false)
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
		if (typeof window !== 'undefined') {
			return window.localStorage.getItem('sidebarCollapsed') === 'true'
		}
		return false
	})
	const SNAP_THRESHOLD = 30
	const sidebarRef = useRef<HTMLElement>(null)

	const handleDragStart = useCallback((e: React.MouseEvent) => {
		e.preventDefault()
		const startX = e.clientX
		const wasCollapsed = isSidebarCollapsed

		const handleMouseMove = (ev: MouseEvent) => {
			const dx = ev.clientX - startX
			if (wasCollapsed && dx > SNAP_THRESHOLD) {
				setIsSidebarCollapsed(false)
				window.localStorage.setItem('sidebarCollapsed', 'false')
				cleanup()
			} else if (!wasCollapsed && dx < -SNAP_THRESHOLD) {
				setIsSidebarCollapsed(true)
				window.localStorage.setItem('sidebarCollapsed', 'true')
				cleanup()
			}
		}
		const cleanup = () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
		const handleMouseUp = cleanup
		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
	}, [isSidebarCollapsed])
	const [theme, setTheme] = useState<'light' | 'dark'>(() => {
		if (typeof document !== 'undefined') {
			const el = document.documentElement
			return (el.dataset.theme as 'light' | 'dark') || 'dark'
		}
		return 'dark'
	})
	const currentUser = matches
		.map((match) => {
			if (
				match.data &&
				typeof match.data === 'object' &&
				'user' in match.data
			) {
				return match.data.user as UserContext
			}

			return null
		})
		.find((user) => user !== null)
	const toggleFetcher = useFetcher()
	const isLearnerView = currentUser?.isStaff && currentUser?.role === 'learner'

	useEffect(() => {
		if (navigation.state === 'idle') {
			setActiveLink(location.pathname)
		}
	}, [location.pathname, navigation.state])

	useEffect(() => {
		const storedTheme = window.localStorage.getItem('theme')
		const nextTheme =
			storedTheme === 'light' || storedTheme === 'dark'
				? storedTheme
				: window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light'

		setTheme(nextTheme)
		document.documentElement.dataset.theme = nextTheme
		document.documentElement.style.colorScheme = nextTheme
	}, [])

	function toggleTheme() {
		const nextTheme = theme === 'dark' ? 'light' : 'dark'
		setTheme(nextTheme)
		window.localStorage.setItem('theme', nextTheme)
		document.documentElement.dataset.theme = nextTheme
		document.documentElement.style.colorScheme = nextTheme
	}

	return (
		<div className="flex min-h-screen bg-slate-950 text-slate-200 transition-colors">
			{/* Sidebar */}
			<aside
				ref={sidebarRef}
				className={`border-r border-slate-800 bg-slate-900 hidden md:flex flex-col sticky top-0 h-screen relative shrink-0 transition-[width] duration-200 ${isSidebarCollapsed ? 'w-[72px]' : 'w-60'}`}
			>
				<div className="p-6">
					<div className="flex items-center justify-center">
						<Link
							to="/"
							className="flex items-center justify-center"
						>
							{!isSidebarCollapsed && (
								<span className="text-xl font-bold tracking-tight text-white leading-tight text-center">
									CyberSpace
									<br />
									Academy
								</span>
							)}
						</Link>
					</div>
				</div>

				<nav className="flex-1">
					{userNavItems.map((item) => (
						<Link
							key={item.href}
							to={item.href}
							onClick={() => setActiveLink(item.href)}
							className={
								`flex items-center px-6 py-3 text-sm font-medium transition-colors relative ${isSidebarCollapsed
									? 'justify-center'
									: 'gap-3'
								} ` +
								(activeLink === item.href
									? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500'
									: 'text-slate-400 hover:bg-slate-800 hover:text-white')
							}
							title={
								isSidebarCollapsed ? item.label : undefined
							}
						>
							<item.icon className="w-5 h-5" />
							{!isSidebarCollapsed && item.label}
						</Link>
					))}

					{currentUser?.role === 'staff' && !isSidebarCollapsed && (
						<div
							title="Administration"
							className="mx-6 my-2 h-px bg-slate-700 cursor-default"
						/>
					)}

					{currentUser?.role === 'staff' && staffNavItems.map((item) => (
						<Link
							key={item.href}
							to={item.href}
							onClick={() => setActiveLink(item.href)}
							className={
								`flex items-center px-6 py-3 text-sm font-medium transition-colors relative ${isSidebarCollapsed
									? 'justify-center'
									: 'gap-3'
								} ` +
								(activeLink === item.href
									? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500'
									: 'text-slate-400 hover:bg-slate-800 hover:text-white')
							}
							title={
								isSidebarCollapsed ? item.label : undefined
							}
						>
							<item.icon className="w-5 h-5" />
							{!isSidebarCollapsed && item.label}
						</Link>
					))}


					{/* Pro Upgrade Card in Sidebar */}
					{!isSidebarCollapsed && !currentUser?.isStaff && (
						<div className="mt-8 px-2">
							<div className="bg-emerald-600 rounded-xl p-4 text-white relative overflow-hidden group">
								<div className="relative z-10">
									<div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
										<Zap className="w-4 h-4" />
									</div>
									<p className="font-bold text-sm mb-1">
										Go Pro
									</p>
									<p className="text-[10px] text-emerald-100 mb-3">
										Unlock all premium courses and
										certificates.
									</p>
									<button
										onClick={() => setIsPricingOpen(true)}
										className="w-full py-2 bg-white text-emerald-600 rounded-xl text-[10px] font-bold hover:bg-emerald-50 transition-colors"
									>
										Upgrade Now
									</button>
								</div>
								<div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
							</div>
						</div>
					)}
				</nav>

				<div
					onMouseDown={handleDragStart}
					className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-emerald-500/50 active:bg-emerald-500/70 transition-colors z-10"
				/>
			</aside>

			{/* Main Content */}
			<main className="flex-1 flex flex-col min-w-0">
				{/* Header */}
				<header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-end gap-2">
					{currentUser?.isStaff && (
						<toggleFetcher.Form method="POST" action="/toggle-view">
							<button
								type="submit"
								className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer data-[loading=true]:opacity-50"
								data-loading={toggleFetcher.state !== 'idle'}
								style={{
									borderColor: isLearnerView
										? 'rgba(251, 191, 36, 0.4)'
										: 'rgba(52, 211, 153, 0.4)',
									color: isLearnerView
										? '#fbbf24'
										: '#34d399',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor = isLearnerView
										? 'rgba(251, 191, 36, 0.8)'
										: 'rgba(52, 211, 153, 0.8)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor = isLearnerView
										? 'rgba(251, 191, 36, 0.4)'
										: 'rgba(52, 211, 153, 0.4)'
								}}
							>
								{isLearnerView ? (
									<EyeOff className="w-3.5 h-3.5" />
								) : (
									<Eye className="w-3.5 h-3.5" />
								)}
								{isLearnerView ? 'Staff View' : 'User View'}
							</button>
						</toggleFetcher.Form>
					)}
					<button
						type="button"
						onClick={toggleTheme}
						className="p-2 text-slate-400 hover:bg-slate-800 rounded-full transition-colors"
						aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
					>
						{theme === 'dark' ? (
							<Sun className="w-4 h-4" />
						) : (
							<Moon className="w-4 h-4" />
						)}
					</button>
				</header>

				<Suspense fallback={null}>
					<PricingModal
						isOpen={isPricingOpen}
						onClose={() => setIsPricingOpen(false)}
					/>
				</Suspense>

				{/* Page Content */}
				<div className="p-6 md:p-10 max-w-7xl w-full mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<Outlet />
					</motion.div>
				</div>
			</main>

			<button
				onClick={() => setAiOpen(true)}
				style={{
					position: 'fixed',
					bottom: '24px',
					right: '24px',
					zIndex: 9999,
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					padding: '12px 20px',
					background: '#059669',
					color: 'white',
					border: 'none',
					borderRadius: '16px',
					fontWeight: 700,
					fontSize: '14px',
					cursor: 'pointer',
					boxShadow: '0 8px 32px rgba(5,150,105,0.5)',
				}}
			>
				<MessageCircle style={{ width: 16, height: 16 }} />
				AI Tutor
			</button>
			<Suspense fallback={null}>
				<AiTutor isOpen={aiOpen} onClose={() => setAiOpen(false)} />
			</Suspense>
		</div>
	)
}
