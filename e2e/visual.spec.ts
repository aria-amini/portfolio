import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
	await page.clock.setFixedTime(new Date('2026-01-15T14:30:00-05:00'))
	// External booking content changes independently of the portfolio.
	await page.route('https://cal.com/**', (route) =>
		route.fulfill({ body: '<html></html>', contentType: 'text/html' }),
	)
})

test('landing page', async ({ page }) => {
	await page.goto('/')
	await page
		.locator('astro-island[component-export="NycSkyline"]:not([ssr])')
		.waitFor({ state: 'attached' })
	await page.evaluate(async () => {
		await document.fonts.ready

		for (const image of document.images) {
			image.loading = 'eager'
			await image.decode()
		}
	})
	await expect(page).toHaveScreenshot('landing-page.png', {
		fullPage: true,
		maxDiffPixels: 50,
	})
})

test('calendar dialog', async ({ page }) => {
	await page.goto('/?dialog=book')
	const dialog = page.getByRole('dialog', { name: /find a time/i })
	await expect(dialog).toBeVisible()
	await page.evaluate(async () => {
		await document.fonts.ready
		const calendar = document.querySelector('iframe[title="Book a call"]')

		if (calendar instanceof HTMLIFrameElement)
			calendar.style.visibility = 'hidden'
	})
	await expect(dialog).toHaveScreenshot('calendar-dialog.png', {
		maxDiffPixels: 50,
	})
})
