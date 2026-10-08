import type { ComponentType } from 'react'
import { test } from 'vite-plus/test'
import type { Locator } from 'vite-plus/test/browser'
import type { RenderResult } from 'vitest-browser-react'

import { Route as HomeRoute } from '@/routes/index'

import { expectPageScreenshot } from './__mocks__/visual-page'

const Home = HomeRoute.options.component as ComponentType

interface VisualPage {
	name: string
	path: string
	component: ComponentType
	prepare?: (screen: RenderResult) => void | Promise<void>
	waitFor: (screen: RenderResult) => Locator
	target?: (screen: RenderResult) => Locator
}

const pages = [
	{
		name: 'home-intro',
		path: '/',
		component: Home,
		waitFor: (screen) => screen.getByRole('heading', { name: /aria amini/i }),
	},
	{
		name: 'home-experience',
		path: '/',
		component: Home,
		prepare: async (screen) => {
			await screen.getByRole('link', { name: /about me/i }).click()
		},
		waitFor: (screen) => screen.getByTitle('Experience'),
	},
	{
		name: 'home-full-page',
		path: '/',
		component: Home,
		waitFor: (screen) => screen.getByTestId('contact-card'),
	},
] satisfies VisualPage[]

const viewports = [
	{ name: 'desktop', width: 1280, height: 720 },
	{ name: 'mobile', width: 390, height: 844 },
] as const
test.each(pages)('$name page matches screenshots', async (visualPage) => {
	for (const viewport of viewports) {
		await expectPageScreenshot({
			...visualPage,
			name: `${visualPage.name}-${viewport.name}`,
			viewport,
		})
	}
})
