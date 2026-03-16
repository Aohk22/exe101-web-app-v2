import { db } from '~/.server/database/connection'
import { users } from '~/.server/database/schema'
import { eq } from 'drizzle-orm'

export async function getUserById(userId: string) {
    const result = (await db.select().from(users).where(eq(users.id, parseInt(userId)))).at(0)
    return result ? result : null
}