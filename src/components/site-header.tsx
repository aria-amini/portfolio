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
				{profile.name}
			</a>
			<nav aria-label="Main navigation" className="flex items-center gap-2">
				<ButtonLink variant="ghost" size="sm" href="#work">
					Work
				</ButtonLink>
				<RouterButtonLink
					variant="ghost"
					size="sm"
					to="/"
					search={{ dialog: 'resume' }}
				>
					Résumé
				</RouterButtonLink>
				<RouterButtonLink size="sm" to="/" search={{ dialog: 'contact' }}>
					Contact
				</RouterButtonLink>
			</nav>
		</header>
	)
}
