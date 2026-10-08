import { MonitorIcon, MoonIcon, SunIcon } from '@phosphor-icons/react/dist/ssr'
import { cn } from 'cn'
import {
	createContext,
	useContext,
	useState,
	type ComponentType,
	type ReactNode,
} from 'react'

import {
	applyThemeToDocument,
	getThemePreference,
	writeThemeCookie,
	type Theme,
	type ThemePreference,
} from '@/lib/theme'
import { useBrowserLayoutEffect } from '@/lib/use-browser-layout-effect'

const ThemeContext = createContext<{
	preference: ThemePreference
	setThemePreference: (preference: ThemePreference) => void
} | null>(null)

export function ThemeProvider({
	preference: serverPreference,
	children,
}: {
	preference: Theme | null
	children: ReactNode
}) {
	const [preference, setPreference] = useState<ThemePreference>(
		serverPreference ?? 'system',
	)

	useBrowserLayoutEffect(() => {
		// Adopt a cookie that the bootstrap script migrated from legacy storage.
		const stored = getThemePreference()

		if (stored) setPreference(stored)
	}, [])

	useBrowserLayoutEffect(() => {
		const media = matchMedia('(prefers-color-scheme: dark)')

		const apply = () =>
			applyThemeToDocument(
				preference === 'system'
					? media.matches
						? 'dark'
						: 'light'
					: preference,
			)

		apply()

		if (preference !== 'system') return

		media.addEventListener('change', apply)

		return () => media.removeEventListener('change', apply)
	}, [preference])

	function setThemePreference(next: ThemePreference) {
		writeThemeCookie(next)
		setPreference(next)
	}

	return (
		<ThemeContext value={{ preference, setThemePreference }}>
			{children}
		</ThemeContext>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)

	if (!context) throw new Error('useTheme must be used within ThemeProvider')

	return context
}

const options: {
	value: ThemePreference
	label: string
	Icon: ComponentType<{ className?: string; weight?: 'bold' }>
}[] = [
	{ value: 'system', label: 'System theme', Icon: MonitorIcon },
	{ value: 'light', label: 'Light theme', Icon: SunIcon },
	{ value: 'dark', label: 'Dark theme', Icon: MoonIcon },
]

export function ThemeSwitch({ className }: { className?: string }) {
	const { preference, setThemePreference } = useTheme()

	return (
		<fieldset
			className={cn(
				'bg-card m-0 flex min-w-0 items-center gap-0.5 border p-0.5 shadow-sm',
				className,
			)}
		>
			<legend className="sr-only">Theme</legend>
			{options.map(({ value, label, Icon }) => (
				<button
					key={value}
					type="button"
					aria-label={label}
					aria-pressed={preference === value}
					onClick={() => setThemePreference(value)}
					className={cn(
						'focus-visible:ring-ring/50 grid size-8 place-items-center outline-none focus-visible:ring-3',
						preference === value
							? 'bg-primary text-primary-foreground'
							: 'text-muted-foreground hover:text-foreground',
					)}
				>
					<Icon aria-hidden className="size-4" weight="bold" />
				</button>
			))}
		</fieldset>
	)
}
