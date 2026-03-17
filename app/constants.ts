import type { Course } from '~/types'

export const COURSES: Course[] = [
	{
		id: '1',
		title: 'Ethical Hacking Fundamentals',
		description:
			'Learn the basics of ethical hacking, penetration testing, and network security.',
		instructor: 'Marcus Vane',
		thumbnail: 'https://picsum.photos/seed/hacking/800/600',
		progress: 45,
		category: 'Offensive Security',
		duration: '15h 30m',
		lessonsCount: 28,
	},
	{
		id: '2',
		title: 'Network Defense & Hardening',
		description:
			'Master the art of securing networks, firewalls, and intrusion detection systems.',
		instructor: 'Elena Rodriguez',
		thumbnail: 'https://picsum.photos/200/300',
		progress: 12,
		category: 'Defensive Security',
		duration: '20h 45m',
		lessonsCount: 35,
	},
	{
		id: '3',
		title: 'Digital Forensics & Incident Response',
		description:
			'Learn how to investigate cybercrimes and respond to security breaches.',
		instructor: 'James Sterling',
		thumbnail: 'https://picsum.photos/seed/forensics/800/600',
		progress: 0,
		category: 'Forensics',
		duration: '22h 15m',
		lessonsCount: 40,
	},
	{
		id: '4',
		title: 'Cloud Security Architecture',
		description:
			'Secure your cloud infrastructure across AWS, Azure, and Google Cloud.',
		instructor: 'Sarah Jenkins',
		thumbnail: 'https://picsum.photos/seed/cloud/800/600',
		progress: 85,
		category: 'Cloud Security',
		duration: '12h 00m',
		lessonsCount: 18,
	},
]

export const MODULES = [
	{
		id: 'm1',
		title: 'Introduction to Cyber Defense',
		lessons: [
			{
				id: 'l1',
				title: 'The Cyber Threat Landscape',
				duration: '5:00',
				completed: true,
				type: 'video',
			},
			{
				id: 'l2',
				title: 'Setting up your Kali Linux Lab',
				duration: '12:30',
				completed: true,
				type: 'video',
			},
			{
				id: 'l3',
				title: 'Security Principles (CIA Triad)',
				duration: '15:45',
				completed: false,
				type: 'video',
			},
		],
	},
	{
		id: 'm2',
		title: 'Network Security Fundamentals',
		lessons: [
			{
				id: 'l4',
				title: 'TCP/IP Model & Protocol Security',
				duration: '20:00',
				completed: false,
				type: 'video',
			},
			{
				id: 'l5',
				title: 'Firewalls, IDS, and IPS',
				duration: '25:15',
				completed: false,
				type: 'video',
			},
			{
				id: 'l6',
				title: 'Quiz: Network Security',
				duration: '10:00',
				completed: false,
				type: 'quiz',
			},
		],
	},
	{
		id: 'm3',
		title: 'Advanced Penetration Testing',
		lessons: [
			{
				id: 'l7',
				title: 'Exploitation Frameworks (Metasploit)',
				duration: '18:30',
				completed: false,
				type: 'video',
			},
			{
				id: 'l8',
				title: 'Post-Exploitation & Privilege Escalation',
				duration: '30:00',
				completed: false,
				type: 'video',
			},
		],
	},
]
