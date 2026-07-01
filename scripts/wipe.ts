import { sql } from 'drizzle-orm'
import { db } from '../app/.server/database/connection'

async function wipe() {
	console.log('🗑️  Wiping database...')

	await db.execute(sql`
		DROP SCHEMA cyberspace CASCADE;
	`)

	console.log('✅ Database wiped')
}

wipe()
	.catch((e) => {
		console.error('❌ Wipe failed:', e)
		process.exit(1)
	})
	.finally(() => process.exit(0))
