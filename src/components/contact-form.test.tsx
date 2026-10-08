import { expect, test } from 'vite-plus/test'
import { userEvent } from 'vite-plus/test/browser'
import { render } from 'vitest-browser-react'

import { ContactForm } from '@/components/contact-form'

test('empty email', async () => {
	const screen = await render(<ContactForm />)
	const submitButton = screen.getByRole('button', { name: /send message/i })
	await userEvent.click(submitButton)
	await expect
		.element(screen.getByText(/Invalid email address/i))
		.toBeInTheDocument()
})
