import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr'

import { RouterButtonLink } from '@/components/button-link'
import { CopyEmailButton } from '@/components/copy-email-button'
import { ExperiencePanel } from '@/components/experience-panel'
import { profile } from '@/lib/profile'

export function Hero() {
	return (
		<section
			aria-labelledby="intro-title"
			className="grid gap-10 py-12 lg:grid-cols-[1fr_20rem]"
		>
			<div>
				<div className="mb-6 flex items-center gap-5">
					<img
						src="/aria-amini.jpg"
						alt={profile.name}
						width={96}
						height={96}
						fetchPriority="high"
						className="size-24 shrink-0 rounded-full border object-cover"
					/>
					<h1 id="intro-title" className="text-4xl sm:text-5xl">
						{profile.name}
						<em className="text-primary mt-2 block font-serif text-3xl font-normal">
							{profile.title}
						</em>
					</h1>
				</div>
				<p className="text-muted-foreground max-w-md leading-7">
					{profile.intro}
				</p>
				<div className="mt-6 flex flex-wrap gap-3">
					<RouterButtonLink size="lg" to="/" search={{ dialog: 'resume' }}>
						View résumé <ArrowUpRightIcon />
					</RouterButtonLink>
					<RouterButtonLink
						size="lg"
						variant="outline"
						to="/"
						search={{ dialog: 'schedule' }}
					>
						Schedule a call <ArrowUpRightIcon />
					</RouterButtonLink>
				</div>
				<div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
					<a
						href={`mailto:${profile.email}`}
						className="hover:text-primary underline-offset-4 hover:underline"
					>
						{profile.email}
					</a>
					<CopyEmailButton />
					<a
						href={profile.linkedin}
						className="hover:text-primary underline-offset-4 hover:underline"
					>
						LinkedIn ↗
					</a>
				</div>
			</div>
			<ExperiencePanel />
		</section>
	)
}
