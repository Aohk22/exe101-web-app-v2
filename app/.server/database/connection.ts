import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const pool = new Pool({
	connectionString: process.env.DATABASE_URL!,
})

pool.on('connect', (client) => {
	client.query('SET search_path TO cyberspace')
})

export const db = drizzle({ client: pool, logger: true })
