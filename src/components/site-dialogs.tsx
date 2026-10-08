import {
	ArrowUpRightIcon,
	DownloadSimpleIcon,
} from '@phosphor-icons/react/dist/ssr'
import { useNavigate } from '@tanstack/react-router'

import { ButtonLink, RouterButtonLink } from '@/components/button-link'
import { ContactForm } from '@/components/contact-form'
import { CopyEmailButton } from '@/components/copy-email-button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { type DialogName, profile, scheduleCallUrl } from '@/lib/profile'

export function SiteDialogs({ open }: { open: DialogName | undefined }) {
	const navigate = useNavigate({ from: '/' })

	function onOpenChange(name: DialogName) {
		return (isOpen: boolean) => {
			if (!isOpen && open === name) {
				void navigate({ search: {}, resetScroll: false })
			}
		}
	}

	return (
		<>
			<Dialog open={open === 'resume'} onOpenChange={onOpenChange('resume')}>
				<DialogContent className="sm:max-w-3xl">
					<DialogHeader>
						<DialogTitle>Résumé</DialogTitle>
						<DialogDescription>
							Download the PDF or read it here.
						</DialogDescription>
					</DialogHeader>
					<ButtonLink href={profile.resumeUrl} download={true}>
						Download the PDF <DownloadSimpleIcon />
					</ButtonLink>
					<object
						data={profile.resumeUrl}
						type="application/pdf"
						aria-label={`${profile.name} résumé`}
						className="h-[60vh] w-full rounded-lg border"
					>
						<a href={profile.resumeUrl}>Open the résumé directly ↗</a>
					</object>
				</DialogContent>
			</Dialog>

			<Dialog open={open === 'contact'} onOpenChange={onOpenChange('contact')}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Let’s connect.</DialogTitle>
						<DialogDescription>
							Have a role or a technical problem in mind? Email me, send a
							message, or book a short call.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-wrap items-center gap-2">
						<ButtonLink
							href={`mailto:${profile.email}`}
							className="tracking-normal normal-case"
						>
							{profile.email} <ArrowUpRightIcon />
						</ButtonLink>
						<CopyEmailButton />
					</div>
					<RouterButtonLink
						variant="outline"
						to="/"
						search={{ dialog: 'schedule' }}
					>
						Schedule a {profile.callMinutes}-minute call <ArrowUpRightIcon />
					</RouterButtonLink>
					<Separator />
					<ContactForm />
				</DialogContent>
			</Dialog>

			<Dialog
				open={open === 'schedule'}
				onOpenChange={onOpenChange('schedule')}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Let’s find a time.</DialogTitle>
						<DialogDescription>
							A {profile.callMinutes}-minute conversation about your team, the
							role, or an interesting technical problem.
						</DialogDescription>
					</DialogHeader>
					{profile.bookingUrl ? (
						<iframe
							src={profile.bookingUrl}
							title="Book a call"
							className="h-[60vh] w-full rounded-lg border"
						/>
					) : (
						<ButtonLink href={scheduleCallUrl()}>
							Create a calendar invite <ArrowUpRightIcon />
						</ButtonLink>
					)}
					<ButtonLink
						variant="outline"
						href={`mailto:${profile.email}?subject=${encodeURIComponent('Let’s schedule a call')}`}
					>
						Email to arrange a time <ArrowUpRightIcon />
					</ButtonLink>
				</DialogContent>
			</Dialog>
		</>
	)
}
