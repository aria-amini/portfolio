import { createFileRoute, redirect } from '@tanstack/react-router'

// Shareable booking link. During SSR the redirect becomes an HTTP 307, so the
// booking dialog state stays in one place: the index route search params.
export const Route = createFileRoute('/book')({
	beforeLoad: () => {
		throw redirect({ to: '/', search: { dialog: 'book' } })
	},
})
