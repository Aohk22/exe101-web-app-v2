import 'dotenv/config'
import { sql } from 'drizzle-orm'
import { db } from '../app/.server/database/connection'
import {
	users,
	categories,
	courses,
	modules,
	lessons,
	usersToCourses,
	learningPaths,
	pathCourses,
	challengeQuestions,
	challengeOptions,
} from '../app/.server/database/schema'

const CATEGORIES = [
	{ id: 1, name: 'Security' },
	{ id: 2, name: 'Cloud' },
]

const USERS = [
	{
		id: 1,
		name: 'Alice Johnson',
		email: 'alice@example.com',
		password: '$2b$10$L0JZezH14E1wHCrJykgFJey03QU2P1ysVfpIRWIbv5gm3Iar7/EL.',
		role: 'learner' as const,
	},
	{
		id: 2,
		name: 'Bob Smith',
		email: 'bob@example.com',
		password: 'hashed_password_2',
		role: 'learner' as const,
	},
	{
		id: 3,
		name: 'Carol White',
		email: 'carol@example.com',
		password: 'hashed_password_3',
		role: 'learner' as const,
	},
	{
		id: 4,
		name: 'Staff Admin',
		email: 'staff@example.com',
		password: '$2b$10$L0JZezH14E1wHCrJykgFJey03QU2P1ysVfpIRWIbv5gm3Iar7/EL.',
		role: 'staff' as const,
	},
]

const COURSES = [
	{
		id: 1,
		title: 'Ethical Hacking Fundamentals',
		description: 'Learn the core concepts of ethical hacking and penetration testing.',
		instructor: 'John Doe',
		thumbnail: 'https://picsum.photos/seed/ethical-hacking/600/400',
		categoryId: 1,
		length: 36000,
	},
	{
		id: 2,
		title: 'Network Defense & Hardening',
		description: 'Master firewall configuration and network hardening techniques.',
		instructor: 'Jane Smith',
		thumbnail: 'https://picsum.photos/seed/network-defense/600/400',
		categoryId: 1,
		length: 30600,
	},
	{
		id: 3,
		title: 'Cloud Security Architecture',
		description: 'Secure cloud infrastructure across AWS and Azure environments.',
		instructor: 'Carlos Rivera',
		thumbnail: 'https://picsum.photos/seed/cloud-security/600/400',
		categoryId: 2,
		length: 43200,
	},
]

const MODULES = [
	{ id: 1, title: 'Introduction to Penetration Testing', courseId: 1 },
	{ id: 2, title: 'Network Scanning & Enumeration', courseId: 1 },
	{ id: 3, title: 'Firewall Configuration Basics', courseId: 2 },
	{ id: 4, title: 'Intrusion Detection Systems', courseId: 2 },
	{ id: 5, title: 'AWS Security Fundamentals', courseId: 3 },
	{ id: 6, title: 'Azure Identity & Access Management', courseId: 3 },
]

const LESSONS = [
	{
		id: 1,
		title: 'What is Ethical Hacking?',
		length: 750,
		contentMd: `# What is Ethical Hacking?

Ethical hacking is the authorized practice of testing systems, networks, and applications to discover weaknesses before attackers do.

## What you should understand

- Why authorization matters
- The difference between ethical hackers and malicious attackers
- The role of reporting and remediation

## Core idea

A security assessment only creates value when the findings are documented clearly and handed back to the team that owns the system.`,
		moduleId: 1,
	},
	{
		id: 2,
		title: 'Setting Up Your Lab Environment',
		length: 1080,
		contentMd: `# Setting Up Your Lab Environment

A safe lab lets you practice without risking production systems.

## Recommended setup

- A virtualization tool
- An attacker machine
- A target machine
- A note-taking workflow for commands and findings

## Before you begin

Make sure snapshots are enabled so you can reset your environment after each exercise.`,
		moduleId: 1,
	},
	{
		id: 3,
		title: 'Legal & Ethical Considerations',
		length: 615,
		contentMd: `# Legal and Ethical Considerations

Always get explicit permission before testing any environment.

## Rules to keep in mind

- Stay within scope
- Respect data privacy
- Avoid destructive testing unless it is approved
- Report findings responsibly

> A good security practitioner protects trust as much as infrastructure.`,
		moduleId: 1,
	},
	{
		id: 4,
		title: 'Using Nmap for Network Discovery',
		length: 1200,
		contentMd: `# Using Nmap for Network Discovery

Nmap helps identify reachable hosts and exposed services.

## Common workflow

1. Identify live hosts
2. Scan open ports
3. Collect service banners
4. Document the results

## Example focus areas

- TCP ports
- UDP ports
- Host discovery methods
- Timing and rate considerations`,
		moduleId: 2,
	},
	{
		id: 5,
		title: 'Service & Version Detection',
		length: 945,
		contentMd: `# Service and Version Detection

Knowing that a port is open is only the start. Version detection helps map a service to potential risk.

## Why it matters

- It helps verify what is actually running
- It provides context for vulnerability research
- It improves the quality of your report

## Output to capture

- Port number
- Service name
- Version string
- Confidence or uncertainty notes`,
		moduleId: 2,
	},
	{
		id: 6,
		title: 'Understanding Firewall Rules',
		length: 840,
		contentMd: `# Understanding Firewall Rules

Firewall rules define what traffic is allowed, denied, or logged.

## Key concepts

- Source and destination
- Protocol and port
- Direction of traffic
- Default deny vs default allow

A readable rule set is easier to maintain and far safer to audit.`,
		moduleId: 3,
	},
	{
		id: 7,
		title: 'Configuring iptables',
		length: 1350,
		contentMd: `# Configuring iptables

iptables is a rule-based packet filtering framework commonly used on Linux systems.

## Typical tasks

- List current rules
- Add allow rules
- Block unwanted traffic
- Save and verify the final policy

\`\`\`bash
iptables -L -n -v
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
\`\`\``,
		moduleId: 3,
	},
	{
		id: 8,
		title: 'Intro to Snort',
		length: 960,
		contentMd: `# Intro to Snort

Snort is an intrusion detection and prevention platform used to inspect traffic for suspicious patterns.

## What to learn first

- Traffic inspection basics
- Rule matching flow
- Alerting and logging
- Tuning for noise reduction`,
		moduleId: 4,
	},
	{
		id: 9,
		title: 'Writing Custom IDS Rules',
		length: 1160,
		contentMd: `# Writing Custom IDS Rules

Custom rules help detect patterns that matter to your own environment.

## Good rule-writing habits

- Start simple
- Test against known traffic
- Avoid noisy signatures
- Add comments for future maintainers`,
		moduleId: 4,
	},
	{
		id: 10,
		title: 'IAM Roles & Policies',
		length: 1020,
		contentMd: `# IAM Roles and Policies

Identity and access management is the control plane for cloud permissions.

## Design principles

- Least privilege
- Clear role boundaries
- Short-lived credentials where possible
- Review and removal of unused access`,
		moduleId: 5,
	},
	{
		id: 11,
		title: 'S3 Bucket Security',
		length: 825,
		contentMd: `# S3 Bucket Security

Storage security depends on both bucket configuration and identity policy design.

## Review checklist

- Public access settings
- Bucket policy scope
- Encryption at rest
- Logging and monitoring`,
		moduleId: 5,
	},
	{
		id: 12,
		title: 'Azure Active Directory Basics',
		length: 900,
		contentMd: `# Azure Active Directory Basics

Identity is central to access control in modern cloud platforms.

## Focus points

- Users and groups
- Application identities
- Role assignments
- Directory security posture`,
		moduleId: 6,
	},
	{
		id: 13,
		title: 'Conditional Access Policies',
		length: 1270,
		contentMd: `# Conditional Access Policies

Conditional access applies rules to authentication decisions based on user, device, app, or location context.

## Effective policy design

- Start in report-only mode
- Group similar scenarios together
- Minimize user friction
- Measure the impact before enforcing broadly`,
		moduleId: 6,
	},
]

const USERS_TO_COURSES = [
	{ userId: 1, courseId: 1 },
	{ userId: 1, courseId: 2 },
	{ userId: 1, courseId: 3 },
	{ userId: 2, courseId: 1 },
	{ userId: 2, courseId: 3 },
	{ userId: 3, courseId: 2 },
]

const LEARNING_PATHS = [
	{
		title: 'Security Foundations',
		description: 'Master the fundamentals of ethical hacking and network defense.',
		thumbnail: 'https://picsum.photos/seed/security-foundations/600/400',
	},
	{
		title: 'Cloud Practitioner',
		description: 'Build a strong foundation in cloud security architecture.',
		thumbnail: 'https://picsum.photos/seed/cloud-practitioner/600/400',
	},
]

const PATH_COURSES = [
	{ pathIndex: 0, courseId: 1, position: 0 },
	{ pathIndex: 0, courseId: 2, position: 1 },
	{ pathIndex: 1, courseId: 3, position: 0 },
]

async function seed() {
	console.log('🌱 Seeding database...')

	await db.execute(sql`
		CREATE OR REPLACE FUNCTION fill_user_lessons()
		RETURNS TRIGGER AS $$
		BEGIN
			INSERT INTO users_to_lessons (user_id, lesson_id, completed)
			SELECT NEW.user_id, l.id, false
			FROM lessons l
			INNER JOIN modules m ON l.module_id = m.id
			WHERE m.course_id = NEW.course_id
			ON CONFLICT DO NOTHING;
			RETURN NEW;
		END;
		$$ LANGUAGE plpgsql;

		CREATE OR REPLACE TRIGGER on_course_enrollment
		AFTER INSERT ON users_to_courses
		FOR EACH ROW EXECUTE FUNCTION fill_user_lessons();
	`)

	console.log('✅ Trigger ready')

	const insertedCategories = await db
		.insert(categories)
		.values(CATEGORIES.map(({ id: _, ...c }) => c))
		.returning()

	console.log(`✅ Inserted ${insertedCategories.length} categories`)

	const categoryIdMap = Object.fromEntries(
		CATEGORIES.map((c, i) => [c.id, insertedCategories[i].id]),
	)

	const insertedUsers = await db
		.insert(users)
		.values(USERS.map(({ id: _, ...u }) => u))
		.returning()

	console.log(`✅ Inserted ${insertedUsers.length} users`)

	const userIdMap = Object.fromEntries(
		USERS.map((u, i) => [u.id, insertedUsers[i].id]),
	)

	const insertedCourses = await db
		.insert(courses)
		.values(
			COURSES.map(({ id: _, ...c }) => ({
				...c,
				categoryId: categoryIdMap[c.categoryId],
			})),
		)
		.returning()

	console.log(`✅ Inserted ${insertedCourses.length} courses`)

	const courseIdMap = Object.fromEntries(
		COURSES.map((c, i) => [c.id, insertedCourses[i].id]),
	)

	const insertedModules = await db
		.insert(modules)
		.values(
			MODULES.map(({ id: _, ...m }) => ({
				...m,
				courseId: courseIdMap[m.courseId],
			})),
		)
		.returning()

	console.log(`✅ Inserted ${insertedModules.length} modules`)

	const moduleIdMap = Object.fromEntries(
		MODULES.map((m, i) => [m.id, insertedModules[i].id]),
	)

	const insertedLessons = await db
		.insert(lessons)
		.values(
			LESSONS.map(({ id: _, ...l }) => ({
				...l,
				moduleId: moduleIdMap[l.moduleId],
			})),
		)
		.returning()

	console.log(`✅ Inserted ${insertedLessons.length} lessons`)

	await db.insert(usersToCourses).values(
		USERS_TO_COURSES.map((utc) => ({
			userId: userIdMap[utc.userId],
			courseId: courseIdMap[utc.courseId],
		})),
	)

	console.log('✅ Inserted user-course enrollments (trigger auto-populated users_to_lessons)')

	const insertedPaths = await db
		.insert(learningPaths)
		.values(LEARNING_PATHS)
		.returning()

	console.log(`✅ Inserted ${insertedPaths.length} learning paths`)

	await db.insert(pathCourses).values(
		PATH_COURSES.map((pc) => ({
			pathId: insertedPaths[pc.pathIndex].id,
			courseId: courseIdMap[pc.courseId],
			position: pc.position,
		})),
	)

	console.log('✅ Inserted path-course associations')

	// Challenge questions — added to lesson 1 (What is Ethical Hacking?) and lesson 6 (Understanding Firewall Rules)
	const CHALLENGE_QUESTIONS = [
		{
			lessonIndex: 0, // "What is Ethical Hacking?"
			type: 'multiple_choice' as const,
			questionText: 'What distinguishes an ethical hacker from a malicious attacker?',
			correctAnswer: null,
			orderIndex: 0,
			options: [
				{ optionText: 'Ethical hackers have better technical skills', isCorrect: false },
				{ optionText: 'Ethical hackers have explicit authorization', isCorrect: true },
				{ optionText: 'Ethical hackers use different tools', isCorrect: false },
				{ optionText: 'Ethical hackers work faster', isCorrect: false },
			],
		},
		{
			lessonIndex: 0,
			type: 'flag' as const,
			questionText: 'What is the term for the practice of testing systems with authorization to find weaknesses?',
			correctAnswer: 'ethical hacking',
			orderIndex: 1,
			options: [],
		},
		{
			lessonIndex: 1, // "Setting Up Your Lab Environment"
			type: 'flag' as const,
			questionText: 'You are setting up your lab environment and find a sticky note on the monitor with the text "ZmxhZ3thbHc0eXNfZzR0aDNyXzFuZjBfd2gzbl9zM3R0MW5nX3VwfQ==". Decode this message to find the flag and enter it below.',
			correctAnswer: 'flag{alw4ys_g4th3r_1nf0_wh3n_s3tt1ng_up}',
			orderIndex: 0,
			options: [],
		},
		{
			lessonIndex: 5, // "Understanding Firewall Rules" (0-indexed after seed: lesson id 6 but index 5)
			type: 'flag' as const,
			questionText: 'What is the security principle that says traffic should be denied unless explicitly allowed?',
			correctAnswer: 'default deny',
			orderIndex: 0,
			options: [],
		},
	]

	for (const cq of CHALLENGE_QUESTIONS) {
		const lessonId = insertedLessons[cq.lessonIndex].id

		const [createdQuestion] = await db
			.insert(challengeQuestions)
			.values({
				lessonId,
				questionText: cq.questionText,
				type: cq.type,
				correctAnswer: cq.correctAnswer,
				orderIndex: cq.orderIndex,
			})
			.returning({ id: challengeQuestions.id })

		if (cq.options.length > 0) {
			await db.insert(challengeOptions).values(
				cq.options.map((opt, i) => ({
					questionId: createdQuestion.id,
					optionText: opt.optionText,
					isCorrect: opt.isCorrect,
					orderIndex: i,
				})),
			)
		}
	}

	console.log('✅ Inserted challenge questions')

	console.log('🎉 Seeding complete!')
}

seed()
	.catch((e) => {
		console.error('❌ Seed failed:', e)
		process.exit(1)
	})
	.finally(() => process.exit(0))
