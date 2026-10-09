import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { jobs, yearsOfExperience } from '@/lib/profile'

export function ExperiencePanel() {
	return (
		<Card className="self-start">
			<CardHeader>
				<CardTitle>
					Experience{' '}
					<span className="text-muted-foreground font-normal">
						({yearsOfExperience} yoe)
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ul>
					{jobs.map((job) => (
						<li key={job.company}>
							<Separator />
							<div className="flex items-start gap-3.5 py-4">
								<img
									src={job.logo}
									alt=""
									className="mt-0.5 size-7 shrink-0 object-contain"
								/>
								<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-baseline justify-between gap-x-4">
										<div>
											<strong className="block text-sm font-medium">
												{job.role}
											</strong>
											<span className="text-muted-foreground text-xs">
												{job.company}
											</span>
										</div>
										<time className="text-muted-foreground text-xs">
											{job.period}
										</time>
									</div>
									<ul className="text-muted-foreground mt-2 list-disc pl-4 text-xs leading-5">
										<li>{job.highlight}</li>
									</ul>
								</div>
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	)
}
