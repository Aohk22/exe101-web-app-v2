import { redirect } from 'react-router'
import { userContext } from '~/context'
import type { Route } from '../+types/root'

export const adminMiddleware: Route.MiddlewareFunction = async ({
	context,
}) => {
	const user = context.get(userContext)
	if (!user || user.role !== 'staff') {
		throw redirect('/dashboard')
	}
}
