import { DrizzleQueryError, sql } from 'drizzle-orm'
import { db } from '~/.server/database/connection'
import bcrypt from 'bcrypt'

const saltRounds = 10

export async function register(name: string, email: string, password: string) {
	const hashed = await bcrypt.hash(password, saltRounds)

	try {
		const statement = sql`
			INSERT INTO users (name, email, password)
			VALUES (${name}, ${email}, ${hashed})
		`

		const res = await db.execute(statement)

		return res.rowCount
	} catch (e) {
		if (e instanceof DrizzleQueryError) {
			const cause: any = e.cause
			if (cause.code === '23505') {
				return null
			}
		} else {
			throw e
		}
	}
}
