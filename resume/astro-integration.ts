import { writeFile } from 'node:fs/promises'

import type { AstroIntegration } from 'astro'

import {
	buildResume,
	compileResume,
	resumeDir,
	resumeFileName,
} from './compile.ts'

const rebuildEvents = new Set(['add', 'change', 'unlink'])

export function resumeIntegration(): AstroIntegration {
	return {
		name: 'resume-pdf',
		hooks: {
			'astro:server:setup': ({ server }) => {
				server.watcher.add(resumeDir)
				server.watcher.on('all', (event, file) => {
					if (!rebuildEvents.has(event) || !file.startsWith(resumeDir)) return

					const build = buildResume()
					server.ws.send(
						build.ok
							? { type: 'full-reload' }
							: { type: 'error', err: { message: build.message, stack: '' } },
					)
				})

				server.middlewares.use(`/${resumeFileName}`, (_request, response) => {
					const build = buildResume()

					if (!build.ok) {
						response.statusCode = 500
						response.setHeader('Content-Type', 'text/plain; charset=utf-8')
						response.end(build.message)

						return
					}

					response.setHeader('Content-Type', 'application/pdf')
					response.setHeader('Cache-Control', 'no-store')
					response.end(build.pdf)
				})
			},
			'astro:build:done': async ({ dir }) => {
				await writeFile(new URL(resumeFileName, dir), compileResume())
			},
		},
	}
}
