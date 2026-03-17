import { Outlet, Link, useLocation, useRouteLoaderData } from 'react-router'
import {
	LayoutDashboard,
	BookOpen,
	GraduationCap,
	Settings,
	Bell,
	Search,
	User,
	Zap,
	Sparkles,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import PricingModal from '~/components/PricingModal'

const navItems = [
	{ label: 'Dashboard', href: '/', icon: LayoutDashboard },
	{ label: 'My Courses', href: '/courses', icon: BookOpen },
	{ label: 'Achievements', href: '/achievements', icon: GraduationCap },
	{ label: 'Settings', href: '/settings', icon: Settings },
]

export default function MainLayout() {
	const { user } = useRouteLoaderData('routes/protected')
	const location = useLocation()
	const [isPricingOpen, setIsPricingOpen] = useState(false)

	return (
		<div className="flex min-h-screen bg-slate-950 text-slate-200">
			{/* Sidebar */}
			<aside className="w-64 border-r border-slate-800 bg-slate-900 hidden md:flex flex-col sticky top-0 h-screen">
				<div className="p-6">
					<Link to="/" className="flex items-center gap-2">
						<div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
							<GraduationCap className="text-white w-5 h-5" />
						</div>
						<span className="font-bold text-xl tracking-tight text-white">
							CyberSpace Academy
						</span>
					</Link>
				</div>

				<nav className="flex-1">
					{navItems.map((item) => {
						const isActive = location.pathname === item.href
						return (
							<Link
								key={item.href}
								to={item.href}
								className={
									'flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors relative' +
									(isActive
										? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500'
										: 'text-slate-400 hover:bg-slate-800 hover:text-white')
								}
							>
								<item.icon className="w-5 h-5" />
								{item.label}
							</Link>
						)
					})}

					{/* Pro Upgrade Card in Sidebar */}
					<div className="mt-8 px-2">
						<div className="bg-emerald-600 rounded-2xl p-4 text-white relative overflow-hidden group">
							<div className="relative z-10">
								<div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
									<Zap className="w-4 h-4" />
								</div>
								<p className="font-bold text-sm mb-1">Go Pro</p>
								<p className="text-[10px] text-emerald-100 mb-3">
									Unlock all premium courses and certificates.
								</p>
								<button
									onClick={() => setIsPricingOpen(true)}
									className="w-full py-2 bg-white text-emerald-600 rounded-xl text-[10px] font-bold hover:bg-emerald-50 transition-colors"
								>
									Upgrade Now
								</button>
							</div>
							{/* Decorative circle */}
							<div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
						</div>
					</div>
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 flex flex-col min-w-0">
				{/* Header */}
				<header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
					<div className="flex-1 max-w-md relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
						<input
							type="text"
							placeholder="Search courses, lessons..."
							className="w-full pl-10 pr-4 py-2 bg-slate-800 border-transparent rounded-xl text-sm text-white focus:bg-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
						/>
					</div>

					<div className="flex items-center gap-4">
						<button className="p-2 text-slate-400 hover:bg-slate-800 rounded-full transition-colors relative">
							<Bell className="w-5 h-5" />
							<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
						</button>

						<div className="h-8 w-px bg-slate-800 mx-2"></div>

						<Link
							to="/profile"
							className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
						>
							<div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
								<User className="w-5 h-5 text-slate-400" />
							</div>
							<div className="hidden sm:block text-left">
								<p className="text-xs font-bold text-white leading-none">
									{user.name}
								</p>
								<p className="text-[10px] text-slate-400 mt-1 leading-none">
									Pro Learner
								</p>
							</div>
						</Link>

						<button
							onClick={() => setIsPricingOpen(true)}
							className="hidden lg:flex bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 items-center gap-2"
						>
							<Sparkles className="w-4 h-4" />
							Upgrade
						</button>
					</div>
				</header>

				<PricingModal
					isOpen={isPricingOpen}
					onClose={() => setIsPricingOpen(false)}
				/>

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
		</div>
	)
}
