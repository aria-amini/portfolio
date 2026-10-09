import { afterEach, expect, test } from 'vite-plus/test'

import { renderHome } from './render-home'

afterEach(() => {
	document.documentElement.classList.remove('dark')
})

const viewport = () => (window.innerWidth < 600 ? 'mobile' : 'desktop')

// Remove external and plugin-rendered content so screenshots stay deterministic.
function hideEmbeds() {
	for (const embed of document.querySelectorAll('iframe, object')) {
		if (embed instanceof HTMLElement) embed.style.visibility = 'hidden'
	}
}

test.each(['light', 'dark'] as const)('home sections in %s', async (theme) => {
	if (theme === 'dark') document.documentElement.classList.add('dark')
	const screen = await renderHome('/')
	await expect
		.element(screen.getByRole('heading', { name: /aria amini/i }))
		.toBeVisible()
	await document.fonts.ready

	await expect
		.element(screen.getByRole('region', { name: /aria amini/i }))
		.toMatchScreenshot(`hero-${theme}-${viewport()}`)
	await expect
		.element(screen.getByRole('region', { name: 'Projects' }))
		.toMatchScreenshot(`projects-${theme}-${viewport()}`)
})

test.each(['resume', 'schedule'] as const)('%s dialog', async (dialog) => {
	const screen = await renderHome(`/?dialog=${dialog}`)
	const popup = screen.getByRole('dialog')
	await expect.element(popup).toBeVisible()
	hideEmbeds()
	await document.fonts.ready

	await expect
		.element(popup)
		.toMatchScreenshot(`${dialog}-dialog-${viewport()}`)
})
