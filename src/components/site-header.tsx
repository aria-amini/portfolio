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
		<header className="bg-background sticky top-0 z-20 border-b">
			<div className="mx-auto flex h-20 w-full max-w-5xl items-center justify-end px-6">
				<NycSkyline className="mr-auto self-stretch" />
				<nav
					aria-label="Main navigation"
					className="flex items-center gap-1 sm:gap-2"
				>
					<ButtonLink
						variant="ghost"
						className="size-11 md:w-auto md:px-3"
						href={profile.github}
					>
						<GithubLogoIcon className="size-5" />
						<span className="sr-only md:not-sr-only">GitHub</span>
					</ButtonLink>
					<ButtonLink
						variant="ghost"
						className="size-11 md:w-auto md:px-3"
						href={profile.linkedin}
					>
						<LinkedinLogoIcon className="size-5" />
						<span className="sr-only md:not-sr-only">LinkedIn</span>
					</ButtonLink>
					<RouterButtonLink
						size="sm"
						className="h-11"
						to="/"
						search={(prev) => ({ ...prev, dialog: 'book' })}
					>
						<CalendarDotsIcon data-icon="inline-start" />
						Book a call
					</RouterButtonLink>
				</nav>
			</div>
		</header>
	)
}
