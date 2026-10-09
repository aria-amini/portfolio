import {
	CalendarDotsIcon,
	GithubLogoIcon,
	LinkedinLogoIcon,
} from '@phosphor-icons/react/dist/ssr'

import { ButtonLink, RouterButtonLink } from '@/components/button-link'
import { NycSkyline } from '@/components/nyc-skyline'
import { profile } from '@/lib/profile'

export function SiteHeader() {
	return (
		<header className="flex h-20 items-center justify-end border-b">
			<NycSkyline className="mr-auto hidden self-stretch sm:flex" />
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
				<RouterButtonLink
					size="sm"
					to="/"
					search={(prev) => ({ ...prev, dialog: 'schedule' })}
				>
					<CalendarDotsIcon data-icon="inline-start" />
					Book a call
				</RouterButtonLink>
			</nav>
		</header>
	)
}
