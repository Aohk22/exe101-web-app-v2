export const USERS = [
	{ id: 1, name: 'Alice Johnson', email: 'alice@example.com', password: '$2b$10$L0JZezH14E1wHCrJykgFJey03QU2P1ysVfpIRWIbv5gm3Iar7/EL.' },
	{ id: 2, name: 'Bob Smith', email: 'bob@example.com', password: 'hashed_password_2' },
	{ id: 3, name: 'Carol White', email: 'carol@example.com', password: 'hashed_password_3' },
]

export const CATEGORIES = [
	{ id: 1, name: 'Security' },
	{ id: 2, name: 'Cloud' },
]

export const COURSES = [
	{ id: 1, title: 'Ethical Hacking Fundamentals', description: 'Learn the core concepts of ethical hacking and penetration testing.', instructor: 'John Doe', thumbnail: 'https://picsum.photos/seed/ethical-hacking/600/400', categoryId: 1, length: 36000 },
	{ id: 2, title: 'Network Defense & Hardening', description: 'Master firewall configuration and network hardening techniques.', instructor: 'Jane Smith', thumbnail: 'https://picsum.photos/seed/network-defense/600/400', categoryId: 1, length: 30600 },
	{ id: 3, title: 'Cloud Security Architecture', description: 'Secure cloud infrastructure across AWS and Azure environments.', instructor: 'Carlos Rivera', thumbnail: 'https://picsum.photos/seed/cloud-security/600/400', categoryId: 2, length: 43200 },
]

export const MODULES = [
	{ id: 1, title: 'Introduction to Penetration Testing', courseId: 1 },
	{ id: 2, title: 'Network Scanning & Enumeration', courseId: 1 },
	{ id: 3, title: 'Firewall Configuration Basics', courseId: 2 },
	{ id: 4, title: 'Intrusion Detection Systems', courseId: 2 },
	{ id: 5, title: 'AWS Security Fundamentals', courseId: 3 },
	{ id: 6, title: 'Azure Identity & Access Management', courseId: 3 },
]

export const LESSONS = [
	// Intro to Penetration Testing
	{ id: 1, title: 'What is Ethical Hacking?', length: 750, moduleId: 1 },
	{ id: 2, title: 'Setting Up Your Lab Environment', length: 1080, moduleId: 1 },
	{ id: 3, title: 'Legal & Ethical Considerations', length: 615, moduleId: 1 },
	// Network Scanning & Enumeration
	{ id: 4, title: 'Using Nmap for Network Discovery', length: 1200, moduleId: 2 },
	{ id: 5, title: 'Service & Version Detection', length: 945, moduleId: 2 },
	// Firewall Configuration Basics
	{ id: 6, title: 'Understanding Firewall Rules', length: 840, moduleId: 3 },
	{ id: 7, title: 'Configuring iptables', length: 1350, moduleId: 3 },
	// Intrusion Detection Systems
	{ id: 8, title: 'Intro to Snort', length: 960, moduleId: 4 },
	{ id: 9, title: 'Writing Custom IDS Rules', length: 1160, moduleId: 4 },
	// AWS Security Fundamentals
	{ id: 10, title: 'IAM Roles & Policies', length: 1020, moduleId: 5 },
	{ id: 11, title: 'S3 Bucket Security', length: 825, moduleId: 5 },
	// Azure IAM
	{ id: 12, title: 'Azure Active Directory Basics', length: 900, moduleId: 6 },
	{ id: 13, title: 'Conditional Access Policies', length: 1270, moduleId: 6 },
]

export const USERS_TO_COURSES = [
	{ userId: 1, courseId: 1 },
	{ userId: 1, courseId: 2 },
	{ userId: 1, courseId: 3 },
	{ userId: 2, courseId: 1 },
	{ userId: 2, courseId: 3 },
	{ userId: 3, courseId: 2 },
]

export const USERS_TO_LESSONS = [
	{ userId: 1, lessonId: 1, completed: true },
	{ userId: 1, lessonId: 2, completed: true },
	{ userId: 1, lessonId: 3, completed: false },
	{ userId: 2, lessonId: 1, completed: true },
	{ userId: 2, lessonId: 4, completed: true },
	{ userId: 2, lessonId: 5, completed: false },
	{ userId: 3, lessonId: 1, completed: false },
]