import { expect, test, vi } from 'vite-plus/test'

import { proxyPosthogRequest } from './posthog-request'

test('forwards the request body, query, and upstream status without site credentials', async () => {
	const upstream = vi.fn<typeof fetch>().mockResolvedValue(
		new Response('accepted', {
			status: 202,
			headers: {
				'content-type': 'application/json',
				'content-encoding': 'gzip',
				'content-length': '8',
			},
		}),
	)

	const request = new Request('https://www.ariaamini.dev/api/ingest/e/?ip=1', {
		method: 'POST',
		body: '{"event":"pageview"}',
		headers: {
			cookie: 'session=private',
			authorization: 'Bearer private',
			'cf-connecting-ip': '127.0.0.1',
			'content-type': 'application/json',
		},
	})

	const response = await proxyPosthogRequest(request, 'e/', upstream)
	const [url, init] = upstream.mock.calls[0]!
	expect(url).toEqual(new URL('https://us.i.posthog.com/e/?ip=1'))
	expect(init?.method).toBe('POST')
	expect(init?.body).toBe(request.body)
	const headers = new Headers(init?.headers)
	expect(headers.get('content-type')).toBe('application/json')
	expect(headers.has('cookie')).toBe(false)
	expect(headers.has('authorization')).toBe(false)
	expect(headers.has('cf-connecting-ip')).toBe(false)
	expect(response.status).toBe(202)
	expect(await response.text()).toBe('accepted')
	expect(response.headers.has('content-encoding')).toBe(false)
	expect(response.headers.has('content-length')).toBe(false)
})

test.each(['GET', 'HEAD'])(
	'%s forwards no body and uses the asset host',
	async (method) => {
		const upstream = vi.fn<typeof fetch>().mockResolvedValue(new Response(null))
		await proxyPosthogRequest(
			new Request('https://www.ariaamini.dev/api/ingest/static/array.js', {
				method,
			}),
			'static/array.js',
			upstream,
		)
		const [url, init] = upstream.mock.calls[0]!
		expect(url).toEqual(
			new URL('https://us-assets.i.posthog.com/static/array.js'),
		)
		expect(init?.body).toBeNull()
	},
)
