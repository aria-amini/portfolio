export type Rgb = readonly [number, number, number]

export interface Inks {
	paper: Rgb
	ink: Rgb
	pink: Rgb
	yellow: Rgb
	blue: Rgb
}

/** Resolves theme tokens to sRGB bytes, so canvas and WebGL draw with the same inks as CSS. */
export function readInks(element: Element = document.documentElement): Inks {
	const style = getComputedStyle(element)

	const probe = document.createElement('canvas').getContext('2d', {
		willReadFrequently: true,
	})

	function resolve(token: string): Rgb {
		if (!probe) return [0, 0, 0]
		probe.clearRect(0, 0, 1, 1)
		probe.fillStyle = style.getPropertyValue(token).trim()
		probe.fillRect(0, 0, 1, 1)
		const [r = 0, g = 0, b = 0] = probe.getImageData(0, 0, 1, 1).data

		return [r, g, b]
	}

	return {
		paper: resolve('--background'),
		ink: resolve('--foreground'),
		pink: resolve('--primary'),
		yellow: resolve('--secondary'),
		blue: resolve('--shadow-color'),
	}
}

export function rgba([r, g, b]: Rgb, alpha = 1) {
	return `rgb(${r} ${g} ${b} / ${alpha})`
}
