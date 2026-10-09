import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test'
import { commands, page } from 'vite-plus/test/browser'

import { renderHome } from './render-home'

declare module 'vite-plus/test/browser' {
	interface BrowserCommands {
		resizeBrowserViewport: (width: number, height: number) => Promise<void>
	}
}

// The header clock shows New York time, so pin the date for stable screenshots.
beforeEach(() => {
	vi.useFakeTimers({ toFake: ['Date'] })
	vi.setSystemTime(new Date('2026-01-15T14:30:00-05:00'))
})

afterEach(() => {
	vi.useRealTimers()
})

const viewport = () => (window.innerWidth < 600 ? 'mobile' : 'desktop')

test('landing page', async () => {
	const screen = await renderHome('/')
	await expect
		.element(screen.getByRole('heading', { name: /aria amini/i }))
		.toBeVisible()
	await document.fonts.ready

	for (const image of document.images) {
		image.loading = 'eager'
		await image.decode()
	}

	const width = window.innerWidth
	const height = window.innerHeight

	try {
		await commands.resizeBrowserViewport(
			width,
			document.documentElement.scrollHeight,
		)
		await page.viewport(width, document.documentElement.scrollHeight)
		await expect
			.element(document.body)
			.toMatchScreenshot(`landing-page-${viewport()}`)
	} finally {
		await commands.resizeBrowserViewport(width, height)
		await page.viewport(width, height)
	}
})

test('calendar dialog', async () => {
	const screen = await renderHome('/?dialog=schedule')
	const dialog = screen.getByRole('dialog', { name: /find a time/i })
	await expect.element(dialog).toBeVisible()
	await document.fonts.ready

	const calendar = document.querySelector('iframe[title="Book a call"]')

	if (!(calendar instanceof HTMLIFrameElement)) {
		throw new Error('The calendar iframe is missing')
	}

	// Cal.com content changes independently; the snapshot protects the dialog layout.
	calendar.style.visibility = 'hidden'
	await expect
		.element(dialog)
		.toMatchScreenshot(`calendar-dialog-${viewport()}`)
})
