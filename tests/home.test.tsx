import { expect, test } from 'vite-plus/test'

import { renderHome } from './render-home'

test('shows the recruiter actions', async () => {
	const screen = await renderHome('/')

	await expect
		.element(screen.getByRole('heading', { name: /aria amini/i }))
		.toBeVisible()
	await expect
		.element(screen.getByRole('link', { name: /view resume/i }))
		.toBeVisible()
	await expect
		.element(screen.getByRole('link', { name: /book a 15-min call/i }).first())
		.toBeVisible()
})

test('opens the schedule dialog from the URL', async () => {
	const screen = await renderHome('/?dialog=schedule')

	await expect
		.element(screen.getByRole('dialog', { name: /find a time/i }))
		.toBeVisible()
})

test('opens and closes the calendar from the booking action', async () => {
	const screen = await renderHome('/')
	await screen.getByRole('link', { name: /book a 15-min call/i }).click()

	const dialog = screen.getByRole('dialog', { name: /find a time/i })
	await expect.element(dialog).toBeVisible()

	const calendar = document.querySelector('iframe[title="Book a call"]')

	if (!(calendar instanceof HTMLIFrameElement)) {
		throw new Error('The calendar iframe is missing')
	}

	const bounds = calendar.getBoundingClientRect()
	expect(bounds.width).toBeGreaterThan(window.innerWidth < 600 ? 250 : 800)
	expect(bounds.height).toBeGreaterThan(window.innerHeight * 0.7)

	const popup = dialog.element().getBoundingClientRect()
	expect(popup.left).toBeGreaterThanOrEqual(0)
	expect(popup.right).toBeLessThanOrEqual(window.innerWidth)
	expect(popup.top).toBeGreaterThanOrEqual(0)
	expect(popup.bottom).toBeLessThanOrEqual(window.innerHeight)

	await screen.getByRole('button', { name: 'Close', exact: true }).click()
	await expect.element(dialog).not.toBeInTheDocument()
})
