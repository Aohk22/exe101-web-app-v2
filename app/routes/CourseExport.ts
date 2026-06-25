import { data, redirect } from 'react-router'
import { getSession, destroySession } from '~/.server/auth/sessions'
import { getUserById } from '~/.server/database/utils'
import { getCourseExportData } from '~/.server/queries/course-export'
import type { Route } from './+types/CourseExport'

export async function loader({ params, request }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get('Cookie'))
	const userId = session.get('userId')
	const userRole = session.get('userRole')

	if (!userId) {
		throw redirect('/login')
	}

	let role = userRole
	if (!role) {
		const user = await getUserById(userId)
		if (!user) {
			throw redirect('/register', {
				headers: { 'Set-Cookie': await destroySession(session) },
			})
		}
		role = user.role
	}

	if (role !== 'staff') {
		throw data({ error: 'Staff access required.' }, { status: 403 })
	}

	const courseId = Number(params.courseId)
	if (!Number.isFinite(courseId)) {
		throw data({ error: 'Invalid course ID.' }, { status: 400 })
	}

	const course = await getCourseExportData(courseId)
	if (!course) {
		throw data({ error: 'Course not found.' }, { status: 404 })
	}

	const json = JSON.stringify(course, null, 2)
	const filename = `course-${courseId}.json`

	return new Response(json, {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Content-Disposition': `attachment; filename="${filename}"`,
		},
	})
}
