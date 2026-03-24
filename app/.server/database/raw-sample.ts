export const USERS = [
	{
		id: 1,
		name: 'Alice Johnson',
		email: 'alice@example.com',
		password:
			'$2b$10$L0JZezH14E1wHCrJykgFJey03QU2P1ysVfpIRWIbv5gm3Iar7/EL.',
		role: 'learner',
	},
	{
		id: 2,
		name: 'Bob Smith',
		email: 'bob@example.com',
		password: 'hashed_password_2',
		role: 'learner',
	},
	{
		id: 3,
		name: 'Carol White',
		email: 'carol@example.com',
		password: 'hashed_password_3',
		role: 'learner',
	},
	{
		id: 4,
		name: 'Staff Admin',
		email: 'staff@example.com',
		password:
			'$2b$10$L0JZezH14E1wHCrJykgFJey03QU2P1ysVfpIRWIbv5gm3Iar7/EL.',
		role: 'staff',
	},
]

export const CATEGORIES = [
	{ id: 1, name: 'Security' },
	{ id: 2, name: 'Cloud' },
]

export const COURSES = [
	{
		id: 1,
		title: 'Ethical Hacking Fundamentals',
		description:
			'Learn the core concepts of ethical hacking and penetration testing.',
		instructor: 'John Doe',
		thumbnail: 'https://picsum.photos/seed/ethical-hacking/600/400',
		categoryId: 1,
		length: 36000,
	},
	{
		id: 2,
		title: 'Network Defense & Hardening',
		description:
			'Master firewall configuration and network hardening techniques.',
		instructor: 'Jane Smith',
		thumbnail: 'https://picsum.photos/seed/network-defense/600/400',
		categoryId: 1,
		length: 30600,
	},
	{
		id: 3,
		title: 'Cloud Security Architecture',
		description:
			'Secure cloud infrastructure across AWS and Azure environments.',
		instructor: 'Carlos Rivera',
		thumbnail: 'https://picsum.photos/seed/cloud-security/600/400',
		categoryId: 2,
		length: 43200,
	},
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
	{
		id: 1,
		title: 'What is Ethical Hacking?',
		length: 750,
		moduleId: 1,
		contentMd: `# What is Ethical Hacking?\n\nEthical hacking is the authorized practice of testing systems, networks, and applications to discover weaknesses before attackers do.\n\n## What you should understand\n\n- Why authorization matters\n- The difference between ethical hackers and malicious attackers\n- The role of reporting and remediation\n\n## Core idea\n\nA security assessment only creates value when the findings are documented clearly and handed back to the team that owns the system.`,
	},
	{
		id: 2,
		title: 'Setting Up Your Lab Environment',
		length: 1080,
		moduleId: 1,
		contentMd: `# Setting Up Your Lab Environment\n\nA safe lab lets you practice without risking production systems.\n\n## Recommended setup\n\n- A virtualization tool\n- An attacker machine\n- A target machine\n- A note-taking workflow for commands and findings\n\n## Before you begin\n\nMake sure snapshots are enabled so you can reset your environment after each exercise.`,
	},
	{
		id: 3,
		title: 'Legal & Ethical Considerations',
		length: 615,
		moduleId: 1,
		contentMd: `# Legal and Ethical Considerations\n\nAlways get explicit permission before testing any environment.\n\n## Rules to keep in mind\n\n- Stay within scope\n- Respect data privacy\n- Avoid destructive testing unless it is approved\n- Report findings responsibly\n\n> A good security practitioner protects trust as much as infrastructure.`,
	},
	// Network Scanning & Enumeration
	{
		id: 4,
		title: 'Using Nmap for Network Discovery',
		length: 1200,
		moduleId: 2,
		contentMd: `# Using Nmap for Network Discovery\n\nNmap helps identify reachable hosts and exposed services.\n\n## Common workflow\n\n1. Identify live hosts\n2. Scan open ports\n3. Collect service banners\n4. Document the results\n\n## Example focus areas\n\n- TCP ports\n- UDP ports\n- Host discovery methods\n- Timing and rate considerations`,
	},
	{
		id: 5,
		title: 'Service & Version Detection',
		length: 945,
		moduleId: 2,
		contentMd: `# Service and Version Detection\n\nKnowing that a port is open is only the start. Version detection helps map a service to potential risk.\n\n## Why it matters\n\n- It helps verify what is actually running\n- It provides context for vulnerability research\n- It improves the quality of your report\n\n## Output to capture\n\n- Port number\n- Service name\n- Version string\n- Confidence or uncertainty notes`,
	},
	// Firewall Configuration Basics
	{
		id: 6,
		title: 'Understanding Firewall Rules',
		length: 840,
		moduleId: 3,
		contentMd: `# Understanding Firewall Rules\n\nFirewall rules define what traffic is allowed, denied, or logged.\n\n## Key concepts\n\n- Source and destination\n- Protocol and port\n- Direction of traffic\n- Default deny vs default allow\n\nA readable rule set is easier to maintain and far safer to audit.`,
	},
	{
		id: 7,
		title: 'Configuring iptables',
		length: 1350,
		moduleId: 3,
		contentMd: `# Configuring iptables\n\niptables is a rule-based packet filtering framework commonly used on Linux systems.\n\n## Typical tasks\n\n- List current rules\n- Add allow rules\n- Block unwanted traffic\n- Save and verify the final policy\n\n\`\`\`bash\niptables -L -n -v\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\n\`\`\``,
	},
	// Intrusion Detection Systems
	{
		id: 8,
		title: 'Intro to Snort',
		length: 960,
		moduleId: 4,
		contentMd: `# Intro to Snort\n\nSnort is an intrusion detection and prevention platform used to inspect traffic for suspicious patterns.\n\n## What to learn first\n\n- Traffic inspection basics\n- Rule matching flow\n- Alerting and logging\n- Tuning for noise reduction`,
	},
	{
		id: 9,
		title: 'Writing Custom IDS Rules',
		length: 1160,
		moduleId: 4,
		contentMd: `# Writing Custom IDS Rules\n\nCustom rules help detect patterns that matter to your own environment.\n\n## Good rule-writing habits\n\n- Start simple\n- Test against known traffic\n- Avoid noisy signatures\n- Add comments for future maintainers`,
	},
	// AWS Security Fundamentals
	{
		id: 10,
		title: 'IAM Roles & Policies',
		length: 1020,
		moduleId: 5,
		contentMd: `# IAM Roles and Policies\n\nIdentity and access management is the control plane for cloud permissions.\n\n## Design principles\n\n- Least privilege\n- Clear role boundaries\n- Short-lived credentials where possible\n- Review and removal of unused access`,
	},
	{
		id: 11,
		title: 'S3 Bucket Security',
		length: 825,
		moduleId: 5,
		contentMd: `# S3 Bucket Security\n\nStorage security depends on both bucket configuration and identity policy design.\n\n## Review checklist\n\n- Public access settings\n- Bucket policy scope\n- Encryption at rest\n- Logging and monitoring`,
	},
	// Azure IAM
	{
		id: 12,
		title: 'Azure Active Directory Basics',
		length: 900,
		moduleId: 6,
		contentMd: `# Azure Active Directory Basics\n\nIdentity is central to access control in modern cloud platforms.\n\n## Focus points\n\n- Users and groups\n- Application identities\n- Role assignments\n- Directory security posture`,
	},
	{
		id: 13,
		title: 'Conditional Access Policies',
		length: 1270,
		moduleId: 6,
		contentMd: `# Conditional Access Policies\n\nConditional access applies rules to authentication decisions based on user, device, app, or location context.\n\n## Effective policy design\n\n- Start in report-only mode\n- Group similar scenarios together\n- Minimize user friction\n- Measure the impact before enforcing broadly`,
	},
]

export const USERS_TO_COURSES = [
	{ userId: 1, courseId: 1 },
	{ userId: 1, courseId: 2 },
	{ userId: 1, courseId: 3 },
	{ userId: 2, courseId: 1 },
	{ userId: 2, courseId: 3 },
	{ userId: 3, courseId: 2 },
]
