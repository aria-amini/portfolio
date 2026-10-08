import {
	RouterProvider,
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
} from '@tanstack/react-router'
import { expect, test } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { z } from 'zod'

import { HomePage } from '@/components/home-page'
import { dialogs } from '@/lib/profile'

import '@/styles.css'

async function renderHome(path: string) {
	const rootRoute = createRootRoute()

	const homeRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: '/',
		validateSearch: z.object({ dialog: z.enum(dialogs).optional() }),
		component: () => <HomePage dialog={homeRoute.useSearch().dialog} />,
	})

	const router = createRouter({
		routeTree: rootRoute.addChildren([homeRoute]),
		history: createMemoryHistory({ initialEntries: [path] }),
	})

	await router.load()

	return render(<RouterProvider router={router} />)
}

test('shows the recruiter actions', async () => {
	const screen = await renderHome('/')

	await expect
		.element(screen.getByRole('heading', { name: /aria amini/i }))
		.toBeVisible()
	await expect
		.element(screen.getByRole('link', { name: /view resume/i }))
		.toBeVisible()
	await expect
		.element(screen.getByRole('link', { name: /book a 30-min call/i }).first())
		.toBeVisible()
})

test('opens the schedule dialog from the URL', async () => {
	const screen = await renderHome('/?dialog=schedule')

	await expect
		.element(screen.getByRole('dialog', { name: /find a time/i }))
		.toBeVisible()
})
