import { CheckIcon, CopyIcon } from '@phosphor-icons/react/dist/ssr'
import { cn } from 'cn'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { profile } from '@/lib/profile'

const copiedDuration = 2000

export function CopyEmail({ className }: { className?: string }) {
	const [copied, setCopied] = useState(false)
	const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => () => clearTimeout(resetTimer.current), [])

	async function copy() {
		try {
			await navigator.clipboard.writeText(profile.email)
			setCopied(true)
			clearTimeout(resetTimer.current)
			resetTimer.current = setTimeout(() => setCopied(false), copiedDuration)
		} catch {
			setCopied(false)
		}
	}

	return (
		<div
			data-active={copied || undefined}
			className={cn('flex flex-wrap items-center gap-x-4 text-sm', className)}
		>
			<span className="highlight-sweep -mx-1 rounded-sm px-1">
				{profile.email}
			</span>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label={copied ? 'Email address copied' : 'Copy email address'}
				onClick={copy}
			>
				{copied ? <CheckIcon className="stamp-press" /> : <CopyIcon />}
			</Button>
		</div>
	)
}
