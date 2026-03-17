import { db } from '~/.server/database/connection'
import { users, courses, modules, lessons, usersToCourses } from './schema'
import { COURSES, MODULES } from '~/constants'

// Helper: convert "MM:SS" string to total seconds
function durationToSeconds(duration: string): number {
	const [minutes, seconds] = duration.split(':').map(Number)
	return minutes * 60 + seconds
}

async function seed() {
	console.log('🌱 Seeding database...')

	// 1. Seed users
	const insertedUsers = await db
		.insert(users)
		.values([
			{
				name: 'Alice Johnson',
				email: 'alice@example.com',
				password: 'hashed_password_1',
			},
			{
				name: 'Bob Smith',
				email: 'bob@example.com',
				password: 'hashed_password_2',
			},
		])
		.returning()

	console.log(`✅ Inserted ${insertedUsers.length} users`)

	// 2. Seed courses from COURSES constant
	const insertedCourses = await db
		.insert(courses)
		.values(
			COURSES.map((c) => ({
				title: c.title,
				description: c.description,
				instructor: c.instructor,
				thumbnail: c.thumbnail,
				category: c.category,
				length: c.duration, // duration → length
			})),
		)
		.returning()

	console.log(`✅ Inserted ${insertedCourses.length} courses`)

	// Map constant IDs to inserted DB IDs for lookups
	const courseById = Object.fromEntries(
		COURSES.map((c, i) => [c.id, insertedCourses[i]]),
	)

	// 3. Infer courseId for each module by title keywords
	function inferCourseId(moduleTitle: string): number {
		if (/penetration|network security|cyber defense/i.test(moduleTitle)) {
			return courseById['1'].id // Ethical Hacking Fundamentals
		}
		if (/firewall|defense|hardening/i.test(moduleTitle)) {
			return courseById['2'].id // Network Defense & Hardening
		}
		if (/forensic|incident/i.test(moduleTitle)) {
			return courseById['3'].id // Digital Forensics & Incident Response
		}
		if (/cloud|aws|azure/i.test(moduleTitle)) {
			return courseById['4'].id // Cloud Security Architecture
		}
		return courseById['1'].id // fallback
	}

	// 4. Seed modules from MODULES constant
	const insertedModules = await db
		.insert(modules)
		.values(
			MODULES.map((m) => ({
				title: m.title,
				courseId: inferCourseId(m.title),
			})),
		)
		.returning()

	console.log(`✅ Inserted ${insertedModules.length} modules`)

	// 5. Seed lessons, linked to their parent module
	const allLessons = MODULES.flatMap((m, moduleIndex) =>
		m.lessons.map((l) => ({
			title: l.title,
			length: durationToSeconds(l.duration),
			moduleId: insertedModules[moduleIndex].id,
		})),
	)

	const insertedLessons = await db
		.insert(lessons)
		.values(allLessons)
		.returning()

	console.log(`✅ Inserted ${insertedLessons.length} lessons`)

	// 6. Seed users_to_courses using progress from COURSES constant
	await db.insert(usersToCourses).values([
		// Alice is enrolled in all courses, progress from constants
		...COURSES.map((c) => ({
			userId: insertedUsers[0].id,
			courseId: courseById[c.id].id,
			progress: c.progress,
			completed: c.progress === 100,
		})),
		// Bob is enrolled in a couple
		{
			userId: insertedUsers[1].id,
			courseId: courseById['1'].id,
			progress: 100,
			completed: true,
		},
		{
			userId: insertedUsers[1].id,
			courseId: courseById['4'].id,
			progress: 60,
			completed: false,
		},
	])

	console.log('✅ Inserted user-course enrollments')
	console.log('🎉 Seeding complete!')
}

seed()
	.catch((e) => {
		console.error('❌ Seed failed:', e)
		process.exit(1)
	})
	.finally(() => process.exit(0))
