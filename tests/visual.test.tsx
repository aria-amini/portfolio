import { expect, test } from 'vite-plus/test'
import { commands, page } from 'vite-plus/test/browser'

import { renderHome } from './render-home'

declare module 'vite-plus/test/browser' {
	interface BrowserCommands {
		resizeBrowserViewport: (width: number, height: number) => Promise<void>
	}
}

const viewport = () => (window.innerWidth < 600 ? 'mobile' : 'desktop')

test('landing page', async () => {
	const screen = await renderHome('/')
	await expect
		.element(screen.getByRole('heading', { name: /aria amini/i }))
		.toBeVisible()
	await document.fonts.ready

	for (const image of document.images) {
		image.loading = 'eager'
		await image.decode()
	}

	const width = window.innerWidth
	const height = window.innerHeight

	try {
		await commands.resizeBrowserViewport(
			width,
			document.documentElement.scrollHeight,
		)
		await page.viewport(width, document.documentElement.scrollHeight)
		await expect
			.element(document.body)
			.toMatchScreenshot(`landing-page-${viewport()}`)
	} finally {
		await commands.resizeBrowserViewport(width, height)
		await page.viewport(width, height)
	}
})
