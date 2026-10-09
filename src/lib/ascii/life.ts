import { type AsciiSceneFactory, clearGrid, put } from '@/lib/ascii/grid'

type Pattern = readonly string[]

// Fires a glider toward the bottom right every 30 generations.
const gosperGun: Pattern = [
	'........................O...........',
	'......................O.O...........',
	'............OO......OO............OO',
	'...........O...O....OO............OO',
	'OO........O.....O...OO..............',
	'OO........O...O.OO....O.O...........',
	'..........O.....O.......O...........',
	'...........O...O....................',
	'............OO......................',
]

const generationsPerSecond = 15

const ghostGenerations = 3

// Gliders that leave the stage die in this off-screen border instead of wrapping back in.
const margin = 8

// Glider collisions eventually wreck the guns, so the field starts over on a fixed period.
const reseedSeconds = 75

// After the cursor stirs the field, let the chaos play out, then reseed.
const reseedAfterStirSeconds = 20

/** Conway's Game of Life: Gosper guns fire glider streams that cross and collide mid-stage. The cursor seeds new cells. */
export const createLifeGunsScene: AsciiSceneFactory = () => {
	let columns = 0
	let rows = 0
	let width = 0
	let height = 0
	let cells = new Uint8Array(0)
	let next = new Uint8Array(0)
	let ghosts = new Uint8Array(0)
	let born = new Uint8Array(0)
	let generation = 0
	let lastStirred = -Infinity
	let lastSeeded = 0

	function set(column: number, row: number) {
		const x = column + margin
		const y = row + margin

		if (x >= 0 && y >= 0 && x < width && y < height) cells[y * width + x] = 1
	}

	function stamp(
		pattern: Pattern,
		left: number,
		top: number,
		flip: { x?: boolean; y?: boolean } = {},
	) {
		pattern.forEach((line, dy) => {
			for (let dx = 0; dx < line.length; dx++) {
				if (line[dx] !== 'O') continue
				set(
					left + (flip.x ? line.length - 1 - dx : dx),
					top + (flip.y ? pattern.length - 1 - dy : dy),
				)
			}
		})
	}

	function seed(seconds: number) {
		cells.fill(0)
		ghosts.fill(0)
		born.fill(0)

		const gunWidth = gosperGun[0]!.length
		const gunHeight = gosperGun.length
		const right = columns - gunWidth
		const bottom = rows - gunHeight

		stamp(gosperGun, 0, 0)
		stamp(gosperGun, right, 0, { x: true })

		// Tall stages get a second pair that fires upward into the same crossfire.
		if (rows >= gunHeight * 2 + 12) {
			stamp(gosperGun, 0, bottom, { y: true })
			stamp(gosperGun, right, bottom, { x: true, y: true })
		}

		lastSeeded = seconds
	}

	function at(x: number, y: number) {
		if (x < 0 || y < 0 || x >= width || y >= height) return 0

		return cells[y * width + x]!
	}

	function step() {
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const neighbours =
					at(x - 1, y - 1) +
					at(x, y - 1) +
					at(x + 1, y - 1) +
					at(x - 1, y) +
					at(x + 1, y) +
					at(x - 1, y + 1) +
					at(x, y + 1) +
					at(x + 1, y + 1)

				const index = y * width + x
				const alive = cells[index]!
				const edge = x < 2 || y < 2 || x >= width - 2 || y >= height - 2

				const lives =
					!edge && (neighbours === 3 || (alive === 1 && neighbours === 2))

				next[index] = lives ? 1 : 0
				born[index] = lives && !alive ? 1 : 0
				ghosts[index] =
					alive && !lives ? ghostGenerations : Math.max(ghosts[index]! - 1, 0)
			}
		}

		;[cells, next] = [next, cells]
	}

	return {
		draw(grid, seconds, pointer) {
			if (grid.columns !== columns || grid.rows !== rows) {
				columns = grid.columns
				rows = grid.rows
				width = columns + margin * 2
				height = rows + margin * 2
				cells = new Uint8Array(width * height)
				next = new Uint8Array(width * height)
				ghosts = new Uint8Array(width * height)
				born = new Uint8Array(width * height)
				generation = Math.floor(seconds * generationsPerSecond)
				seed(seconds)
			}

			if (pointer.active) {
				const column = Math.floor(pointer.column)
				const row = Math.floor(pointer.row)

				if (column >= 0 && row >= 0 && column < columns && row < rows) {
					for (let i = 0; i < 3; i++) {
						set(
							column + Math.floor(Math.random() * 3) - 1,
							row + Math.floor(Math.random() * 3) - 1,
						)
					}

					lastStirred = seconds
				}
			}

			const target = Math.floor(seconds * generationsPerSecond)

			// Cap catch-up work after the tab was hidden.
			for (let i = 0; i < 4 && generation < target; i++, generation++) step()
			generation = Math.max(generation, target)

			const stirredLongAgo =
				lastStirred > 0 && seconds - lastStirred > reseedAfterStirSeconds

			if (
				stirredLongAgo ||
				seconds - lastSeeded > reseedSeconds ||
				!cells.includes(1)
			) {
				lastStirred = -Infinity
				seed(seconds)
			}

			clearGrid(grid)

			for (let row = 0; row < rows; row++) {
				for (let column = 0; column < columns; column++) {
					const index = (row + margin) * width + column + margin

					if (cells[index]) put(grid, column, row, '@', born[index] === 1)
					else if (ghosts[index])
						put(grid, column, row, ghosts[index]! > 1 ? ':' : '.')
				}
			}
		},
	}
}
