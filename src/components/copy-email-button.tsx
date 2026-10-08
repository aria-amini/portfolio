import { CheckIcon, CopyIcon } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { profile } from '@/lib/profile'

export function CopyEmailButton() {
	const [copied, setCopied] = useState(false)

	async function copy() {
		try {
			await navigator.clipboard.writeText(profile.email)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			setCopied(false)
		}
	}

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			aria-label="Copy email address"
			onClick={copy}
		>
			{copied ? <CheckIcon /> : <CopyIcon />}
			{copied ? 'Copied' : 'Copy'}
		</Button>
	)
}
