import { createFileRoute, redirect } from '@tanstack/react-router'

// Long-form alias of /book.
export const Route = createFileRoute('/book-a-call')({
	beforeLoad: () => {
		throw redirect({ to: '/', search: { dialog: 'book' } })
	},
})
