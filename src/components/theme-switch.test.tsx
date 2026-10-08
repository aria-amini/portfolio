import { afterEach, beforeEach, expect, test } from 'vite-plus/test'
import { render } from 'vitest-browser-react'

import { ThemeProvider, ThemeSwitch } from '@/components/theme-switch'

function renderSwitch() {
	return render(
		<ThemeProvider preference={null}>
			<ThemeSwitch />
		</ThemeProvider>,
	)
}

beforeEach(() => {
	localStorage.removeItem('theme')
	document.cookie = 'theme=; Max-Age=0; Path=/'
	document.documentElement.classList.remove('light', 'dark')
})

afterEach(() => {
	localStorage.removeItem('theme')
	document.cookie = 'theme=; Max-Age=0; Path=/'
	document.documentElement.classList.remove('light', 'dark')
})

test('follows the system theme when nothing is stored', async () => {
	const screen = await renderSwitch()

	await expect
		.element(screen.getByRole('button', { name: 'System theme' }))
		.toHaveAttribute('aria-pressed', 'true')
})

test.each(['light', 'dark'] as const)(
	'keeps a legacy %s theme when the cookie write fails',
	async (legacy) => {
		localStorage.setItem('theme', legacy)
		document.documentElement.classList.add(legacy)

		const screen = await renderSwitch()

		await expect
			.element(
				screen.getByRole('button', {
					name: legacy === 'dark' ? 'Dark theme' : 'Light theme',
				}),
			)
			.toHaveAttribute('aria-pressed', 'true')
		expect(document.documentElement.classList.contains(legacy)).toBe(true)
	},
)

test('saves and applies an explicit choice', async () => {
	const screen = await renderSwitch()

	await screen.getByRole('button', { name: 'Dark theme' }).click()

	expect(document.documentElement.classList.contains('dark')).toBe(true)
	expect(document.cookie).toContain('theme=dark')
})
