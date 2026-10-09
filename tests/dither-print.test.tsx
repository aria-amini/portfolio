import { expect, test } from 'vite-plus/test'
import { commands, server } from 'vite-plus/test/browser'

import {
	ditherPhotoSrc,
	ditherPrintSrc,
	ditherResolution,
	printDither,
} from '@/lib/dither-print'
import { readInks } from '@/lib/ink'

declare module 'vite-plus/test/browser' {
	interface BrowserCommands {
		writePublicPng: (name: string, base64: string) => Promise<void>
	}
}

async function loadImage(src: string) {
	const image = new Image()
	image.src = `${src}?v=${Date.now()}`
	await image.decode()

	return image
}

function pixelsOf(image: CanvasImageSource) {
	const canvas = document.createElement('canvas')
	canvas.width = ditherResolution
	canvas.height = ditherResolution
	const context = canvas.getContext('2d', { willReadFrequently: true })!
	context.drawImage(image, 0, 0)

	return context.getImageData(0, 0, ditherResolution, ditherResolution).data
}

// The avatar ships as a prebuilt PNG so it renders with the first HTML. This keeps it in sync with the photo, the dither code, and the theme inks.
test('prebuilt dither print matches the photo and theme', async () => {
	const print = printDither(await loadImage(ditherPhotoSrc), readInks())

	if (server.config.snapshotOptions.updateSnapshot === 'all') {
		const base64 = print.toDataURL('image/png').split(',')[1]!
		await commands.writePublicPng(ditherPrintSrc.slice(1), base64)
	}

	const committed = pixelsOf(await loadImage(ditherPrintSrc))
	const expected = pixelsOf(print)

	const mismatches = expected.filter(
		(value, index) => value !== committed[index],
	)

	expect(
		mismatches.length,
		`${ditherPrintSrc} is stale. Run \`vp run test:update\`.`,
	).toBe(0)
})
