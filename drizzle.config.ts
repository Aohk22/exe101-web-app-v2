import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'postgresql',
	schema: './app/.server/database/schema.ts',
	out: './drizzle/out',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	schemaFilter: ['public'],
})
