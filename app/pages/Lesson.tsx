import { useParams, Link } from 'react-router'
import { COURSES } from '~/.server/database/raw-sample'
import {
	ChevronLeft,
	ChevronRight,
	CheckCircle2,
	MessageSquare,
	FileText,
	Play,
	Settings,
	Maximize2,
	BookOpen,
} from 'lucide-react'
import { useState } from 'react'

export default function Lesson() {
	const { courseId, lessonId } = useParams()
	const parsedCourseId = Number(courseId)
	const course = COURSES.find((c) => c.id === parsedCourseId) || COURSES[0]
	const [activeTab, setActiveTab] = useState('overview')

	return (
		<div className="flex flex-col h-[calc(100vh-120px)] text-slate-200">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<Link
						to={`/courses/${courseId}`}
						className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
					>
						<ChevronLeft className="w-6 h-6" />
					</Link>
					<div>
						<h1 className="text-xl font-bold text-white">
							3. Network Reconnaissance & Scanning
						</h1>
						<p className="text-sm text-slate-400">{course.title}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button className="px-4 py-2 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
						Previous
					</button>
					<button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
						Next Lesson
					</button>
				</div>
			</div>

			<div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
				{/* Main Content (Video Player) */}
				<div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">
					<div className="aspect-video bg-black rounded-3xl overflow-hidden relative group shadow-2xl shadow-black/50">
						<img
							src="https://picsum.photos/seed/lesson/1280/720"
							alt="Lesson Video"
							className="w-full h-full object-cover opacity-60"
							referrerPolicy="no-referrer"
						/>
						<div className="absolute inset-0 flex items-center justify-center">
							<button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform border border-white/30">
								<Play className="w-8 h-8 text-white fill-white ml-1" />
							</button>
						</div>

						{/* Custom Controls Overlay */}
						<div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
							<div className="flex flex-col gap-4">
								<div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
									<div className="h-full w-1/3 bg-emerald-500"></div>
								</div>
								<div className="flex items-center justify-between text-white">
									<div className="flex items-center gap-4">
										<Play className="w-5 h-5 fill-white" />
										<span className="text-xs font-medium">
											04:20 / 12:45
										</span>
									</div>
									<div className="flex items-center gap-4">
										<Settings className="w-5 h-5" />
										<Maximize2 className="w-5 h-5" />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Tabs */}
					<div className="space-y-6">
						<div className="flex border-b border-slate-800">
							{[
								{
									id: 'overview',
									label: 'Overview',
									icon: FileText,
								},
								{
									id: 'resources',
									label: 'Resources',
									icon: BookOpen,
								},
								{
									id: 'discussions',
									label: 'Discussions',
									icon: MessageSquare,
								},
							].map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
										activeTab === tab.id
											? 'border-emerald-500 text-emerald-400'
											: 'border-transparent text-slate-500 hover:text-slate-200'
									}`}
								>
									<tab.icon className="w-4 h-4" />
									{tab.label}
								</button>
							))}
						</div>

						<div className="prose prose-invert max-w-none">
							{activeTab === 'overview' && (
								<div className="space-y-4">
									<h2 className="text-xl font-bold text-white">
										About this lesson
									</h2>
									<p className="text-slate-300 leading-relaxed">
										In this lesson, we'll dive deep into
										network reconnaissance techniques. We'll
										explore how to identify active hosts,
										open ports, and running services on a
										target network. By the end of this
										module, you'll understand:
									</p>
									<ul className="list-disc list-inside space-y-2 text-slate-300">
										<li>
											Passive vs Active Reconnaissance
										</li>
										<li>
											Nmap scanning techniques and flags
										</li>
										<li>
											Banner grabbing and service
											enumeration
										</li>
										<li>
											Best practices for stealthy scanning
										</li>
									</ul>
								</div>
							)}
							{activeTab === 'resources' && (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{[
										{
											name: 'Nmap_Cheat_Sheet.pdf',
											size: '1.2 MB',
										},
										{
											name: 'Lab_Network_Topology.png',
											size: '0.8 MB',
										},
										{
											name: 'Recon_Tools_Guide.epub',
											size: '2.4 MB',
										},
									].map((file, i) => (
										<div
											key={i}
											className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-colors group cursor-pointer"
										>
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
													<FileText className="w-5 h-5 text-slate-500 group-hover:text-emerald-400" />
												</div>
												<div>
													<p className="text-sm font-bold text-white">
														{file.name}
													</p>
													<p className="text-xs text-slate-500">
														{file.size}
													</p>
												</div>
											</div>
											<button className="text-emerald-400 text-xs font-bold">
												Download
											</button>
										</div>
									))}
								</div>
							)}
							{activeTab === 'discussions' && (
								<div className="space-y-6">
									<div className="flex gap-4">
										<div className="w-10 h-10 rounded-full bg-slate-800 flex-shrink-0 border border-slate-700"></div>
										<div className="flex-1">
											<textarea
												placeholder="Ask a question or share your thoughts..."
												className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none h-24"
											></textarea>
											<div className="flex justify-end mt-2">
												<button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
													Post Comment
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Sidebar (Playlist) */}
				<div className="lg:col-span-1 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm min-h-0">
					<div className="p-5 border-b border-slate-800 bg-slate-800/50">
						<h3 className="font-bold text-white">Course Content</h3>
						<div className="flex items-center justify-between mt-1">
							<p className="text-xs text-slate-400">
								12/24 lessons completed
							</p>
							<span className="text-xs font-bold text-emerald-400">
								50%
							</span>
						</div>
						<div className="h-1.5 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
							<div className="h-full w-1/2 bg-emerald-600 rounded-full"></div>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto scrollbar-thin">
						{[1, 2, 3].map((module) => (
							<div key={module}>
								<div className="px-5 py-3 bg-slate-800/50 border-y border-slate-800">
									<p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
										Module {module}
									</p>
								</div>
								<div className="divide-y divide-slate-800">
									{[1, 2, 3, 4].map((lesson) => (
										<div
											key={lesson}
											className={`p-4 flex items-center gap-3 hover:bg-slate-800 transition-colors cursor-pointer group ${
												module === 1 && lesson === 3
													? 'bg-emerald-500/10'
													: ''
											}`}
										>
											<div
												className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
													module === 1 && lesson < 3
														? 'bg-emerald-500/10 text-emerald-400'
														: module === 1 &&
															  lesson === 3
															? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
															: 'bg-slate-800 text-slate-500'
												}`}
											>
												{module === 1 && lesson < 3 ? (
													<CheckCircle2 className="w-4 h-4" />
												) : (
													<span className="text-[10px] font-bold">
														{lesson}
													</span>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p
													className={`text-xs font-medium truncate ${
														module === 1 &&
														lesson === 3
															? 'text-emerald-400'
															: 'text-slate-300'
													}`}
												>
													{lesson === 1
														? 'Intro to Cyber Threats'
														: lesson === 2
															? 'Setting up Kali Linux'
															: lesson === 3
																? 'Network Recon & Scanning'
																: 'Practical Lab: Nmap'}
												</p>
												<div className="flex items-center gap-2 mt-0.5">
													<Play className="w-2.5 h-2.5 text-slate-500" />
													<span className="text-[10px] text-slate-500">
														12:45
													</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
