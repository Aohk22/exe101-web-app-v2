import { redirect } from 'react-router'
import { userContext } from '~/context'
import type { Route } from './+types/IndexRedirect'

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(userContext)
	if (user?.role === 'staff') {
		throw redirect('/admin')
	}
	throw redirect('/dashboard')
}

export default function IndexRedirect() {
	return null
}
