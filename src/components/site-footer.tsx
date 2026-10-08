import { ButtonLink } from '@/components/button-link'
import { profile } from '@/lib/profile'

export function SiteFooter() {
	return (
		<footer className="text-muted-foreground flex flex-wrap items-center justify-between gap-4 border-t py-6 text-sm">
			<span>
				{profile.name} © {new Date().getFullYear()}
			</span>
			<div className="flex gap-1">
				<ButtonLink variant="link" size="sm" href={profile.github}>
					GitHub ↗
				</ButtonLink>
				<ButtonLink variant="link" size="sm" href={profile.linkedin}>
					LinkedIn ↗
				</ButtonLink>
				<ButtonLink variant="link" size="sm" href={`mailto:${profile.email}`}>
					Email ↗
				</ButtonLink>
			</div>
		</footer>
	)
}
