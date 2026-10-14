import { expect, test } from '@playwright/test'

test('portfolio loads and recruiter paths work after hydration', async ({
	page,
}) => {
	const errors: Error[] = []
	page.on('pageerror', (error) => errors.push(error))

	const response = await page.goto('/')
	expect(response?.status()).toBe(200)
	// The title follows profile.title, so pin only the stable name prefix.
	await expect(page).toHaveTitle(/^Aria Amini — /)
	await expect(page.getByRole('heading', { name: /aria amini/i })).toBeVisible()

	const resume = await page.request.get('/aria-amini-resume.pdf')
	expect(resume.status()).toBe(200)
	expect(resume.headers()['content-type']).toContain('application/pdf')

	await page.getByRole('link', { name: /view resume/i }).click()
	await expect(page).toHaveURL(/dialog=resume/)
	await expect(page.getByRole('dialog', { name: 'Resume' })).toBeVisible()
	await page.keyboard.press('Escape')
	await expect(page.getByRole('dialog')).toBeHidden()

	await page
		.getByRole('link', { name: /book a 15-min call/i })
		.first()
		.click()
	await expect(page).toHaveURL(/dialog=book/)
	await expect(page.getByRole('dialog', { name: /find a time/i })).toBeVisible()
	expect(errors).toEqual([])
})

test('proxies PostHog assets through the app', async ({ request }) => {
	const response = await request.get('/api/ingest/static/array.js')

	expect(response.status()).toBe(200)
	expect(response.headers()['content-type']).toContain('javascript')
})

for (const alias of ['/book', '/book-a-call']) {
	test(`${alias} redirects to the booking dialog`, async ({ request }) => {
		const response = await request.get(alias, { maxRedirects: 0 })
		expect(response.status()).toBe(307)
		expect(response.headers().location).toBe('/?dialog=book')
	})
}

test('renders the portfolio content without JavaScript', async ({
	browser,
	baseURL,
}) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		baseURL: baseURL!,
	})

	const page = await context.newPage()

	try {
		await page.goto('/')
		await expect(
			page.getByRole('heading', { name: /aria amini/i }),
		).toBeVisible()
		await expect(
			page.getByText('Microsoft · Azure', { exact: true }),
		).toBeVisible()
		await expect(
			page.getByRole('heading', { name: 'imdbgraph.org' }),
		).toBeVisible()
	} finally {
		await context.close()
	}
})

test('serves canonical and social metadata in the HTML', async ({
	request,
}) => {
	const response = await request.get('/')
	const html = await response.text()
	expect(html).toContain('href="https://www.ariaamini.dev/"')
	expect(html).toContain(
		'property="og:image" content="https://www.ariaamini.dev/icon.png"',
	)
	expect(html).toContain('name="twitter:card" content="summary"')
})
