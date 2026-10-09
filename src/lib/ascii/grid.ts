/** A frame of character cells. A glyph of 0 leaves the cell empty. */
export interface AsciiGrid {
	columns: number
	rows: number
	glyphs: Uint16Array
	accent: Uint8Array
}

/** Cursor position in cell units. */
export interface AsciiPointer {
	column: number
	row: number
	active: boolean
}

interface AsciiScene {
	/** Draws the frame at `seconds`. Scenes reset their own state when the grid size changes. */
	draw(grid: AsciiGrid, seconds: number, pointer: AsciiPointer): void
}

export type AsciiSceneFactory = () => AsciiScene

export function clearGrid(grid: AsciiGrid) {
	grid.glyphs.fill(0)
	grid.accent.fill(0)
}

export function put(
	grid: AsciiGrid,
	column: number,
	row: number,
	glyph: string,
	accent = false,
) {
	if (column < 0 || row < 0 || column >= grid.columns || row >= grid.rows)
		return
	const index = row * grid.columns + column
	grid.glyphs[index] = glyph === ' ' ? 0 : glyph.charCodeAt(0)
	grid.accent[index] = accent ? 1 : 0
}
