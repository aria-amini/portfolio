import type { Plugin } from 'vite'

import {
	buildResume,
	compileResume,
	resumeDir,
	resumeFileName,
} from './compile.ts'

/**
 * Serves the resume PDF in dev and emits it into the client build. Dev
 * compiles on every request (about 10 ms), so the dialog always shows the
 * latest resume.yaml.
 */
export function resumePlugin(): Plugin {
	return {
		name: 'resume-pdf',
		applyToEnvironment: (environment) => environment.name === 'client',

		configureServer(server) {
			server.watcher.add(resumeDir)
			server.watcher.on('change', (file) => {
				if (!file.startsWith(resumeDir)) return

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

		generateBundle() {
			this.emitFile({
				type: 'asset',
				fileName: resumeFileName,
				source: compileResume(),
			})
		},
	}
}
