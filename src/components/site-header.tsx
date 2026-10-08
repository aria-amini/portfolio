import {
	CalendarDotsIcon,
	GithubLogoIcon,
	LinkedinLogoIcon,
} from '@phosphor-icons/react/dist/ssr'

import { ButtonLink, RouterButtonLink } from '@/components/button-link'
import { profile } from '@/lib/profile'

export function SiteHeader() {
	return (
		<header className="flex h-20 items-center justify-between border-b">
			<a href="#main" className="flex items-center gap-3 font-bold">
				<span
					aria-hidden="true"
					className="bg-foreground text-background grid size-8 place-items-center font-serif text-xl italic"
				>
					a.
				</span>
				<span className="sr-only sm:not-sr-only">{profile.name}</span>
			</a>
			<nav aria-label="Main navigation" className="flex items-center gap-2">
				<ButtonLink
					variant="ghost"
					size="icon"
					className="size-11"
					href={profile.github}
					aria-label="GitHub"
				>
					<GithubLogoIcon className="size-5" />
				</ButtonLink>
				<ButtonLink
					variant="ghost"
					size="icon"
					className="size-11"
					href={profile.linkedin}
					aria-label="LinkedIn"
				>
					<LinkedinLogoIcon className="size-5" />
				</ButtonLink>
				<RouterButtonLink size="sm" to="/" search={{ dialog: 'schedule' }}>
					<CalendarDotsIcon data-icon="inline-start" />
					Book a call
				</RouterButtonLink>
			</nav>
		</header>
	)
}
