import { cn } from 'cn'
import { useEffect, useState } from 'react'

// Chrysler on the left, Empire State in the middle.
const skyline = [
	'               |             ',
	'        /\\    _|_            ',
	'   __  |::|  |:::|     _     ',
	'  |::| |::|  |:::| __ |:|    ',
	'_ |::|_|::|__|:::||::||:| __ ',
	':||::|:|::|::|:::||::||:||::|',
]

const litEvery = 6

const nycTime = new Intl.DateTimeFormat('en-US', {
	timeZone: 'America/New_York',
	hour: 'numeric',
	minute: '2-digit',
})

function readNycTime() {
	const parts = nycTime.formatToParts(new Date())

	const part = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((entry) => entry.type === type)?.value ?? ''

	return {
		hour: part('hour'),
		minute: part('minute'),
		period: part('dayPeriod'),
	}
}

/** Local time in New York. Server HTML has no time, so the clock fills in after hydration. */
function NycClock({ className }: { className?: string }) {
	const [time, setTime] = useState<ReturnType<typeof readNycTime>>()

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>

		const tick = () => {
			setTime(readNycTime())
			timer = setTimeout(tick, 60_000 - (Date.now() % 60_000))
		}

		tick()

		return () => clearTimeout(timer)
	}, [])

	return (
		<p
			className={cn(
				'label-mono text-muted-foreground whitespace-nowrap tabular-nums',
				className,
			)}
		>
			<span className="text-foreground">NYC</span>{' '}
			{time ? (
				<time className="fade-in">
					{time.hour}
					<span className="clock-tick">:</span>
					{time.minute} {time.period}
				</time>
			) : (
				<span className="invisible">0:00 AM</span>
			)}
		</p>
	)
}

/** Manhattan in ASCII, standing on the header rule. A few windows light up at random. */
function Skyline() {
	let windows = 0

	return (
		<pre
			aria-hidden
			className="font-glyph text-glyph text-muted-foreground font-semibold"
		>
			{skyline.map((row, rowIndex) => (
				<span key={rowIndex} className="block">
					{Array.from(row, (glyph, column) => {
						if (glyph !== ':') return glyph
						windows++

						if (windows % litEvery !== 0) return glyph

						return (
							<span
								key={column}
								className="window-light"
								style={{ '--light-delay': `${-((windows * 1.7) % 9)}s` }}
							>
								{glyph}
							</span>
						)
					})}
				</span>
			))}
		</pre>
	)
}

export function NycSkyline({ className }: { className?: string }) {
	return (
		<div className={cn('flex items-end gap-3', className)}>
			{/* Phones have room for the clock but not the skyline. */}
			<div className="hidden sm:block">
				<Skyline />
			</div>
			<NycClock className="self-center" />
		</div>
	)
}
