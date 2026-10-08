import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr'

import { ButtonLink } from '@/components/button-link'
import { Badge } from '@/components/ui/badge'
import { project } from '@/lib/profile'

export function SelectedWork() {
	return (
		<section id="work" aria-labelledby="work-title" className="py-12">
			<h2 id="work-title" className="mb-6 text-2xl">
				Selected work
			</h2>
			<div className="grid items-center gap-8 lg:grid-cols-[3fr_2fr]">
				<a
					href={project.exampleUrl}
					aria-label="Explore Breaking Bad episode ratings on IMDbGraph"
					className="group bg-card block overflow-hidden rounded-xl border"
				>
					<img
						src={project.preview}
						width={1400}
						height={1000}
						alt={project.previewAlt}
						loading="lazy"
					/>
					<span className="text-muted-foreground group-hover:text-primary label-mono block border-t p-3">
						Live product · Breaking Bad episode ratings ↗
					</span>
				</a>
				<article>
					<p className="text-muted-foreground label-mono mb-2">
						{project.kind}
					</p>
					<h3 className="text-xl">{project.name}</h3>
					<p className="text-muted-foreground mt-2 leading-7">
						{project.summary}
					</p>
					<ul className="mt-4 flex flex-wrap gap-2">
						{project.stack.map((tech) => (
							<li key={tech}>
								<Badge variant="secondary">{tech}</Badge>
							</li>
						))}
					</ul>
					<div className="mt-5 flex flex-wrap items-center gap-3">
						<ButtonLink href={project.liveUrl}>
							Try {project.name} <ArrowUpRightIcon />
						</ButtonLink>
						<ButtonLink variant="link" href={project.sourceUrl}>
							View source ↗
						</ButtonLink>
					</div>
				</article>
			</div>
		</section>
	)
}
