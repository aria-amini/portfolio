import posthog from 'posthog-js'

import { env } from '@/env'

export function initAnalytics() {
	const key = env.VITE_PUBLIC_POSTHOG_KEY?.trim()

	if (import.meta.env.PROD && key) {
		posthog.init(key, {
			api_host: '/api/ingest',
			ui_host: 'https://us.posthog.com',
			defaults: '2025-05-24',
			person_profiles: 'always',
		})
	}
}
