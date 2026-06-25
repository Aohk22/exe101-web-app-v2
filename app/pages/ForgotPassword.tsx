import {
	GraduationCap,
	Mail,
	ArrowRight,
	Loader2,
	CheckCircle2,
} from 'lucide-react'
import { Form, Link, useActionData, useNavigation } from 'react-router'
import crypto from 'node:crypto'
import type { Route } from './+types/ForgotPassword'
import { getUserByEmail } from '~/.server/database/utils'
import { db } from '~/.server/database/connection'
import { passwordResetTokens } from '~/.server/database/schema'

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const email = formData.get('email') as string

	if (!email) {
		return { error: 'Email is required.' }
	}

	const user = await getUserByEmail(email)
	if (!user) {
		return { error: 'No account found with that email address.' }
	}

	const token = crypto.randomBytes(32).toString('hex')
	const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

	await db.insert(passwordResetTokens).values({
		userId: user.id,
		token,
		expiresAt,
	})

	const resetLink = `${new URL(request.url).origin}/reset-password?token=${token}`

	return {
		success: true,
		resetLink,
		message:
			'Password reset link generated. In production this would be emailed.',
	}
}

export default function ForgotPassword() {
	const actionData = useActionData<typeof action>() as
		| {
				error?: string
				success?: boolean
				resetLink?: string
				message?: string
		  }
		| undefined
	const navigation = useNavigation()
	const isLoading = navigation.state === 'submitting'

	return (
		<div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
			<div className="max-w-md w-full">
				<div className="flex flex-col items-center mb-10">
					<div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-emerald-900/20">
						<GraduationCap className="text-white w-8 h-8" />
					</div>
					<h1 className="text-3xl font-bold text-white tracking-tight">
						Reset Password
					</h1>
					<p className="text-slate-400 mt-2 font-medium">
						Enter your email to receive a reset link.
					</p>
				</div>

				<div className="bg-slate-900 rounded-xl shadow-2xl shadow-black/50 border border-slate-800 p-8 md:p-12">
					{actionData?.success ? (
						<div className="space-y-6 text-center">
							<div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
								<CheckCircle2 className="w-8 h-8 text-emerald-500" />
							</div>
							<p className="text-sm text-slate-300">
								{actionData.message}
							</p>
							<div className="bg-slate-800 rounded-xl p-4 text-left">
								<p className="text-xs text-slate-500 mb-2">
									Reset link (dev mode):
								</p>
								<a
									href={actionData.resetLink}
									className="text-xs text-emerald-400 break-all hover:text-emerald-300"
								>
									{actionData.resetLink}
								</a>
							</div>
							<Link
								to="/login"
								className="block w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all text-center"
							>
								Back to Login
							</Link>
						</div>
					) : (
						<Form method="POST" className="space-y-6">
							{actionData?.error && (
								<div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-xs text-red-400">
									{actionData.error}
								</div>
							)}

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

							<button
								type="submit"
								disabled={isLoading}
								className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
							>
								{isLoading ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									<>
										Send Reset Link{' '}
										<ArrowRight className="w-5 h-5" />
									</>
								)}
							</button>
						</Form>
					)}
				</div>

				<p className="mt-8 text-center text-slate-500 font-medium">
					Remember your password?{' '}
					<Link
						to="/login"
						className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	)
}
