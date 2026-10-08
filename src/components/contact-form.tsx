import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { PaperPlaneTiltIcon } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
	email: z.email({ message: 'Invalid email address' }),
	message: z.string().min(1, 'Message is required'),
})

type FormValues = z.infer<typeof formSchema>

type SendStatus = 'idle' | 'sent' | 'failed'

export function ContactForm() {
	const [status, setStatus] = useState<SendStatus>('idle')

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues: { email: '', message: '' },
	})

	async function onSubmit(values: FormValues) {
		try {
			const response = await fetch('/api/sendEmail', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			})

			if (!response.ok) throw new Error('Failed to send')

			setStatus('sent')
			reset()
		} catch {
			setStatus('failed')
		}
	}

	return (
		<form
			className="flex flex-col gap-4"
			method="POST"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="flex flex-col gap-2">
				<Label htmlFor="contact-email">Your email</Label>
				<Input
					id="contact-email"
					placeholder="you@company.com"
					aria-invalid={Boolean(errors.email)}
					{...register('email')}
				/>
				{errors.email ? (
					<p role="alert" className="text-destructive text-sm">
						{errors.email.message}
					</p>
				) : null}
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="contact-message">Message</Label>
				<Textarea
					id="contact-message"
					placeholder="Tell me about the role or problem..."
					className="h-28 resize-none"
					aria-invalid={Boolean(errors.message)}
					{...register('message')}
				/>
				{errors.message ? (
					<p role="alert" className="text-destructive text-sm">
						{errors.message.message}
					</p>
				) : null}
			</div>
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Sending...' : 'Send message'}
				<PaperPlaneTiltIcon />
			</Button>
			{status === 'sent' ? (
				<p role="status" className="text-sm">
					Message sent. I will reply soon.
				</p>
			) : null}
			{status === 'failed' ? (
				<p role="alert" className="text-destructive text-sm">
					Message failed. Email me directly instead.
				</p>
			) : null}
		</form>
	)
}
