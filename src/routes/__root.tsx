/// <reference types="vite/client" />

import {
	ClientOnly,
	HeadContent,
	Outlet,
	ScriptOnce,
	Scripts,
	createRootRoute,
} from '@tanstack/react-router'
import posthog from 'posthog-js'
import { useEffect, type ReactNode } from 'react'

import { ThemeProvider, ThemeSwitch } from '@/components/theme-switch'
import { createThemeBootstrapScript, getThemePreference } from '@/lib/theme'

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
	beforeLoad: () => ({ theme: getThemePreference() }),
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
	const { theme } = Route.useRouteContext()

	return (
		<html lang="en" suppressHydrationWarning className={theme ?? undefined}>
			<head>
				<HeadContent />
			</head>
			<body className="flex min-h-dvh min-w-80 flex-col font-sans">
				<ScriptOnce>{createThemeBootstrapScript(theme)}</ScriptOnce>
				<ThemeProvider preference={theme}>{children}</ThemeProvider>
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
				<div className="fixed right-4 bottom-4 z-50">
					<ThemeSwitch />
				</div>
			</ClientOnly>
			<ClientOnly fallback={null}>
				<Analytics />
			</ClientOnly>
		</>
	)
}
