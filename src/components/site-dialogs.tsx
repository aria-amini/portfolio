import { CornersOutIcon, FilePdfIcon } from '@phosphor-icons/react/dist/ssr'
import { useEffect, useRef, useState } from 'react'

import { ButtonLink } from '@/components/button-link'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { dialogUrl, readDialog } from '@/lib/dialog-url'
import { type DialogName, profile } from '@/lib/profile'

const resumePreviewUrl = `${profile.resumeUrl}#navpanes=0&pagemode=none&view=FitH`

const resumeFullScreenUrl = `${profile.resumeUrl}#navpanes=0&pagemode=none&zoom=100`

export function SiteDialogs({
	open: initialDialog,
}: {
	open: DialogName | undefined
}) {
	const [open, setOpen] = useState(initialDialog)
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

		function syncDialog() {
			setOpen(readDialog(new URL(window.location.href)))
		}

		function onClick(event: MouseEvent) {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			)
				return
			const target = event.target

			if (!(target instanceof Element)) return
			const link = target.closest('a[data-dialog]')

			if (
				!(link instanceof HTMLAnchorElement) ||
				link.target ||
				link.hasAttribute('download')
			)
				return
			const next = new URL(link.href)

			if (
				next.origin !== window.location.origin ||
				next.pathname !== window.location.pathname
			)
				return
			const dialog = readDialog(next)

			if (!dialog) return
			event.preventDefault()
			returnFocus.current = link
			history.pushState(
				null,
				'',
				dialogUrl(new URL(window.location.href), dialog),
			)
			setOpen(dialog)
		}

		syncDialog()
		document.addEventListener('focusin', rememberFocus)
		document.addEventListener('click', onClick)
		window.addEventListener('popstate', syncDialog)

		return () => {
			document.removeEventListener('focusin', rememberFocus)
			document.removeEventListener('click', onClick)
			window.removeEventListener('popstate', syncDialog)
		}
	}, [])

	function restoreFocus() {
		return returnFocus.current ?? document.getElementById('main')
	}

	function onOpenChange(name: DialogName) {
		return (isOpen: boolean) => {
			if (!isOpen && open === name) {
				history.pushState(
					null,
					'',
					dialogUrl(new URL(window.location.href), undefined),
				)
				setOpen(undefined)
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
