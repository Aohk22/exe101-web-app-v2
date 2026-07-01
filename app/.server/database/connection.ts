import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

type AppEnv = 'dev' | 'preview' | 'prod'

const ENV_FILES: Record<AppEnv, string> = {
	dev: '.dev.env',
	preview: '.preview.env',
	prod: '.prod.env',
}

const appEnv = (process.env.APP_ENV as AppEnv) || 'dev'

if (!ENV_FILES[appEnv]) {
	throw new Error(
		`Unknown APP_ENV "${appEnv}". Expected one of: ${Object.keys(ENV_FILES).join(', ')}`
	)
}

// Only load .env files locally. In deployed environments, the platform
// injects env vars directly and no .env file will exist on disk.
if (process.env.NODE_ENV !== 'production') {
	const envFile = ENV_FILES[appEnv]
	console.log(`Loading ${appEnv} env from ${envFile}...`)

	const result = config({ path: envFile, override: true })

	if (result.error) {
		throw new Error(`Failed to load ${envFile}: ${result.error.message}`)
	}
}

if (!process.env.DATABASE_URL) {
	throw new Error(
		`DATABASE_URL is not set. In production, configure it directly in your deployment platform's environment settings.`
	)
}

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
})

pool.on('connect', (client) => {
	client.query('SET search_path TO cyberspace').catch((err) => {
		console.error('Failed to set search_path on new connection:', err)
	})
})

pool.on('error', (err) => {
	console.error('Unexpected error on idle client:', err)
})

export const db = drizzle({ client: pool, logger: true })
