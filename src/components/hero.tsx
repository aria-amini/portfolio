import { CalendarDotsIcon, FileTextIcon } from '@phosphor-icons/react/dist/ssr'

import { RouterButtonLink } from '@/components/button-link'
import { CopyEmailButton } from '@/components/copy-email-button'
import { ExperiencePanel } from '@/components/experience-panel'
import { profile } from '@/lib/profile'

export function Hero() {
	return (
		<section
			aria-labelledby="intro-title"
			className="grid gap-10 py-12 lg:grid-cols-2 lg:gap-16"
		>
			<div>
				<div className="mb-6 flex items-center gap-5">
					<img
						src="/aria-amini-192.jpg"
						alt=""
						width={96}
						height={96}
						fetchPriority="high"
						className="size-24 shrink-0 rounded-full border object-cover"
					/>
					<h1 id="intro-title" className="text-4xl sm:text-5xl">
						{profile.name}
						<em className="text-primary mt-2 block font-serif text-3xl font-normal">
							{profile.title}
						</em>
					</h1>
				</div>
				<p className="text-muted-foreground max-w-md leading-7">
					{profile.intro}
				</p>
				<div className="mt-6 flex flex-wrap gap-3">
					<RouterButtonLink
						size="lg"
						className="h-11"
						to="/"
						search={{ dialog: 'schedule' }}
					>
						<CalendarDotsIcon data-icon="inline-start" />
						Book a {profile.callMinutes}-min call
					</RouterButtonLink>
					<RouterButtonLink
						size="lg"
						variant="outline"
						className="h-11"
						to="/"
						search={{ dialog: 'resume' }}
					>
						<FileTextIcon data-icon="inline-start" />
						View resume
					</RouterButtonLink>
				</div>
				<div className="mt-3 flex flex-wrap items-center gap-x-4 text-sm">
					<span>{profile.email}</span>
					<CopyEmailButton />
				</div>
			</div>
			<ExperiencePanel />
		</section>
	)
}
