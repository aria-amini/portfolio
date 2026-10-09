import { cn } from 'cn'

const patches = [
	['bg-secondary'],
	['bg-primary'],
	['bg-[var(--shadow-color)]'],
	['bg-secondary', 'bg-primary'],
	['bg-primary', 'bg-[var(--shadow-color)]'],
	['bg-secondary', 'bg-[var(--shadow-color)]'],
	['bg-foreground'],
	['bg-primary/20'],
	['bg-primary/40'],
	['bg-primary/60'],
	['bg-primary/80'],
	['bg-primary'],
] as const

/** Press-check color bar: solid, overprint, and tint patches with a densitometer stepping across them. */
export function ColorBar({ className }: { className?: string }) {
	return (
		<div
			aria-hidden
			className={cn('relative flex', className)}
			style={{ '--patches': patches.length }}
		>
			{patches.map((inks, index) => (
				<span key={index} className="relative size-3.5 sm:size-4">
					{inks.map((ink) => (
						<span
							key={ink}
							className={cn('absolute inset-0 mix-blend-multiply', ink)}
						/>
					))}
				</span>
			))}
			<span className="densitometer border-foreground absolute -inset-y-1 left-0 w-3.5 rounded-xs border sm:w-4" />
		</div>
	)
}
