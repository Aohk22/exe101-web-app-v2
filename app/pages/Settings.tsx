import React, { useState } from 'react'
import {
	User,
	Mail,
	Bell,
	Shield,
	Moon,
	Globe,
	LogOut,
	Camera,
	Check,
	ChevronRight,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Form, redirect } from 'react-router'
import { destroySession, getSession } from '~/.server/auth/sessions'
import type { Route } from './+types/Settings'

export async function action({ request }: Route.ActionArgs) {
	const session = await getSession(request.headers.get('Cookie'))
	return redirect('/login', {
		headers: {
			'Set-Cookie': await destroySession(session)
		},
	})
}

export default function Settings() {
	const [activeTab, setActiveTab] = useState('profile')

	const tabs = [
		{ id: 'profile', label: 'Profile', icon: User },
		{ id: 'notifications', label: 'Notifications', icon: Bell },
		{ id: 'security', label: 'Security', icon: Shield },
		{ id: 'preferences', label: 'Preferences', icon: Globe },
	]

	return (
		<div className="max-w-4xl mx-auto pb-20">
			<header className="mb-10">
				<h1 className="text-3xl font-bold text-white">Settings</h1>
				<p className="text-slate-400 mt-1">
					Manage your account and app preferences.
				</p>
			</header>

			<div className="flex flex-col md:flex-row gap-10">
				{/* Sidebar Tabs */}
				<aside className="md:w-64 shrink-0">
					<nav className="space-y-1">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
									? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
									: 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
									}`}
							>
								<tab.icon className="w-5 h-5" />
								{tab.label}
							</button>
						))}
					</nav>

					<div className="mt-10 pt-10 border-t border-slate-800">
						<Form method="POST">
							<button type='submit' className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all">
								<LogOut className="w-5 h-5" />
								Sign Out
							</button>
						</Form>
					</div>
				</aside>

				{/* Content Area */}
				<div className="flex-1">
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3 }}
						className="bg-slate-900 rounded-[1.75rem] border border-slate-800 p-8 md:p-10 shadow-sm"
					>
						{activeTab === 'profile' && (
							<div className="space-y-8">
								<div>
									<h2 className="text-xl font-bold text-white mb-6">
										Profile Information
									</h2>
									<div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
										<div className="relative group">
											<div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-4 border-slate-900 shadow-md">
												<User className="w-12 h-12 text-slate-600" />
											</div>
											<button className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all">
												<Camera className="w-4 h-4" />
											</button>
										</div>
										<div className="text-center sm:text-left">
											<h3 className="font-bold text-white">
												Alex Johnson
											</h3>
											<p className="text-sm text-slate-400">
												Pro Learner since Oct 2025
											</p>
										</div>
									</div>

									<div className="grid sm:grid-cols-2 gap-6">
										<div className="space-y-2">
											<label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
												Full Name
											</label>
											<input
												type="text"
												defaultValue="Alex Johnson"
												className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
												Email Address
											</label>
											<input
												type="email"
												defaultValue="alex.j@example.com"
												className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
											/>
										</div>
										<div className="sm:col-span-2 space-y-2">
											<label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
												Bio
											</label>
											<textarea
												rows={4}
												placeholder="Tell us about yourself..."
												className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
											/>
										</div>
									</div>
								</div>

								<div className="pt-6 border-t border-slate-800 flex justify-end gap-4">
									<button className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors">
										Cancel
									</button>
									<button className="px-8 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 transition-all">
										Save Changes
									</button>
								</div>
							</div>
						)}

						{activeTab === 'notifications' && (
							<div className="space-y-8">
								<h2 className="text-xl font-bold text-white mb-6">
									Notification Preferences
								</h2>
								<div className="space-y-6">
									{[
										{
											id: 'email-reminders',
											title: 'Email Reminders',
											desc: 'Get notified about upcoming lessons and goals.',
										},
										{
											id: 'course-updates',
											title: 'Course Updates',
											desc: 'Receive alerts when new content is added to your courses.',
										},
										{
											id: 'achievements',
											title: 'Achievements',
											desc: 'Get notified when you earn a new badge or milestone.',
										},
										{
											id: 'marketing',
											title: 'Marketing',
											desc: 'Receive news about new features and promotions.',
										},
									].map((item) => (
										<div
											key={item.id}
											className="flex items-center justify-between py-2"
										>
											<div className="flex-1 pr-4">
												<h4 className="font-bold text-white text-sm">
													{item.title}
												</h4>
												<p className="text-xs text-slate-500 mt-0.5">
													{item.desc}
												</p>
											</div>
											<div className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													className="sr-only peer"
													defaultChecked={
														item.id !== 'marketing'
													}
												/>
												<div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{activeTab === 'security' && (
							<div className="space-y-8">
								<h2 className="text-xl font-bold text-white mb-6">
									Security Settings
								</h2>
								<div className="space-y-6">
									<div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-800 flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm">
												<Shield className="w-5 h-5 text-emerald-400" />
											</div>
											<div>
												<h4 className="font-bold text-white text-sm">
													Two-Factor Authentication
												</h4>
												<p className="text-xs text-slate-500 mt-0.5">
													Add an extra layer of
													security to your account.
												</p>
											</div>
										</div>
										<button className="text-sm font-bold text-emerald-400 hover:text-emerald-300">
											Enable
										</button>
									</div>

									<div className="space-y-4">
										<h4 className="font-bold text-white text-sm ml-1">
											Change Password
										</h4>
										<div className="space-y-4">
											<input
												type="password"
												placeholder="Current Password"
												className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
											/>
											<input
												type="password"
												placeholder="New Password"
												className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
											/>
											<button className="w-full py-3 bg-slate-100 text-black rounded-2xl text-sm font-bold hover:bg-white transition-all">
												Update Password
											</button>
										</div>
									</div>
								</div>
							</div>
						)}

						{activeTab === 'preferences' && (
							<div className="space-y-8">
								<h2 className="text-xl font-bold text-white mb-6">
									App Preferences
								</h2>
								<div className="space-y-6">
									<div className="flex items-center justify-between py-2">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center">
												<Moon className="w-5 h-5 text-slate-400" />
											</div>
											<div>
												<h4 className="font-bold text-white text-sm">
													Dark Mode
												</h4>
												<p className="text-xs text-slate-500 mt-0.5">
													Switch between light and
													dark themes.
												</p>
											</div>
										</div>
										<div className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												className="sr-only peer"
												defaultChecked
											/>
											<div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
										</div>
									</div>

									<div className="flex items-center justify-between py-2">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center">
												<Globe className="w-5 h-5 text-slate-400" />
											</div>
											<div>
												<h4 className="font-bold text-white text-sm">
													Language
												</h4>
												<p className="text-xs text-slate-500 mt-0.5">
													Select your preferred
													language.
												</p>
											</div>
										</div>
										<select className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20">
											<option>English (US)</option>
											<option>Spanish</option>
											<option>French</option>
											<option>German</option>
										</select>
									</div>
								</div>
							</div>
						)}
					</motion.div>
				</div>
			</div>
		</div>
	)
}
