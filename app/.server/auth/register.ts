import { sql } from "drizzle-orm"
import { db } from "~/.server/database/connection"
import bcrypt from 'bcrypt'

const saltRounds = 10

export async function register(name: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, saltRounds)

    const statement = sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashed})`

    const res = await db.execute(statement)

    console.log(res)

    return 'good'
}