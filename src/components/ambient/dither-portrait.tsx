import { ditherPhotoSrc, ditherPrintSrc } from '@/lib/dither-print'

/** The portrait as a prebuilt one-ink dither print. Hover reveals the photo. */
export function DitherPortrait() {
	return (
		<span className="group/dither relative block size-full">
			<img
				src={ditherPrintSrc}
				alt=""
				width={96}
				height={96}
				fetchPriority="high"
				className="halftone-develop size-full [image-rendering:pixelated]"
			/>
			<img
				src={ditherPhotoSrc}
				alt=""
				width={96}
				height={96}
				loading="lazy"
				className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover/dither:opacity-100"
			/>
		</span>
	)
}
