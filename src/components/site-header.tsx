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
					className="size-11 sm:w-auto sm:px-3"
					href={profile.github}
				>
					<GithubLogoIcon className="size-5" />
					<span className="sr-only sm:not-sr-only">GitHub</span>
				</ButtonLink>
				<ButtonLink
					variant="ghost"
					className="size-11 sm:w-auto sm:px-3"
					href={profile.linkedin}
				>
					<LinkedinLogoIcon className="size-5" />
					<span className="sr-only sm:not-sr-only">LinkedIn</span>
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
