import { CalendarDotsIcon, FileTextIcon } from '@phosphor-icons/react/dist/ssr'
import { cn } from 'cn'

import { RouterButtonLink } from '@/components/button-link'
import { CopyEmail } from '@/components/copy-email'
import { ExperiencePanel } from '@/components/experience-panel'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { profile } from '@/lib/profile'

function Avatar() {
	return (
		<div className="bg-secondary ink-shadow size-20 shrink-0 -rotate-3 overflow-hidden rounded-full border @md:size-28">
			<img
				src="/aria-amini-192.jpg"
				alt=""
				width={192}
				height={192}
				fetchPriority="high"
				className="size-full object-cover"
			/>
		</div>
	)
}

function RoleLabel({ className }: { className?: string }) {
	return (
		<p
			className={cn(
				'text-muted-foreground text-base font-medium @md:text-lg',
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
			className="ink-roll text-4xl leading-none font-extrabold tracking-tight whitespace-nowrap @md:text-6xl"
		>
			{profile.name}
		</h1>
	)
}

export function Hero() {
	return (
		<section
			aria-labelledby="intro-title"
			className="grid gap-10 py-12 md:grid-cols-2 lg:gap-16"
		>
			{/* Sized by its own width, so the name and portrait fit a half-width column. */}
			<div className="@container flex flex-col">
				<div className="mb-6 flex items-center gap-4 @md:gap-6">
					<Avatar />
					<div className="min-w-0">
						<NameHeading />
						<RoleLabel className="mt-3" />
					</div>
				</div>
				<p className="text-muted-foreground max-w-md leading-7">
					{profile.about}
				</p>
				<ul aria-label="Focus areas" className="mt-4 flex flex-wrap gap-2">
					{profile.focus.map((area) => (
						<li key={area}>
							<Badge variant="muted">{area}</Badge>
						</li>
					))}
				</ul>
				<div className="mt-6 flex flex-wrap gap-3">
					<RouterButtonLink
						size="xl"
						to="/"
						search={(prev) => ({ ...prev, dialog: 'book' })}
					>
						<CalendarDotsIcon data-icon="inline-start" />
						Book a {profile.callMinutes}-min call
					</RouterButtonLink>
					<RouterButtonLink
						size="xl"
						variant="outline"
						to="/"
						search={(prev) => ({ ...prev, dialog: 'resume' })}
					>
						<FileTextIcon data-icon="inline-start" />
						View resume
					</RouterButtonLink>
				</div>
				<CopyEmail className="mt-3" />
			</div>
			<Separator className="md:hidden" />
			<ExperiencePanel />
		</section>
	)
}
