import { authMiddleware } from '~/middleware/auth'
import { userContext } from '~/context'
import type { Route } from '../+types/root'
import { Outlet } from 'react-router'
import type { ShouldRevalidateFunctionArgs } from 'react-router'

export const middleware: Route.MiddlewareFunction[] = [authMiddleware]

export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
	return true
}

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(userContext)
	return { user }
}

export default function Protected() {
	return <Outlet />
}
