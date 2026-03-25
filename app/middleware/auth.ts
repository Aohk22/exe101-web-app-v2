import { redirect } from 'react-router'
import { userContext } from '~/context'
import { destroySession, getSession } from '~/.server/auth/sessions'
import { getUserById } from '~/.server/database/utils'
import type { Route } from '../+types/root'

export const authMiddleware: Route.MiddlewareFunction = async ({
	request,
	context,
}) => {
	const session = await getSession(request.headers.get('Cookie'))
	const userId = session.get('userId')

	if (!userId) {
		throw redirect('/login')
	}

	const user = await getUserById(userId)

	if (!user) {
		throw redirect('/register', {
			headers: {
				'Set-Cookie': await destroySession(session),
			},
		})
	}

	context.set(userContext, { name: user.name })
}
