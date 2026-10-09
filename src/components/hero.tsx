import { CalendarDotsIcon, FileTextIcon } from '@phosphor-icons/react/dist/ssr'
import { cn } from 'cn'

import { DitherPortrait } from '@/components/ambient/dither-portrait'
import { RouterButtonLink } from '@/components/button-link'
import { CopyEmail } from '@/components/copy-email'
import { ExperiencePanel } from '@/components/experience-panel'
import { Badge } from '@/components/ui/badge'
import { profile } from '@/lib/profile'

const portraitSrc = '/aria-amini-192.jpg'

function Avatar() {
	return (
		<div className="bg-secondary ink-shadow size-20 shrink-0 -rotate-3 overflow-hidden rounded-full border sm:size-28">
			<DitherPortrait src={portraitSrc} />
		</div>
	)
}

function TitleStamp({ className }: { className?: string }) {
	return (
		<p
			className={cn(
				'bg-secondary text-secondary-foreground ink-shadow stamp-in inline-block -rotate-2 rounded-md border px-3 py-1.5 text-base font-bold sm:text-lg',
				className,
			)}
		>
			{profile.title}
		</p>
	)
}

function NameHeading() {
	return (
		<h1
			id="intro-title"
			className="misprint ink-roll text-4xl leading-none font-extrabold tracking-tight whitespace-nowrap sm:text-6xl"
		>
			{profile.name}
		</h1>
	)
}

export function Hero() {
	return (
		<section
			aria-labelledby="intro-title"
			className="grid gap-10 py-12 lg:grid-cols-2 lg:gap-16"
		>
			<div>
				<div className="mb-6 flex items-center gap-4 sm:gap-6">
					<Avatar />
					<div className="min-w-0">
						<NameHeading />
						<TitleStamp className="mt-4" />
					</div>
				</div>
				<p className="text-muted-foreground max-w-md leading-7">
					{profile.about}
				</p>
				<ul aria-label="Focus areas" className="mt-4 flex flex-wrap gap-2">
					{profile.focus.map((area) => (
						<li key={area}>
							<Badge variant="outline">{area}</Badge>
						</li>
					))}
				</ul>
				<div className="mt-6 flex flex-wrap gap-3">
					<RouterButtonLink
						size="lg"
						className="h-11"
						to="/"
						search={(prev) => ({ ...prev, dialog: 'schedule' })}
					>
						<CalendarDotsIcon data-icon="inline-start" />
						Book a {profile.callMinutes}-min call
					</RouterButtonLink>
					<RouterButtonLink
						size="lg"
						variant="outline"
						className="h-11"
						to="/"
						search={(prev) => ({ ...prev, dialog: 'resume' })}
					>
						<FileTextIcon data-icon="inline-start" />
						View resume
					</RouterButtonLink>
				</div>
				<CopyEmail className="mt-3" />
			</div>
			<ExperiencePanel />
		</section>
	)
}
