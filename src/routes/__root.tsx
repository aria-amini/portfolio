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

import { profile } from '@/lib/profile'

import '../styles.css'

const siteUrl = 'https://www.ariaamini.dev'

const siteTitle = `${profile.name} — ${profile.title}`

const previewImageUrl = `${siteUrl}/aria-amini.jpg`

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
			{ title: siteTitle },
			{
				name: 'description',
				content: profile.intro,
			},
			{ property: 'og:type', content: 'website' },
			{ property: 'og:url', content: siteUrl },
			{ property: 'og:title', content: siteTitle },
			{ property: 'og:description', content: profile.intro },
			{ property: 'og:image', content: previewImageUrl },
			{ property: 'og:image:width', content: '800' },
			{ property: 'og:image:height', content: '800' },
			{ property: 'og:image:alt', content: `Portrait of ${profile.name}` },
			{ name: 'twitter:card', content: 'summary' },
			{ name: 'twitter:title', content: siteTitle },
			{ name: 'twitter:description', content: profile.intro },
			{ name: 'twitter:image', content: previewImageUrl },
			{ name: 'twitter:image:alt', content: `Portrait of ${profile.name}` },
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
