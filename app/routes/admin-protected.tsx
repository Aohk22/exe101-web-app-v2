import { adminMiddleware } from '~/middleware/admin'
import type { Route } from '../+types/root'
import { Outlet } from 'react-router'

export const middleware: Route.MiddlewareFunction[] = [adminMiddleware]

export default function AdminProtected() {
	return <Outlet />
}
