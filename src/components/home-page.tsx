import { Hero } from '@/components/hero'
import { SelectedWork } from '@/components/selected-work'
import { SiteDialogs } from '@/components/site-dialogs'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import type { DialogName } from '@/lib/profile'

export function HomePage({ dialog }: { dialog: DialogName | undefined }) {
	return (
		<div className="mx-auto w-full max-w-5xl px-6">
			<SiteHeader />
			<main id="main">
				<Hero />
				<SelectedWork />
			</main>
			<SiteFooter />
			<SiteDialogs open={dialog} />
		</div>
	)
}
