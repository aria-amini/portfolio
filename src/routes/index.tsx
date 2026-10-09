import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { HomePage } from '@/components/home-page'
import { dialogs } from '@/lib/profile'

const searchSchema = z.object({ dialog: z.enum(dialogs).optional() })

export const Route = createFileRoute('/')({
	validateSearch: searchSchema,
	component: Index,
})

function Index() {
	const { dialog } = Route.useSearch()

	return <HomePage dialog={dialog} />
}
