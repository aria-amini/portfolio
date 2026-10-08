import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { jobs } from '@/lib/profile'

export function ExperiencePanel() {
	return (
		<Card className="self-start">
			<CardHeader>
				<CardTitle>Experience</CardTitle>
			</CardHeader>
			<CardContent>
				<ul>
					{jobs.map((job) => (
						<li key={job.company}>
							<Separator />
							<div className="flex items-center gap-3.5 py-4">
								<img src={job.logo} alt="" className="size-7 object-contain" />
								<div>
									<strong className="block text-sm font-medium">
										{job.role}
									</strong>
									<span className="text-muted-foreground text-xs">
										{job.company}
									</span>
									<time className="text-muted-foreground mt-1 block text-xs">
										{job.period}
									</time>
								</div>
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	)
}
