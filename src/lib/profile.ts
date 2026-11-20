import amex from '@/assets/companies/amex.svg'
import cirrus from '@/assets/companies/cirrus.png'
import microsoft from '@/assets/companies/microsoft.svg'
import projectPreview from '@/assets/imdbgraph-game-of-thrones.png'

interface Profile {
	name: string
	title: string
	/** Short pitch for search and social previews. */
	intro: string
	about: string
	focus: string[]
	email: string
	github: string
	linkedin: string
	resumeUrl: string
	resumePreviewUrl: string
	bookingUrl: string | null
	callMinutes: number
}

export const profile: Profile = {
	name: 'Aria Amini',
	title: 'Senior AI/Infra Engineer',
	intro:
		'AI and infra engineer in NYC who loves CS and math, coding since I was 16. Open to remote or hybrid roles with fast-moving teams.',
	about:
		"I'm a passionate dev who loves CS and math, and I've been coding since I was 16. Originally from New Orleans, I moved to NYC four years ago. I'm looking for remote or hybrid roles with fast-moving, passionate teams.",
	focus: [
		'AI',
		'Infra / Devops',
		'Distributed systems',
		'Full Stack - React/TS',
	],
	email: 'aamini1024@gmail.com',
	github: 'https://github.com/aria-amini',
	linkedin: 'https://linkedin.com/in/aria-amini',
	resumeUrl: '/aria-amini-resume.pdf',
	resumePreviewUrl: '/aria-amini-resume.svg',
	// Set to a Cal.com or Calendly URL to embed live booking in the booking dialog.
	bookingUrl: 'https://cal.com/aria-amini/15min',
	callMinutes: 15,
}

export const yearsOfExperience = 8

export const jobs = [
	{
		company: 'Microsoft · Azure',
		role: 'Software Engineer II',
		period: 'Dec 2021 – Oct 2026',
		logo: microsoft,
		highlight:
			'Sole owner of a Python/FastAPI service that safely runs Copilot-generated infrastructure code.',
	},
	{
		company: 'Cirrus Logic',
		role: 'Software Engineer',
		period: 'Jan 2020 – Dec 2021',
		logo: cirrus,
		highlight:
			'Built Java tools that hardware engineers used to debug audio chips shipped in iPhones and AirPods.',
	},
	{
		company: 'American Express',
		role: 'Software Engineer',
		period: 'Jul 2018 – Dec 2019',
		logo: amex,
		highlight:
			'Co-built an automated card processing pipeline that replaced a manual legacy application.',
	},
] as const

export const project = {
	name: 'imdbgraph.org',
	summary: 'Visualize IMDb episode ratings for TV shows. ~2K monthly visits.',
	liveUrl: 'https://www.imdbgraph.org',
	exampleUrl: 'https://www.imdbgraph.org/ratings/tt0944947',
	sourceUrl: 'https://github.com/aria-amini/imdbgraph',
	preview: projectPreview,
	previewAlt:
		'imdbgraph.org displays Game of Thrones episode ratings as color-coded blocks grouped by season.',
} as const

export const dialogs = ['resume', 'book'] as const

export type DialogName = (typeof dialogs)[number]
