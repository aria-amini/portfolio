import {
	filterRequestHeaders,
	filterResponseHeaders,
	resolveUpstreamUrl,
} from './posthog-proxy'

export async function proxyPosthogRequest(
	request: Request,
	path: string,
	fetchUpstream: typeof fetch = fetch,
) {
	let upstreamUrl: URL

	try {
		upstreamUrl = resolveUpstreamUrl(path, new URL(request.url).search)
	} catch {
		return new Response('Bad Request', { status: 400 })
	}

	const requestInit: RequestInit & { duplex: 'half' } = {
		method: request.method,
		headers: filterRequestHeaders(request.headers),
		body:
			request.method === 'GET' || request.method === 'HEAD'
				? null
				: request.body,
		duplex: 'half',
	}

	const response = await fetchUpstream(upstreamUrl, requestInit)

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: filterResponseHeaders(response.headers),
	})
}
