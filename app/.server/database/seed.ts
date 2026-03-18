import { db } from '~/.server/database/connection'
import { users, courses, modules, lessons, usersToCourses, usersToLessons } from './schema'

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
			{
				name: 'Carol White',
				email: 'carol@example.com',
				password: 'hashed_password_3',
			},
		])
		.returning()

	console.log(`✅ Inserted ${insertedUsers.length} users`)

	// 2. Seed courses
	const insertedCourses = await db
		.insert(courses)
		.values([
			{
				title: 'Ethical Hacking Fundamentals',
				description: 'Learn the core concepts of ethical hacking and penetration testing.',
				instructor: 'John Doe',
				thumbnail: '/thumbnails/ethical-hacking.png',
				category: 'Security',
				length: 36000,
			},
			{
				title: 'Network Defense & Hardening',
				description: 'Master firewall configuration and network hardening techniques.',
				instructor: 'Jane Smith',
				thumbnail: '/thumbnails/network-defense.png',
				category: 'Security',
				length: 30600,
			},
			{
				title: 'Cloud Security Architecture',
				description: 'Secure cloud infrastructure across AWS and Azure environments.',
				instructor: 'Carlos Rivera',
				thumbnail: '/thumbnails/cloud-security.png',
				category: 'Cloud',
				length: 43200,
			},
		])
		.returning()

	console.log(`✅ Inserted ${insertedCourses.length} courses`)

	const [ethicalHacking, networkDefense, cloudSecurity] = insertedCourses

	// 3. Seed modules (at least 2 per course)
	const insertedModules = await db
		.insert(modules)
		.values([
			// Ethical Hacking modules
			{ title: 'Introduction to Penetration Testing', courseId: ethicalHacking.id },
			{ title: 'Network Scanning & Enumeration', courseId: ethicalHacking.id },
			// Network Defense modules
			{ title: 'Firewall Configuration Basics', courseId: networkDefense.id },
			{ title: 'Intrusion Detection Systems', courseId: networkDefense.id },
			// Cloud Security modules
			{ title: 'AWS Security Fundamentals', courseId: cloudSecurity.id },
			{ title: 'Azure Identity & Access Management', courseId: cloudSecurity.id },
		])
		.returning()

	console.log(`✅ Inserted ${insertedModules.length} modules`)

	const [
		introPenTest,
		networkScanning,
		firewallConfig,
		ids,
		awsSecurity,
		azureIam,
	] = insertedModules

	// 4. Seed lessons (at least 2 per module)
	const insertedLessons = await db
		.insert(lessons)
		.values([
			// Intro to Penetration Testing
			{ title: 'What is Ethical Hacking?', length: durationToSeconds('12:30'), moduleId: introPenTest.id },
			{ title: 'Setting Up Your Lab Environment', length: durationToSeconds('18:00'), moduleId: introPenTest.id },
			{ title: 'Legal & Ethical Considerations', length: durationToSeconds('10:15'), moduleId: introPenTest.id },
			// Network Scanning & Enumeration
			{ title: 'Using Nmap for Network Discovery', length: durationToSeconds('20:00'), moduleId: networkScanning.id },
			{ title: 'Service & Version Detection', length: durationToSeconds('15:45'), moduleId: networkScanning.id },
			// Firewall Configuration Basics
			{ title: 'Understanding Firewall Rules', length: durationToSeconds('14:00'), moduleId: firewallConfig.id },
			{ title: 'Configuring iptables', length: durationToSeconds('22:30'), moduleId: firewallConfig.id },
			// Intrusion Detection Systems
			{ title: 'Intro to Snort', length: durationToSeconds('16:00'), moduleId: ids.id },
			{ title: 'Writing Custom IDS Rules', length: durationToSeconds('19:20'), moduleId: ids.id },
			// AWS Security Fundamentals
			{ title: 'IAM Roles & Policies', length: durationToSeconds('17:00'), moduleId: awsSecurity.id },
			{ title: 'S3 Bucket Security', length: durationToSeconds('13:45'), moduleId: awsSecurity.id },
			// Azure IAM
			{ title: 'Azure Active Directory Basics', length: durationToSeconds('15:00'), moduleId: azureIam.id },
			{ title: 'Conditional Access Policies', length: durationToSeconds('21:10'), moduleId: azureIam.id },
		])
		.returning()

	console.log(`✅ Inserted ${insertedLessons.length} lessons`)

	// 5. Enroll users in courses
	await db.insert(usersToCourses).values([
		// Alice enrolled in all courses
		{ userId: insertedUsers[0].id, courseId: ethicalHacking.id },
		{ userId: insertedUsers[0].id, courseId: networkDefense.id },
		{ userId: insertedUsers[0].id, courseId: cloudSecurity.id },
		// Bob enrolled in two courses
		{ userId: insertedUsers[1].id, courseId: ethicalHacking.id },
		{ userId: insertedUsers[1].id, courseId: cloudSecurity.id },
		// Carol enrolled in one course
		{ userId: insertedUsers[2].id, courseId: networkDefense.id },
	])

	console.log('✅ Inserted user-course enrollments')

	// 6. Seed lesson completions via usersToLessons
	const [lesson1, lesson2, lesson3, lesson4, lesson5] = insertedLessons

	await db.insert(usersToLessons).values([
		// Alice completed several lessons
		{ userId: insertedUsers[0].id, lessonId: lesson1.id, completed: true },
		{ userId: insertedUsers[0].id, lessonId: lesson2.id, completed: true },
		{ userId: insertedUsers[0].id, lessonId: lesson3.id, completed: false },
		// Bob completed a couple
		{ userId: insertedUsers[1].id, lessonId: lesson1.id, completed: true },
		{ userId: insertedUsers[1].id, lessonId: lesson4.id, completed: true },
		{ userId: insertedUsers[1].id, lessonId: lesson5.id, completed: false },
		// Carol just started
		{ userId: insertedUsers[2].id, lessonId: lesson1.id, completed: false },
	])

	console.log('✅ Inserted lesson completion records')
	console.log('🎉 Seeding complete!')
}

seed()
	.catch((e) => {
		console.error('❌ Seed failed:', e)
		process.exit(1)
	})
	.finally(() => process.exit(0))