interface Profile {
	name: string
	title: string
	intro: string
	email: string
	github: string
	linkedin: string
	resumeUrl: string
	bookingUrl: string | null
	callMinutes: number
}

export const profile: Profile = {
	name: 'Aria Amini',
	title: 'AI & Infra Engineer',
	intro:
		'I build AI services, cloud infrastructure, and the tools that connect them.',
	email: 'aamini1024@gmail.com',
	github: 'https://github.com/aamini11',
	linkedin: 'https://linkedin.com/in/aria-amini',
	resumeUrl: '/Aria%20Amini%20-%20Software%20Engineer%2C%20Sept%202026.pdf',
	// Set to a Cal.com or Calendly URL to embed live booking in the schedule dialog.
	bookingUrl: null,
	callMinutes: 30,
}

export const jobs = [
	{
		company: 'Microsoft · Azure',
		role: 'Software Engineer II',
		period: 'Dec 2021 – Sep 2026',
		logo: '/companies/microsoft.svg',
	},
	{
		company: 'Cirrus Logic',
		role: 'Software Engineer',
		period: 'Jan 2020 – Dec 2021',
		logo: '/companies/cirrus.png',
	},
	{
		company: 'American Express',
		role: 'Software Engineer',
		period: 'Jul 2018 – Dec 2019',
		logo: '/companies/amex.svg',
	},
] as const

export const project = {
	name: 'IMDbGraph',
	kind: 'Independent project / Data visualization',
	summary: 'Visualize IMDb episode ratings for TV shows. ~2K monthly visits.',
	stack: ['React & TypeScript', 'TanStack Start', 'PostgreSQL & Drizzle'],
	liveUrl: 'https://www.imdbgraph.org',
	exampleUrl: 'https://www.imdbgraph.org/ratings/tt0903747',
	sourceUrl: 'https://github.com/aria-amini/imdbgraph',
	preview: '/imdbgraph-preview.png',
	previewAlt:
		'IMDbGraph displays Breaking Bad episode ratings as color-coded blocks grouped by season.',
} as const

export const dialogs = ['resume', 'contact', 'schedule'] as const

export type DialogName = (typeof dialogs)[number]

export function scheduleCallUrl() {
	const params = new URLSearchParams({
		action: 'TEMPLATE',
		text: `${profile.callMinutes}-minute intro call with ${profile.name}`,
		details: 'Intro call. Pick any time that works for you.',
		add: profile.email,
	})

	return `https://calendar.google.com/calendar/render?${params.toString()}`
}
