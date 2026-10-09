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
		.element(screen.getByRole('link', { name: /book a 30-min call/i }).first())
		.toBeVisible()
})

test('opens the schedule dialog from the URL', async () => {
	const screen = await renderHome('/?dialog=schedule')

	await expect
		.element(screen.getByRole('dialog', { name: /find a time/i }))
		.toBeVisible()
})
