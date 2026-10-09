import { expect, test } from '@playwright/test'

test('portfolio loads and recruiter paths work after hydration', async ({
	page,
}) => {
	const errors: Error[] = []
	page.on('pageerror', (error) => errors.push(error))

	const response = await page.goto('/')
	expect(response?.status()).toBe(200)
	await expect(page).toHaveTitle('Aria Amini - Portfolio')
	await expect(page.getByRole('heading', { name: /aria amini/i })).toBeVisible()

	const resume = await page.request.get('/aria-amini-resume.pdf')
	expect(resume.status()).toBe(200)
	expect(resume.headers()['content-type']).toContain('application/pdf')

	const docx = await page.request.get('/aria-amini-resume.docx')
	expect(docx.status()).toBe(200)

	await page.getByRole('link', { name: /view resume/i }).click()
	await expect(page).toHaveURL(/dialog=resume/)
	await expect(page.getByRole('dialog', { name: 'Resume' })).toBeVisible()
	await page.keyboard.press('Escape')
	await expect(page.getByRole('dialog')).toBeHidden()

	await page
		.getByRole('link', { name: /book a 15-min call/i })
		.first()
		.click()
	await expect(page).toHaveURL(/dialog=schedule/)
	await expect(page.getByRole('dialog', { name: /find a time/i })).toBeVisible()
	expect(errors).toEqual([])
})

test('proxies PostHog assets through the app', async ({ request }) => {
	const response = await request.get('/api/ingest/static/array.js')

	expect(response.status()).toBe(200)
	expect(response.headers()['content-type']).toContain('javascript')
})
