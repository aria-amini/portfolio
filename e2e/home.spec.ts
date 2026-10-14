import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
	// The suite checks our dialog, independent of Cal.com's load and focus behavior.
	await page.route('https://cal.com/**', (route) =>
		route.fulfill({
			body: '<html></html>',
			contentType: 'text/html',
		}),
	)
	await page.goto('/')
	await page
		.locator('astro-island[component-export="SiteDialogs"]:not([ssr])')
		.waitFor({ state: 'attached' })
})

test('shows the recruiter actions', async ({ page }) => {
	await expect(page.getByRole('heading', { name: /aria amini/i })).toBeVisible()
	await expect(page.getByRole('link', { name: /view resume/i })).toBeVisible()
	await expect(
		page.getByRole('link', { name: /book a 15-min call/i }),
	).toBeVisible()
})

for (const entry of ['homepage', 'direct URL']) {
	test(`shows the resume preview from the ${entry}`, async ({ page }) => {
		if (entry === 'homepage') {
			await page.getByRole('link', { name: /view resume/i }).click()
		} else {
			await page.goto('/?dialog=resume')
		}

		const dialog = page.getByRole('dialog', { name: 'Resume', exact: true })
		const preview = dialog.getByRole('img', { name: 'Aria Amini resume' })
		await expect(preview).toBeVisible()
		await expect
			.poll(() =>
				preview.evaluate(
					(image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
				),
			)
			.toBe(true)

		const viewport = page.viewportSize()!
		const bounds = (await dialog.boundingBox())!
		expect(bounds.x).toBeGreaterThanOrEqual(0)
		expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width)
		expect(bounds.y).toBeGreaterThanOrEqual(0)
		expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height)
		await expect(
			dialog.getByRole('link', { name: 'View Full-Screen' }),
		).toHaveAttribute('href', /^\/aria-amini-resume\.pdf#/)
		await expect(
			dialog.getByRole('link', { name: 'Download PDF' }),
		).toHaveAttribute('download', 'Aria Amini - Resume.pdf')
	})
}

test('opens the booking dialog from the URL', async ({ page }) => {
	await page.goto('/?dialog=book')
	await expect(page.getByRole('dialog', { name: /find a time/i })).toBeVisible()
})

test('fits the calendar to the viewport and restores focus', async ({
	page,
}) => {
	const action = page.getByRole('link', { name: /book a 15-min call/i })
	await action.click()
	const dialog = page.getByRole('dialog', { name: /find a time/i })
	await expect(dialog).toBeVisible()
	const viewport = page.viewportSize()!

	const calendar = (await page
		.locator('iframe[title="Book a call"]')
		.boundingBox())!

	expect(calendar.width).toBeGreaterThan(viewport.width < 600 ? 250 : 800)
	expect(calendar.height).toBeGreaterThan(viewport.height * 0.7)
	const popup = (await dialog.boundingBox())!
	expect(popup.x).toBeGreaterThanOrEqual(0)
	expect(popup.x + popup.width).toBeLessThanOrEqual(viewport.width)
	expect(popup.y).toBeGreaterThanOrEqual(0)
	expect(popup.y + popup.height).toBeLessThanOrEqual(viewport.height)
	await page.getByRole('button', { name: 'Close', exact: true }).click()
	await expect(dialog).toBeHidden()
	await expect(action).toBeFocused()
})

test('traps keyboard focus and restores it after Escape', async ({ page }) => {
	const action = page.getByRole('link', { name: /view resume/i })
	await action.focus()
	await page.keyboard.press('Enter')
	const dialog = page.getByRole('dialog', { name: 'Resume', exact: true })
	await expect(dialog).toBeVisible()
	await expect
		.poll(() =>
			dialog.evaluate((element) => element.contains(document.activeElement)),
		)
		.toBe(true)
	const close = page.getByRole('button', { name: 'Close', exact: true })
	await close.focus()
	await page.keyboard.press('Tab')
	await expect(close).not.toBeFocused()
	await expect
		.poll(() =>
			dialog.evaluate((element) => element.contains(document.activeElement)),
		)
		.toBe(true)
	await page.keyboard.press('Shift+Tab')
	await expect(close).toBeFocused()
	await page.keyboard.press('Escape')
	await expect(dialog).toBeHidden()
	await expect(action).toBeFocused()
})

test('keeps the header on screen and below the booking dialog', async ({
	page,
}) => {
	const header = page.locator('body > div > header')
	await page.evaluate(() =>
		window.scrollTo(0, document.documentElement.scrollHeight),
	)
	expect((await header.boundingBox())!.y).toBe(0)
	await page.getByRole('link', { name: 'Book a call', exact: true }).click()
	await expect(page.getByRole('dialog', { name: /find a time/i })).toBeVisible()
	expect(
		await header.evaluate((element) => {
			const bounds = element.getBoundingClientRect()

			return element.contains(
				document.elementFromPoint(
					bounds.left + bounds.width / 2,
					bounds.top + bounds.height / 2,
				),
			)
		}),
	).toBe(false)
})

test('keeps the header anchored through scroll bursts and viewport resizing', async ({
	page,
}) => {
	const viewport = page.viewportSize()!
	const header = page.getByRole('banner')

	for (const height of [
		viewport.height,
		viewport.height - 120,
		viewport.height,
	]) {
		await page.setViewportSize({ width: viewport.width, height })

		const positions = await page.evaluate(async () => {
			const banner = document.querySelector('header')!
			const samples = []

			for (const offset of [0, 600, 20, 1200, 80, 0]) {
				window.scrollTo({ top: offset, behavior: 'instant' })
				await new Promise<void>((resolve) =>
					requestAnimationFrame(() => resolve()),
				)
				samples.push(banner.getBoundingClientRect().top)
			}

			return samples
		})

		expect(positions).toEqual([0, 0, 0, 0, 0, 0])
		await expect(header.getByRole('navigation')).toBeVisible()

		const heading = (await page
			.getByRole('heading', { name: 'Aria Amini', exact: true })
			.boundingBox())!

		expect(heading.y).toBeGreaterThanOrEqual(
			(await header.boundingBox())!.height,
		)
	}
})

test('supports Back and Forward without replacing the page', async ({
	page,
}) => {
	await page.goto('/?campaign=recruiter#main')
	await page
		.locator('astro-island[component-export="SiteDialogs"]:not([ssr])')
		.waitFor({ state: 'attached' })
	await page.evaluate(() => {
		document.documentElement.dataset.navigationMarker = 'kept'
	})
	await page.getByRole('link', { name: /view resume/i }).click()
	await expect(page).toHaveURL(/campaign=recruiter&dialog=resume#main/)
	await expect(
		page.getByRole('dialog', { name: 'Resume', exact: true }),
	).toBeVisible()
	await page.goBack()
	await expect(page.getByRole('dialog')).toBeHidden()
	await page.goForward()
	await expect(
		page.getByRole('dialog', { name: 'Resume', exact: true }),
	).toBeVisible()
	await page.keyboard.press('Escape')
	await expect(page).toHaveURL(/\?campaign=recruiter#main$/)
	expect(
		await page.evaluate(
			() => document.documentElement.dataset.navigationMarker,
		),
	).toBe('kept')
})

test('ignores invalid dialog values', async ({ page }) => {
	await page.goto('/?dialog=invalid')
	await expect(page.getByRole('heading', { name: /aria amini/i })).toBeVisible()
	await page
		.locator('astro-island[component-export="SiteDialogs"]:not([ssr])')
		.waitFor({ state: 'attached' })
	await expect(page.getByRole('dialog')).toBeHidden()
})
