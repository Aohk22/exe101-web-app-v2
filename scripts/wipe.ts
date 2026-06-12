import { db } from '../app/.server/database/connection'
import {
	users,
	categories,
	courses,
	modules,
	lessons,
	usersToCourses,
	usersToLessons,
	reviews,
	challengeSubmissions,
	challengeOptions,
	challengeQuestions,
	learningPaths,
	pathCourses,
} from '../app/.server/database/schema'

async function wipe() {
	console.log('🗑️  Wiping database...')

	// Delete in dependency order (children before parents)
	await db.delete(challengeSubmissions)
	await db.delete(challengeOptions)
	await db.delete(challengeQuestions)
	await db.delete(pathCourses)
	await db.delete(learningPaths)
	await db.delete(usersToLessons)
	await db.delete(usersToCourses)
	await db.delete(reviews)
	await db.delete(lessons)
	await db.delete(modules)
	await db.delete(courses)
	await db.delete(users)
	await db.delete(categories)

	console.log('✅ Database wiped')
}

wipe()
	.catch((e) => {
		console.error('❌ Wipe failed:', e)
		process.exit(1)
	})
	.finally(() => process.exit(0))
