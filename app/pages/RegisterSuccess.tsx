import { CheckCircle2, Link } from 'lucide-react'
import { motion } from 'motion/react'

export default function RegisterSuccess() {
	return (
		<div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className="max-w-md w-full bg-white rounded-xl shadow-2xl shadow-neutral-200/50 border border-neutral-100 p-12 text-center"
			>
				<div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
					<CheckCircle2 className="w-10 h-10 text-emerald-500" />
				</div>
				<h2 className="text-2xl font-bold text-neutral-900 mb-2">
					Account Created!
				</h2>
				<p className="text-neutral-500 mb-8">
					Your learning journey starts now. Welcome to CyberSpace
					Academy.
				</p>
				<Link
					to="/login"
					className="inline-flex items-center justify-center w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
				>
					Go to Login
				</Link>
			</motion.div>
		</div>
	)
}
