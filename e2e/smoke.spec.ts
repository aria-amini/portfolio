import { expect, test } from '@playwright/test'

test('portfolio loads and the contact form validates after hydration', async ({
	page,
}) => {
	const errors: Error[] = []
	page.on('pageerror', (error) => errors.push(error))

	const response = await page.goto('/')
	expect(response?.status()).toBe(200)
	await expect(page).toHaveTitle('Aria Amini - Portfolio')
	await expect(page.getByRole('heading', { name: /aria amini/i })).toBeVisible()
	await page.getByRole('link', { name: /about me/i }).click()
	await expect(page).toHaveURL(/#experience$/)
	await expect(page.getByTitle('Experience')).toBeVisible()
	await page.getByRole('button', { name: /send message/i }).click()
	await expect(page.getByText('Invalid email address')).toBeVisible()
	await expect(page.getByText('Message is required')).toBeVisible()
	expect(errors).toEqual([])
})
