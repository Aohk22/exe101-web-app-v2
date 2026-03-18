import { db } from '~/.server/database/connection'
import { users, courses, modules, lessons, usersToCourses, usersToLessons, reviews } from './schema'

async function wipe() {
	console.log('🗑️  Wiping database...')

	// Delete in dependency order (children before parents)
	await db.delete(usersToLessons)
	await db.delete(usersToCourses)
	await db.delete(reviews)
	await db.delete(lessons)
	await db.delete(modules)
	await db.delete(courses)
	await db.delete(users)

	console.log('✅ Database wiped')
}

wipe()
	.catch((e) => {
		console.error('❌ Wipe failed:', e)
		process.exit(1)
	})
	.finally(() => process.exit(0))