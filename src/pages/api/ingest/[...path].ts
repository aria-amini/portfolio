import type { APIRoute } from 'astro'

import { proxyPosthogRequest } from '@/lib/analytics/posthog-request'

export const ALL: APIRoute = ({ request, params }) =>
	proxyPosthogRequest(request, params.path ?? '')
