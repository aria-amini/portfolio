import { expect, test } from '@playwright/test'

const orientations = [
	{
		name: 'portrait',
		width: 390,
		height: 844,
		top: 59,
		bottom: 34,
		left: 0,
		right: 0,
	},
	{
		name: 'landscape',
		width: 844,
		height: 390,
		top: 0,
		bottom: 21,
		left: 59,
		right: 59,
	},
]

for (const area of orientations) {
	test(`keeps the scrolled header and resume inside ${area.name} safe areas`, async ({
		page,
		browserName,
	}, testInfo) => {
		test.skip(testInfo.project.name === 'desktop', 'Mobile safe-area coverage')

		// WebKit's scroll clipping varies a few pixels at the dialog's rounded corners.
		const screenshotOptions = {
			maxDiffPixels: browserName === 'webkit' ? 100 : 50,
		}

		await page.setViewportSize({ width: area.width, height: area.height })
		await page.clock.setFixedTime(new Date('2026-01-15T14:30:00-05:00'))
		await page.goto('/')
		await page
			.locator('astro-island[component-export="SiteDialogs"]:not([ssr])')
			.waitFor({ state: 'attached' })
		await page
			.locator('astro-island[component-export="NycSkyline"]:not([ssr])')
			.waitFor({ state: 'attached' })
		// Headless browsers omit the iPhone's notch and Safari toolbar insets.
		await page.evaluate(async (insets) => {
			for (const edge of ['top', 'bottom', 'left', 'right'] as const) {
				document.documentElement.style.setProperty(
					`--safe-area-${edge}`,
					`${insets[edge]}px`,
				)
			}

			await document.fonts.ready

			for (const image of document.images) {
				image.loading = 'eager'
				await image.decode()
			}

			window.scrollTo({ top: 220, behavior: 'instant' })
		}, area)

		const header = page.locator('body > div > header')
		const navigation = (await header.getByRole('navigation').boundingBox())!
		expect(navigation.y).toBeGreaterThanOrEqual(area.top)
		expect(navigation.x).toBeGreaterThanOrEqual(area.left)
		expect(navigation.x + navigation.width).toBeLessThanOrEqual(
			area.width - area.right,
		)
		expect((await header.boundingBox())!.y).toBe(0)

		const skip = page.getByRole('link', { name: 'Skip to content' })
		const hidden = (await skip.boundingBox())!
		expect(hidden.width).toBeLessThanOrEqual(1)
		expect(hidden.height).toBeLessThanOrEqual(1)
		await expect(page).toHaveScreenshot(
			`scrolled-header-${area.name}.png`,
			screenshotOptions,
		)

		await skip.focus()
		await expect(skip).toBeFocused()
		const focused = (await skip.boundingBox())!
		expect(focused.y).toBeGreaterThanOrEqual(area.top)
		expect(focused.x).toBeGreaterThanOrEqual(area.left)
		await page.keyboard.press('Enter')
		await expect(page.locator('main')).toBeFocused()

		await page.getByRole('link', { name: 'View resume', exact: true }).click()
		const dialog = page.getByRole('dialog', { name: 'Resume', exact: true })
		await expect(dialog).toBeVisible()
		const preview = dialog.getByRole('img', { name: 'Aria Amini resume' })
		await preview.evaluate((image: HTMLImageElement) => image.decode())
		const popup = (await dialog.boundingBox())!
		expect(popup.y).toBeGreaterThanOrEqual(area.top)
		expect(popup.y + popup.height).toBeLessThanOrEqual(
			area.height - area.bottom,
		)
		expect(popup.x).toBeGreaterThanOrEqual(area.left)
		expect(popup.x + popup.width).toBeLessThanOrEqual(area.width - area.right)
		await expect(page).toHaveScreenshot(
			`resume-viewport-${area.name}.png`,
			screenshotOptions,
		)
		await page.keyboard.press('Escape')
		await expect(dialog).toBeHidden()
	})
}
