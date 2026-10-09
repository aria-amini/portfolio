import { Hero } from '@/components/hero'
import { SelectedWork } from '@/components/selected-work'
import { SiteDialogs } from '@/components/site-dialogs'
import { SiteHeader } from '@/components/site-header'
import { Separator } from '@/components/ui/separator'
import type { DialogName } from '@/lib/profile'

export function HomePage({ dialog }: { dialog: DialogName | undefined }) {
	return (
		<div className="mx-auto w-full max-w-5xl px-6 pb-20">
			<SiteHeader />
			<main id="main">
				<Hero />
				<Separator />
				<SelectedWork />
			</main>
			<SiteDialogs open={dialog} />
		</div>
	)
}
