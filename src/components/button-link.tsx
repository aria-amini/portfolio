import type { VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type { ComponentProps } from 'react'

import { buttonVariants } from '@/components/ui/button'

type ButtonStyle = VariantProps<typeof buttonVariants>

export function ButtonLink({
	variant,
	size,
	className,
	children,
	...props
}: ComponentProps<'a'> & ButtonStyle) {
	return (
		<a
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		>
			{children}
		</a>
	)
}
