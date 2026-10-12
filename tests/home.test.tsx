import { expect, test } from 'vite-plus/test'
import { userEvent } from 'vite-plus/test/browser'

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

test('opens the booking dialog from the URL', async () => {
	const screen = await renderHome('/?dialog=book')

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
	await expect
		.element(screen.getByRole('link', { name: /book a 15-min call/i }))
		.toHaveFocus()
})

test('returns focus to the resume action after the dialog closes', async () => {
	const screen = await renderHome('/')
	const resumeAction = screen.getByRole('link', { name: /view resume/i })
	await resumeAction.click()
	await expect
		.element(screen.getByRole('dialog', { name: 'Resume', exact: true }))
		.toBeVisible()
	await screen.getByRole('button', { name: 'Close', exact: true }).click()
	await expect.element(resumeAction).toHaveFocus()
})

test('keeps keyboard focus inside the resume dialog and returns it after Escape', async () => {
	const screen = await renderHome('/')
	const resumeAction = screen.getByRole('link', { name: /view resume/i })
	resumeAction.element().focus()
	await expect.element(resumeAction).toHaveFocus()

	await userEvent.keyboard('{Enter}')
	const dialog = screen.getByRole('dialog', { name: 'Resume', exact: true })
	await expect.element(dialog).toBeVisible()
	await expect
		.poll(() => dialog.element().contains(document.activeElement))
		.toBe(true)

	const closeAction = screen.getByRole('button', { name: 'Close', exact: true })
	closeAction.element().focus()
	await expect.element(closeAction).toHaveFocus()
	await userEvent.tab()
	await expect.element(closeAction).not.toHaveFocus()
	await expect
		.poll(() => dialog.element().contains(document.activeElement))
		.toBe(true)

	await userEvent.tab({ shift: true })
	await expect.element(closeAction).toHaveFocus()
	await userEvent.keyboard('{Escape}')
	await expect.element(dialog).not.toBeInTheDocument()
	await expect.element(resumeAction).toHaveFocus()
})

test('keeps the header on screen and under the booking dialog after scrolling', async () => {
	const screen = await renderHome('/')
	// The open dialog hides the page from the accessibility tree, so keep the node.
	const header = screen.getByRole('banner').element()

	window.scrollTo(0, document.documentElement.scrollHeight)
	await expect.poll(() => window.scrollY).toBeGreaterThan(0)
	expect(header.getBoundingClientRect().top).toBe(0)

	await screen.getByRole('link', { name: 'Book a call', exact: true }).click()
	await expect
		.element(screen.getByRole('dialog', { name: /find a time/i }))
		.toBeVisible()

	const bounds = header.getBoundingClientRect()

	const topmost = document.elementFromPoint(
		bounds.left + bounds.width / 2,
		bounds.top + bounds.height / 2,
	)

	expect(header.contains(topmost)).toBe(false)
})
