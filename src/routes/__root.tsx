/// <reference types="vite/client" />

import {
	ClientOnly,
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute,
} from '@tanstack/react-router'
import posthog from 'posthog-js'
import { useEffect, type ReactNode } from 'react'

import '../styles.css'

function Analytics() {
	useEffect(() => {
		const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY?.trim()

		if (import.meta.env.MODE === 'development' || !posthogKey) return

		posthog.init(posthogKey, {
			api_host: '/api/ingest',
			ui_host: 'https://us.posthog.com',
			defaults: '2025-05-24',
			person_profiles: 'always',
		})
	}, [])

	return null
}

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1, viewport-fit=cover',
			},
			{ title: 'Aria Amini - Portfolio' },
			{
				name: 'description',
				content: 'Portfolio of Aria Amini, a software engineer.',
			},
		],
		links: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }],
	}),
	component: RootComponent,
	shellComponent: DocumentShell,
})

function DocumentShell({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="flex min-h-dvh min-w-80 flex-col font-sans">
				{children}
				<Scripts />
			</body>
		</html>
	)
}

function RootComponent() {
	return (
		<>
			<div className="flex-1">
				<Outlet />
			</div>
			<ClientOnly fallback={null}>
				<Analytics />
			</ClientOnly>
		</>
	)
}
