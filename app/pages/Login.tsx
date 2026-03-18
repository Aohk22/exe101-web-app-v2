import {
	GraduationCap,
	Mail,
	Lock,
	ArrowRight,
	Loader2,
	Github,
	Chrome,
	XCircle,
} from 'lucide-react'
import { motion } from 'motion/react'
import {
	data,
	Form,
	Link,
	redirect,
	useLoaderData,
	useNavigation,
} from 'react-router'
import { getSession, commitSession } from '~/.server/auth/sessions'
import { validateCredentials } from '~/.server/auth/login'
import type { Route } from './+types/Login'

export async function loader({ request }: Route.LoaderArgs) {
	console.log('Login loader activating.')
	const session = await getSession(request.headers.get('Cookie'))
	if (session.has('userId')) {
		console.log('Redirecting to / from Login loader')
		return redirect('/')
	}

	return data(
		{ error: session.get('error') },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	)
}

export async function action({ request }: Route.ActionArgs) {
	console.log('Login action activating.')
	const session = await getSession(request.headers.get('Cookie'))
	const form = await request.formData()
	const username = form.get('email')
	const password = form.get('password')

	if (typeof username != 'string' || typeof password != 'string') {
		throw new Error('Invalid form data')
	}

	const userId = await validateCredentials(username, password)
	if (userId == null) {
		session.flash('error', 'Invalid username/password')
		return redirect('login', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		})
	}

	session.set('userId', String(userId))
	return redirect('/', {
		headers: {
			'Set-Cookie': await commitSession(session),
		},
	})
}

export default function Login() {
	const { error } = useLoaderData()
	const navigation = useNavigation()
	const isLoading = navigation.state === 'submitting'

	return (
		<div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-200">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				className="max-w-md w-full"
			>
				{/* Logo Area */}
				<div className="flex flex-col items-center mb-10">
					<div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-emerald-900/20">
						<GraduationCap className="text-white w-8 h-8" />
					</div>
					<h1 className="text-3xl font-bold text-white tracking-tight">
						CyberSpace Academy
					</h1>
					<p className="text-slate-400 mt-2 font-medium">
						Empowering your future, one lesson at a time.
					</p>
				</div>

				{/* Login Card */}
				<div className="bg-slate-900 rounded-[1.75rem] shadow-2xl shadow-black/50 border border-slate-800 p-8 md:p-12">
					<div className="mb-8">
						<h2 className="text-2xl font-bold text-white">
							Welcome Back
						</h2>
						<p className="text-slate-400 text-sm mt-1">
							Please enter your details to sign in.
						</p>
					</div>

					<Form method="POST" className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-bold text-slate-300 ml-1">
								Email Address
							</label>
							<div className="relative group">
								<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
								<input
									type="email"
									name="email"
									required
									placeholder="name@company.com"
									className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white focus:bg-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between items-center ml-1">
								<label className="text-sm font-bold text-slate-300">
									Password
								</label>
								<button
									type="button"
									className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
								>
									Forgot Password?
								</button>
							</div>
							<div className="relative group">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
								<input
									type="password"
									name="password"
									required
									placeholder="••••••••"
									className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white focus:bg-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
								/>
							</div>
						</div>

						<div className="flex items-center gap-2 ml-1">
							<input
								type="checkbox"
								id="remember"
								className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-600 focus:ring-emerald-500"
							/>
							<label
								htmlFor="remember"
								className="text-sm text-slate-400 font-medium cursor-pointer"
							>
								Remember for 30 days
							</label>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className={`w-full py-4 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
								error
									? 'bg-red-600 hover:bg-red-700 shadow-red-900/20'
									: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
							}`}
						>
							{isLoading ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : error ? (
								<>
									Try Again <ArrowRight className="w-5 h-5" />
								</>
							) : (
								<>
									Sign In <ArrowRight className="w-5 h-5" />
								</>
							)}
						</button>
					</Form>

					<div className="mt-8">
						<div className="relative flex items-center justify-center mb-8">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-slate-800"></div>
							</div>
							<span className="relative px-4 bg-slate-900 text-xs font-bold text-slate-500 uppercase tracking-widest">
								Or continue with
							</span>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<button className="flex items-center justify-center gap-2 py-3 border border-slate-700 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors">
								<Chrome className="w-5 h-5" /> Google
							</button>
							<button className="flex items-center justify-center gap-2 py-3 border border-slate-700 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors">
								<Github className="w-5 h-5" /> GitHub
							</button>
						</div>
					</div>
				</div>

				<p className="mt-8 text-center text-slate-500 font-medium">
					Don't have an account?{' '}
					<Link
						to="/register"
						className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
					>
						Sign up for free
					</Link>
				</p>
			</motion.div>
		</div>
	)
}
