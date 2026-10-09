import { type RefObject, useCallback, useEffect, useRef } from 'react'

import { useBrowserLayoutEffect } from '@/lib/use-browser-layout-effect'

/**
 * Runs `frame` at most `fps` times per second while the element is on screen
 * and the tab is visible. Time pauses while hidden, so motion resumes where it
 * stopped. With reduced motion, `frame` runs once per resize as a still image.
 * Call the returned `redraw` when the drawn source changes outside the loop.
 */
export function useAmbientLoop(
	ref: RefObject<HTMLElement | null>,
	frame: (seconds: number) => void,
	fps = 30,
) {
	const frameRef = useRef(frame)
	const elapsedRef = useRef(0)

	useBrowserLayoutEffect(() => {
		frameRef.current = frame
	})

	useEffect(() => {
		const element = ref.current

		if (!element) return

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
		let onScreen = true
		let handle = 0
		let last = 0

		function tick(now: number) {
			handle = requestAnimationFrame(tick)
			const delta = now - last

			if (delta < 1000 / fps - 2) return
			// Clamp so a long stall does not jump the animation forward.
			elapsedRef.current += Math.min(delta, 100) / 1000
			last = now
			frameRef.current(elapsedRef.current)
		}

		function sync() {
			cancelAnimationFrame(handle)
			handle = 0

			if (reducedMotion.matches) {
				frameRef.current(elapsedRef.current)

				return
			}

			if (onScreen && document.visibilityState === 'visible') {
				last = performance.now()
				frameRef.current(elapsedRef.current)
				handle = requestAnimationFrame(tick)
			}
		}

		const visibility = new IntersectionObserver(([entry]) => {
			onScreen = entry?.isIntersecting ?? true
			sync()
		})

		const resize = new ResizeObserver(() => {
			if (!handle) frameRef.current(elapsedRef.current)
		})

		visibility.observe(element)
		resize.observe(element)
		document.addEventListener('visibilitychange', sync)
		reducedMotion.addEventListener('change', sync)
		sync()

		return () => {
			cancelAnimationFrame(handle)
			visibility.disconnect()
			resize.disconnect()
			document.removeEventListener('visibilitychange', sync)
			reducedMotion.removeEventListener('change', sync)
		}
	}, [ref, fps])

	return useCallback(() => frameRef.current(elapsedRef.current), [])
}

/** Matches the canvas backing store to its CSS size. Returns the device pixel ratio used. */
export function fitCanvas(canvas: HTMLCanvasElement, maxDpr = 2) {
	const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
	const width = Math.round(canvas.clientWidth * dpr)
	const height = Math.round(canvas.clientHeight * dpr)

	if (canvas.width !== width || canvas.height !== height) {
		canvas.width = width
		canvas.height = height
	}

	return dpr
}
