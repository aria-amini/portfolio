import {
	ArrowUpRightIcon,
	GithubLogoIcon,
} from '@phosphor-icons/react/dist/ssr'

import { ButtonLink } from '@/components/button-link'
import { project } from '@/lib/profile'

export function SelectedWork() {
	return (
		<section id="projects" aria-labelledby="projects-title" className="py-12">
			<h2 id="projects-title" className="mb-6 text-3xl">
				Side projects
			</h2>
			<div className="grid items-center gap-8 lg:grid-cols-[2fr_3fr]">
				<a
					href={project.exampleUrl}
					target="_blank"
					rel="noreferrer"
					aria-label="Explore Breaking Bad episode ratings on imdbgraph.org"
					className="group bg-card ink-shadow block rounded-xl border p-2"
				>
					<img
						src={project.preview}
						width={1400}
						height={1000}
						alt={project.previewAlt}
						loading="lazy"
						className="ring-border/30 rounded-md ring-1"
					/>
				</a>
				<article>
					<h3 className="text-xl">{project.name}</h3>
					<p className="text-muted-foreground mt-2 leading-7">
						{project.summary}
					</p>
					<div className="mt-6 flex flex-wrap items-center gap-3">
						<ButtonLink href={project.liveUrl} target="_blank" rel="noreferrer">
							Visit Site <ArrowUpRightIcon />
						</ButtonLink>
						<ButtonLink variant="link" href={project.sourceUrl}>
							<GithubLogoIcon data-icon="inline-start" />
							View Source Code
						</ButtonLink>
					</div>
				</article>
			</div>
		</section>
	)
}
