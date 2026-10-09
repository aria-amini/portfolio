import { expect, test } from '@playwright/test'

const domains = ['https://ariaamini.dev/', 'https://www.ariaamini.dev/']

test.skip(
	!process.env.CHECK_DOMAINS,
	'Set CHECK_DOMAINS=1 to test the live domains.',
)

for (const url of domains) {
	test(`${url} serves the portfolio`, async ({ page }) => {
		const response = await page.goto(url)

		expect(response?.status()).toBe(200)
		await expect(page).toHaveTitle('Aria Amini - Portfolio')
		await expect(
			page.getByRole('heading', { name: /aria amini/i }),
		).toBeVisible()
	})
}
