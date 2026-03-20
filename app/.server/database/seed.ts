import { db } from './connection'
import { users, categories, courses, modules, lessons, usersToCourses, usersToLessons } from './schema'
import { USERS, CATEGORIES, COURSES, MODULES, LESSONS, USERS_TO_COURSES, USERS_TO_LESSONS } from './raw-sample'

async function seed() {
	console.log('🌱 Seeding database...')

	const insertedUsers = await db.insert(users)
		.values(USERS.map(({ id: _, ...u }) => u))
		.returning()

	console.log(`✅ Inserted ${insertedUsers.length} users`)

	const insertedCategories = await db.insert(categories)
		.values(CATEGORIES.map(({ id: _, ...c }) => c))
		.returning()

	console.log(`✅ Inserted ${insertedCategories.length} categories`)

	const insertedCourses = await db.insert(courses)
		.values(COURSES.map(({ id: _, ...c }) => c))
		.returning()

	console.log(`✅ Inserted ${insertedCourses.length} courses`)

	// Map mock IDs → real DB IDs
	const userIdMap = Object.fromEntries(USERS.map((u, i) => [u.id, insertedUsers[i].id]))
	const categoryIdMap = Object.fromEntries(CATEGORIES.map((c, i) => [c.id, insertedCategories[i].id]))
	const courseIdMap = Object.fromEntries(COURSES.map((c, i) => [c.id, insertedCourses[i].id]))

	const insertedModules = await db.insert(modules)
		.values(MODULES.map(({ id: _, ...m }) => ({ ...m, courseId: courseIdMap[m.courseId] })))
		.returning()

	console.log(`✅ Inserted ${insertedModules.length} modules`)

	const moduleIdMap = Object.fromEntries(MODULES.map((m, i) => [m.id, insertedModules[i].id]))

	const insertedLessons = await db.insert(lessons)
		.values(LESSONS.map(({ id: _, ...l }) => ({ ...l, moduleId: moduleIdMap[l.moduleId] })))
		.returning()

	console.log(`✅ Inserted ${insertedLessons.length} lessons`)

	const lessonIdMap = Object.fromEntries(LESSONS.map((l, i) => [l.id, insertedLessons[i].id]))

	await db.insert(usersToCourses)
		.values(USERS_TO_COURSES.map((utc) => ({
			userId: userIdMap[utc.userId],
			courseId: courseIdMap[utc.courseId],
		})))

	console.log('✅ Inserted user-course enrollments')

	await db.insert(usersToLessons)
		.values(USERS_TO_LESSONS.map((utl) => ({
			userId: userIdMap[utl.userId],
			lessonId: lessonIdMap[utl.lessonId],
			completed: utl.completed,
		})))

	console.log('✅ Inserted lesson completion records')
	console.log('🎉 Seeding complete!')
}

seed()
	.catch((e) => {
		console.error('❌ Seed failed:', e)
		process.exit(1)
	})
	.finally(() => process.exit(0))