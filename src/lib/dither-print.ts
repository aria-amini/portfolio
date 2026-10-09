import type { Inks, Rgb } from '@/lib/ink'

/** Committed output of `printDither`. `tests/dither-print.test.tsx` keeps it in sync. */
export const ditherPrintSrc = '/aria-amini-dither.png'

export const ditherPhotoSrc = '/aria-amini-192.jpg'

export const ditherResolution = 96

// 8×8 Bayer matrix, normalized to 0..1 thresholds.
const bayer = (() => {
	const base = [
		[0, 32, 8, 40, 2, 34, 10, 42],
		[48, 16, 56, 24, 50, 18, 58, 26],
		[12, 44, 4, 36, 14, 46, 6, 38],
		[60, 28, 52, 20, 62, 30, 54, 22],
		[3, 35, 11, 43, 1, 33, 9, 41],
		[51, 19, 59, 27, 49, 17, 57, 25],
		[15, 47, 7, 39, 13, 45, 5, 37],
		[63, 31, 55, 23, 61, 29, 53, 21],
	]

	return base.map((row) => row.map((value) => (value + 0.5) / 64))
})()

// Share of the ink tone that reaches the paper. Below 1, the print reads as a soft tint.
const inkStrength = 0.75

function mix(from: Rgb, to: Rgb, amount: number): Rgb {
	return [
		Math.round(from[0] + (to[0] - from[0]) * amount),
		Math.round(from[1] + (to[1] - from[1]) * amount),
		Math.round(from[2] + (to[2] - from[2]) * amount),
	]
}

/** Prints the photo as a one-ink Bayer dither in a soft navy tint. */
export function printDither(
	image: CanvasImageSource,
	inks: Pick<Inks, 'ink' | 'paper'>,
) {
	const canvas = document.createElement('canvas')
	canvas.width = ditherResolution
	canvas.height = ditherResolution
	const context = canvas.getContext('2d', { willReadFrequently: true })

	if (!context) throw new Error('2D canvas is not available')
	context.drawImage(image, 0, 0, ditherResolution, ditherResolution)
	const frame = context.getImageData(0, 0, ditherResolution, ditherResolution)
	const pixels = frame.data
	const ink = mix(inks.paper, inks.ink, inkStrength)

	for (let y = 0; y < ditherResolution; y++) {
		for (let x = 0; x < ditherResolution; x++) {
			const index = (y * ditherResolution + x) * 4

			const luma =
				(0.2126 * pixels[index]! +
					0.7152 * pixels[index + 1]! +
					0.0722 * pixels[index + 2]!) /
				255

			// Mild contrast keeps the face legible; the light offset keeps shadows from printing solid.
			const value = (luma - 0.5) * 1.2 + 0.58
			const tone = value < bayer[y % 8]![x % 8]! ? ink : inks.paper
			pixels.set([tone[0], tone[1], tone[2], 255], index)
		}
	}

	context.putImageData(frame, 0, 0)

	return canvas
}
