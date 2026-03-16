import { authMiddleware } from "~/middleware/auth"
import { userContext } from "~/context";
import type { Route } from "../+types/root";
import { Outlet } from "react-router";

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
];

export async function loader({
  context,
}: Route.LoaderArgs) {
  const user = context.get(userContext); // Guaranteed to exist
  return { user };
}

export default function Protected() {
    return <Outlet />
}
