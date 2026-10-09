import { useEffect, useRef } from 'react'

import { readInks, type Rgb } from '@/lib/ink'
import { useAmbientLoop } from '@/lib/use-ambient-loop'

const resolution = 64

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

/**
 * The portrait as a one-ink print: navy dots on paper. A slow ripple moves the dither threshold, so the print breathes.
 * Hover reveals the photo underneath.
 */
export function DitherPortrait({ src }: { src: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const lumaRef = useRef<Float32Array>(null)
	const toneRef = useRef<{ ink: Rgb; paper: Rgb }>(null)

	const redraw = useAmbientLoop(canvasRef, (seconds) => {
		const canvas = canvasRef.current
		const luma = lumaRef.current
		const tones = toneRef.current
		const context = canvas?.getContext('2d')

		if (!canvas || !luma || !tones || !context) return

		if (canvas.width !== resolution) {
			canvas.width = resolution
			canvas.height = resolution
		}

		const frame = context.createImageData(resolution, resolution)
		const half = resolution / 2

		for (let y = 0; y < resolution; y++) {
			for (let x = 0; x < resolution; x++) {
				const index = y * resolution + x
				const distance = Math.hypot(x - half, y - half)
				const ripple = Math.sin(distance * 0.32 - seconds * 1.4) * 0.07
				const value = luma[index]! + ripple
				const threshold = bayer[y % 8]![x % 8]!

				const tone = value < threshold ? tones.ink : tones.paper

				frame.data.set([tone[0], tone[1], tone[2], 255], index * 4)
			}
		}

		context.putImageData(frame, 0, 0)
	})

	useEffect(() => {
		const inks = readInks()
		toneRef.current = { ink: inks.ink, paper: inks.paper }
		const image = new Image()
		image.src = src
		image.onload = () => {
			const probe = document.createElement('canvas')
			probe.width = resolution
			probe.height = resolution
			const context = probe.getContext('2d', { willReadFrequently: true })

			if (!context) return
			context.drawImage(image, 0, 0, resolution, resolution)
			const pixels = context.getImageData(0, 0, resolution, resolution).data
			const luma = new Float32Array(resolution * resolution)

			for (let i = 0; i < luma.length; i++) {
				const r = pixels[i * 4]! / 255
				const g = pixels[i * 4 + 1]! / 255
				const b = pixels[i * 4 + 2]! / 255
				// Lift contrast so the face reads at this tiny size.
				const value = 0.2126 * r + 0.7152 * g + 0.0722 * b
				luma[i] = Math.min(Math.max((value - 0.5) * 1.35 + 0.55, 0), 1)
			}

			lumaRef.current = luma
			redraw()
		}
	}, [src, redraw])

	return (
		<span className="group/dither relative block size-full">
			<img
				src={src}
				alt=""
				width={96}
				height={96}
				fetchPriority="high"
				className="size-full object-cover"
			/>
			<canvas
				ref={canvasRef}
				aria-hidden
				className="halftone-develop absolute inset-0 size-full transition-opacity duration-300 [image-rendering:pixelated] group-hover/dither:opacity-0"
			/>
		</span>
	)
}
