import { redirect } from "react-router";
import { userContext } from "~/context";
import { getSession } from "~/.server/auth/sessions";
import { getUserById } from "~/.server/database/utils";
import type {Route} from '../+types/root'

export const authMiddleware: Route.MiddlewareFunction = async ({
  request,
  context,
}) => {
  const session = await getSession(request.headers.get('Cookie'));
  // const session = await getSession();
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  const user = await getUserById(userId);
  context.set(userContext, user);
};
