import { CornersOutIcon, FilePdfIcon } from '@phosphor-icons/react/dist/ssr'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { ButtonLink } from '@/components/button-link'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { type DialogName, profile } from '@/lib/profile'

const resumePreviewUrl = `${profile.resumeUrl}#navpanes=0&pagemode=none&view=FitH`

const resumeFullScreenUrl = `${profile.resumeUrl}#navpanes=0&pagemode=none&zoom=100`

export function SiteDialogs({ open }: { open: DialogName | undefined }) {
	const navigate = useNavigate({ from: '/' })
	const returnFocus = useRef<HTMLElement | null>(null)

	useEffect(() => {
		function rememberFocus(event: FocusEvent) {
			// Base UI places focus guards outside the dialog, so ignore all modal focus changes.
			if (document.querySelector('[role="dialog"]')) return

			const target = event.target

			if (target instanceof HTMLElement && !target.closest('[role="dialog"]')) {
				returnFocus.current = target
			}
		}

		document.addEventListener('focusin', rememberFocus)

		return () => document.removeEventListener('focusin', rememberFocus)
	}, [])

	function restoreFocus() {
		return returnFocus.current ?? document.getElementById('main')
	}

	function onOpenChange(name: DialogName) {
		return (isOpen: boolean) => {
			if (!isOpen && open === name) {
				void navigate({
					search: (prev) => ({ ...prev, dialog: undefined }),
					resetScroll: false,
				})
			}
		}
	}

	return (
		<>
			<Dialog open={open === 'resume'} onOpenChange={onOpenChange('resume')}>
				<DialogContent finalFocus={restoreFocus} className="sm:max-w-3xl">
					<DialogHeader>
						<DialogTitle>Resume</DialogTitle>
					</DialogHeader>
					<object
						data={resumePreviewUrl}
						type="application/pdf"
						aria-label={`${profile.name} resume`}
						className="hidden h-[60vh] w-full rounded-lg border md:block"
					/>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<ButtonLink
							size="lg"
							className="h-11"
							href={resumeFullScreenUrl}
							target="_blank"
							rel="noreferrer"
						>
							<CornersOutIcon data-icon="inline-start" />
							View Full-Screen
						</ButtonLink>
						<ButtonLink
							variant="outline"
							size="lg"
							className="h-11"
							href={profile.resumeUrl}
							download={`${profile.name} - Resume.pdf`}
						>
							<FilePdfIcon className="size-5" data-icon="inline-start" />
							Download PDF
						</ButtonLink>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog open={open === 'book'} onOpenChange={onOpenChange('book')}>
				<DialogContent
					finalFocus={restoreFocus}
					layout="bleed"
					className="sm:max-w-[min(72rem,calc(100%-4rem))]"
				>
					<DialogHeader variant="bar">
						<DialogTitle>Let’s find a time.</DialogTitle>
					</DialogHeader>
					{profile.bookingUrl ? (
						<iframe
							src={profile.bookingUrl}
							title="Book a call"
							className="h-[75dvh] w-full"
						/>
					) : null}
				</DialogContent>
			</Dialog>
		</>
	)
}
