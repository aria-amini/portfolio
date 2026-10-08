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
	document.cookie = 'theme=; Max-Age=0; Path=/'
	document.documentElement.classList.remove('light', 'dark')
})

afterEach(() => {
	document.cookie = 'theme=; Max-Age=0; Path=/'
	document.documentElement.classList.remove('light', 'dark')
})

test('follows the system theme when nothing is stored', async () => {
	const screen = await renderSwitch()

	await expect
		.element(screen.getByRole('button', { name: 'System theme' }))
		.toHaveAttribute('aria-pressed', 'true')
})

test('keeps a theme that the bootstrap script applied without a cookie', async () => {
	const system = matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'

	const applied = system === 'dark' ? 'light' : 'dark'
	document.documentElement.classList.add(applied)

	const screen = await renderSwitch()

	await expect
		.element(
			screen.getByRole('button', {
				name: applied === 'dark' ? 'Dark theme' : 'Light theme',
			}),
		)
		.toHaveAttribute('aria-pressed', 'true')
	expect(document.documentElement.classList.contains(applied)).toBe(true)
})

test('saves and applies an explicit choice', async () => {
	const screen = await renderSwitch()

	await screen.getByRole('button', { name: 'Dark theme' }).click()

	expect(document.documentElement.classList.contains('dark')).toBe(true)
	expect(document.cookie).toContain('theme=dark')
})
