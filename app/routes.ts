import {
	type RouteConfig,
	index,
	layout,
	route,
} from '@react-router/dev/routes'

export default [
	route('login', './pages/Login.tsx'),
	route('register', './pages/Register.tsx'),
	route('registration-success', './pages/RegisterSuccess.tsx'),
	route('forgot-password', './pages/ForgotPassword.tsx'),
	route('reset-password', './pages/ResetPassword.tsx'),

	layout('./routes/protected.tsx', [
		layout('./layouts/MainLayout.tsx', [
			index('./pages/IndexRedirect.tsx'),
			layout('./layouts/SectionLayout.tsx', [


				// User navigation
				route('dashboard', './pages/Dashboard.tsx'),

				route('courses', './pages/Courses.tsx'),
				route('courses/:courseId', './pages/CourseDetail.tsx'),
				route('courses/:courseId/lessons/:lessonId',
					'./pages/Lesson.tsx',
				),

				route('paths', './pages/Paths.tsx'),
				route('paths/:pathId', './pages/PathDetail.tsx'),


				// Admin navigation (role-gated)
				layout('./routes/admin-protected.tsx', [
					route('admin', './pages/AdminDashboard.tsx'),

					route('course-builder', './pages/CourseBuilder.tsx'),
					route(
						'course-builder/:courseId/lessons/:lessonId',
						'./pages/CourseBuilderLesson.tsx',
					),
					route('course-builder/:courseId/export', './routes/CourseExport.ts'),

					route('users', './pages/AdminUsers.tsx'),
					route('users/new', './pages/AdminCreateUser.tsx'),
					route('users/:userId/edit', './pages/AdminUserEdit.tsx'),

					route('categories', './pages/AdminCategories.tsx'),

					route('paths-admin', './pages/AdminPaths.tsx', [
						route(':pathId', './pages/AdminPathDetail.tsx'),
					]),
				]),


				// General
				layout('./layouts/UnderConstructionLayout.tsx', [
					route('achievements', './pages/Achievements.tsx'),
				]),

				route('settings', './pages/Settings.tsx'),
			]),
		]),
	]),
	route('*', './routes/splat-redirect.tsx'),
] satisfies RouteConfig
