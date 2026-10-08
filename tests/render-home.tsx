import {
	RouterProvider,
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
} from '@tanstack/react-router'
import { render } from 'vitest-browser-react'
import { z } from 'zod'

import { HomePage } from '@/components/home-page'
import { dialogs } from '@/lib/profile'

import '@/styles.css'

export async function renderHome(path: string) {
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
