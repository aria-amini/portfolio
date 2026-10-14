import type { DialogName } from './profile'

export function readDialog(url: URL): DialogName | undefined {
	const dialog = url.searchParams.get('dialog')

	return dialog === 'book' || dialog === 'resume' ? dialog : undefined
}

export function dialogUrl(url: URL, dialog: DialogName | undefined): URL {
	const next = new URL(url)

	if (dialog) next.searchParams.set('dialog', dialog)
	else next.searchParams.delete('dialog')

	return next
}
