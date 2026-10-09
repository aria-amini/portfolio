import {
	CornersOutIcon,
	FileDocIcon,
	FilePdfIcon,
} from '@phosphor-icons/react/dist/ssr'
import { useNavigate } from '@tanstack/react-router'

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
				<DialogContent className="sm:max-w-3xl">
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
						<div className="flex flex-wrap items-center gap-3">
							<span className="label-mono text-muted-foreground">Download</span>
							<ButtonLink
								variant="outline"
								size="lg"
								className="h-11"
								href={profile.resumeUrl}
								download={`${profile.name} - Resume.pdf`}
							>
								<FilePdfIcon className="size-5" data-icon="inline-start" />
								PDF
							</ButtonLink>
							<ButtonLink
								variant="outline"
								size="lg"
								className="h-11"
								href={profile.resumeDocxUrl}
								download={`${profile.name} - Resume.docx`}
							>
								<FileDocIcon className="size-5" data-icon="inline-start" />
								Word
							</ButtonLink>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog
				open={open === 'schedule'}
				onOpenChange={onOpenChange('schedule')}
			>
				<DialogContent
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
