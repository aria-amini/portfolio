import { Hero } from '@/components/hero'
import { SelectedWork } from '@/components/selected-work'
import { SiteDialogs } from '@/components/site-dialogs'
import { SiteHeader } from '@/components/site-header'
import { Separator } from '@/components/ui/separator'
import type { DialogName } from '@/lib/profile'

export function HomePage({ dialog }: { dialog: DialogName | undefined }) {
	return (
		<>
			<a
				href="#main"
				className="bg-card text-foreground focus-visible:ring-ring fixed top-3 left-6 z-50 -translate-y-24 rounded-lg border px-4 py-3 font-semibold focus:translate-y-0 focus-visible:ring-3"
			>
				Skip to content
			</a>
			<SiteHeader />
			<main
				id="main"
				tabIndex={-1}
				className="mx-auto w-full max-w-5xl px-6 pb-20"
			>
				<Hero />
				<Separator />
				<SelectedWork />
			</main>
			<SiteDialogs open={dialog} />
		</>
	)
}
