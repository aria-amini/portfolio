interface Profile {
	name: string
	title: string
	intro: string
	email: string
	github: string
	linkedin: string
	resumeUrl: string
	resumeDocxUrl: string
	bookingUrl: string | null
	callMinutes: number
}

export const profile: Profile = {
	name: 'Aria Amini',
	title: 'Senior AI/Infra Engineer',
	intro:
		'I build AI services, cloud infrastructure, and the tools that connect them.',
	email: 'aamini1024@gmail.com',
	github: 'https://github.com/aamini11',
	linkedin: 'https://linkedin.com/in/aria-amini',
	resumeUrl: '/aria-amini-resume.pdf',
	resumeDocxUrl: '/aria-amini-resume.docx',
	// Set to a Cal.com or Calendly URL to embed live booking in the schedule dialog.
	bookingUrl: 'https://cal.com/aria-amini/30min',
	callMinutes: 30,
}

export const yearsOfExperience = 8

export const jobs = [
	{
		company: 'Microsoft · Azure',
		role: 'Software Engineer II',
		period: 'Dec 2021 – Sep 2026',
		logo: '/companies/microsoft.svg',
		highlight:
			'Owned a Python/FastAPI service that safely executes Copilot-generated infrastructure code.',
	},
	{
		company: 'Cirrus Logic',
		role: 'Software Engineer',
		period: 'Jan 2020 – Dec 2021',
		logo: '/companies/cirrus.png',
		highlight:
			'Developed Java applications that hardware engineers used to debug chips sold to Apple.',
	},
	{
		company: 'American Express',
		role: 'Software Engineer',
		period: 'Jul 2018 – Dec 2019',
		logo: '/companies/amex.svg',
		highlight:
			'Co-developed a fully automated Java/Spring credit card processing pipeline.',
	},
] as const

export const project = {
	name: 'imdbgraph.org',
	summary: 'Visualize IMDb episode ratings for TV shows. ~2K monthly visits.',
	liveUrl: 'https://www.imdbgraph.org',
	exampleUrl: 'https://www.imdbgraph.org/ratings/tt0903747',
	sourceUrl: 'https://github.com/aria-amini/imdbgraph',
	preview: '/imdbgraph-preview.png',
	previewAlt:
		'imdbgraph.org displays Breaking Bad episode ratings as color-coded blocks grouped by season.',
} as const

export const dialogs = ['resume', 'schedule'] as const

export type DialogName = (typeof dialogs)[number]

export function scheduleEmailHref() {
	const subject = `${profile.callMinutes}-minute intro call`
	const body = `Hi Aria,\n\nI would like to set up a ${profile.callMinutes}-minute call. These times work for me:\n\n- \n- \n- \n\nRole and company:\n`

	return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
