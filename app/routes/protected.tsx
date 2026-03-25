import { authMiddleware } from '~/middleware/auth'
import { userContext } from '~/context'
import type { Route } from '../+types/root'
import { Outlet, redirect } from 'react-router'
import type { ShouldRevalidateFunctionArgs } from 'react-router'

export const middleware: Route.MiddlewareFunction[] = [authMiddleware]

export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
	return true
}

export async function loader({ request, context }: Route.LoaderArgs) {
	console.log('Protected loader activating')
	const user = context.get(userContext) // Guaranteed to exist

	return { user }
}

export default function Protected() {
	return <Outlet />
}
