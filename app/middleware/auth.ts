import { redirect } from "react-router";
import { userContext } from "~/context";
import { destroySession, getSession } from "~/.server/auth/sessions";
import { getUserById } from "~/.server/database/utils";
import type {Route} from '../+types/root'

export const authMiddleware: Route.MiddlewareFunction = async ({
  request,
  context,
}) => {
  console.log('Auth middleware activating.')
  const session = await getSession(request.headers.get('Cookie'));
  // const session = await getSession();
  const userId = session.get("userId");
  console.log(`Got userId from session: ${userId}`)

  if (!userId) {
    throw redirect("/login");
  }

  const user = await getUserById(userId);

  if (!user) {
    throw redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session)
      }
    })
  }

  context.set(userContext, user);
};
