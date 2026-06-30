import { sql } from 'drizzle-orm'
import { db } from '../app/.server/database/connection'

async function wipe() {
	console.log('🗑️  Wiping database...')

	await db.execute(sql`
		DROP TABLE IF EXISTS cyberspace.challenge_tags             CASCADE;
		DROP TABLE IF EXISTS cyberspace.user_challenges            CASCADE;
		DROP TABLE IF EXISTS cyberspace.challenge_submissions      CASCADE;
		DROP TABLE IF EXISTS cyberspace.challenge_options          CASCADE;
		DROP TABLE IF EXISTS cyberspace.challenge_questions        CASCADE;
		DROP TABLE IF EXISTS cyberspace.challenges                 CASCADE;
		DROP TABLE IF EXISTS cyberspace.tags                       CASCADE;
		DROP TABLE IF EXISTS cyberspace.path_challenges             CASCADE;
		DROP TABLE IF EXISTS cyberspace.path_courses               CASCADE;
		DROP TABLE IF EXISTS cyberspace.user_paths                 CASCADE;
		DROP TABLE IF EXISTS cyberspace.learning_paths             CASCADE;
		DROP TABLE IF EXISTS cyberspace.password_reset_tokens      CASCADE;
		DROP TABLE IF EXISTS cyberspace.users_to_lessons           CASCADE;
		DROP TABLE IF EXISTS cyberspace.users_to_courses           CASCADE;
		DROP TABLE IF EXISTS cyberspace.reviews                    CASCADE;
		DROP TABLE IF EXISTS cyberspace.lessons                    CASCADE;
		DROP TABLE IF EXISTS cyberspace.modules                    CASCADE;
		DROP TABLE IF EXISTS cyberspace.courses                    CASCADE;
		DROP TABLE IF EXISTS cyberspace.users                      CASCADE;
		DROP TABLE IF EXISTS cyberspace.categories                 CASCADE;
	`)

	console.log('✅ Database wiped')
}

wipe()
	.catch((e) => {
		console.error('❌ Wipe failed:', e)
		process.exit(1)
	})
	.finally(() => process.exit(0))
