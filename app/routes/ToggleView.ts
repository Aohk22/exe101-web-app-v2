import { redirect } from 'react-router'
import { commitSession, getSession } from '~/.server/auth/sessions'
import type { Route } from './+types/ToggleView'

export async function action({ request }: Route.ActionArgs) {
	const session = await getSession(request.headers.get('Cookie'))
	const userRole = session.get('userRole')

	if (userRole !== 'staff') {
		throw new Response('Forbidden', { status: 403 })
	}

	const currentView = session.get('viewAsLearner') ?? false
	session.set('viewAsLearner', !currentView)

	const referer = request.headers.get('Referer') || '/'
	return redirect(referer, {
		headers: { 'Set-Cookie': await commitSession(session) },
	})
}
