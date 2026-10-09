import { cn } from 'cn'
import { useEffect, useMemo, useRef } from 'react'

import type {
	AsciiGrid,
	AsciiPointer,
	AsciiSceneFactory,
} from '@/lib/ascii/grid'
import { type Inks, readInks, rgba } from '@/lib/ink'
import { fitCanvas, useAmbientLoop } from '@/lib/use-ambient-loop'

const cellWidth = 6

const cellHeight = 9

const revealSeconds = 1.2

// JetBrains Mono glyphs fill their cell, so draw them below cell height to leave air between rows.
const glyphScale = 0.8

const fontWeight = 500

// Terminal-style scenes need fixed-width glyphs so columns line up. Matches --font-glyph in styles.css.
const fontFamily = "'JetBrains Mono Variable', ui-monospace, monospace"

interface Buffers extends AsciiGrid {
	/** Per-cell reveal order, so glyphs arrive scattered instead of as a wipe. */
	order: Float32Array
}

function createBuffers(columns: number, rows: number): Buffers {
	const order = new Float32Array(columns * rows)

	for (let i = 0; i < order.length; i++) {
		order[i] = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
	}

	return {
		columns,
		rows,
		glyphs: new Uint16Array(columns * rows),
		accent: new Uint8Array(columns * rows),
		order,
	}
}

/** A character-grid scene drawn in the page inks. */
export function AsciiStage({
	scene: createScene,
	className,
}: {
	scene: AsciiSceneFactory
	className?: string
}) {
	const scene = useMemo(() => createScene(), [createScene])
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const inksRef = useRef<Inks>(null)
	const buffersRef = useRef<Buffers>(null)
	const pointerRef = useRef<AsciiPointer>({ column: 0, row: 0, active: false })
	const cellRef = useRef({ width: cellWidth, height: cellHeight })
	const revealStartRef = useRef<number>(null)

	useEffect(() => {
		inksRef.current = readInks()
		const canvas = canvasRef.current

		if (!canvas) return
		const pointer = pointerRef.current

		const onMove = (event: PointerEvent) => {
			const rect = canvas.getBoundingClientRect()
			const x = event.clientX - rect.left
			const y = event.clientY - rect.top
			pointer.column = x / cellRef.current.width
			pointer.row = y / cellRef.current.height
			pointer.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
		}

		const onLeave = () => {
			pointer.active = false
		}

		window.addEventListener('pointermove', onMove, { passive: true })
		document.addEventListener('pointerleave', onLeave)

		return () => {
			window.removeEventListener('pointermove', onMove)
			document.removeEventListener('pointerleave', onLeave)
		}
	}, [])

	const redraw = useAmbientLoop(canvasRef, (seconds) => {
		const canvas = canvasRef.current
		const inks = inksRef.current
		const context = canvas?.getContext('2d')

		if (!canvas || !inks || !context) return

		const dpr = fitCanvas(canvas)
		const width = canvas.clientWidth
		const height = canvas.clientHeight
		// Narrow stages use smaller cells so the scene keeps its resolution.
		const scale = Math.min(Math.max(width / 440, 0.75), 1)
		const cellW = cellWidth * scale
		const cellH = cellHeight * scale
		cellRef.current = { width: cellW, height: cellH }
		const columns = Math.floor(width / cellW)
		const rows = Math.floor(height / cellH)

		if (columns < 1 || rows < 1) return

		let buffers = buffersRef.current

		if (!buffers || buffers.columns !== columns || buffers.rows !== rows) {
			buffers = createBuffers(columns, rows)
			buffersRef.current = buffers
		}

		const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		const pointer = still
			? { column: 0, row: 0, active: false }
			: pointerRef.current

		scene.draw(buffers, still ? 8 : seconds, pointer)

		revealStartRef.current ??= seconds

		const reveal = still
			? 1
			: Math.min((seconds - revealStartRef.current) / revealSeconds, 1)

		context.setTransform(dpr, 0, 0, dpr, 0, 0)
		context.clearRect(0, 0, width, height)
		context.font = `${fontWeight} ${cellH * glyphScale}px ${fontFamily}`
		context.textAlign = 'center'
		context.textBaseline = 'middle'
		const ink = rgba(inks.ink)
		const pink = rgba(inks.pink)
		const offsetX = (width - columns * cellW) / 2
		const offsetY = (height - rows * cellH) / 2

		for (let row = 0; row < rows; row++) {
			for (let column = 0; column < columns; column++) {
				const index = row * columns + column
				const glyph = buffers.glyphs[index]!

				if (!glyph || buffers.order[index]! > reveal * 1.15 - 0.15) continue
				context.fillStyle = buffers.accent[index] ? pink : ink
				context.fillText(
					String.fromCharCode(glyph),
					offsetX + column * cellW + cellW / 2,
					offsetY + row * cellH + cellH / 2,
				)
			}
		}
	})

	// The reduced-motion still draws once, so draw it again when the self-hosted font arrives.
	useEffect(() => {
		void document.fonts
			.load(`${fontWeight} ${cellHeight}px ${fontFamily}`)
			.then(redraw)
	}, [redraw])

	return (
		<canvas ref={canvasRef} aria-hidden className={cn('block', className)} />
	)
}
