import { join } from 'node:path'

import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler'

export const resumeDir = import.meta.dirname

export const resumeFileName = 'aria-amini-resume.pdf'

export const resumePreviewFileName = 'aria-amini-resume.svg'

const maxPages = 1

interface Diagnostic {
	message: string
	path?: string
}

function describe(diagnostics: Diagnostic[] | undefined) {
	return (diagnostics ?? [])
		.map(({ message, path }) => (path ? `${path}: ${message}` : message))
		.join('\n')
}

export type ResumeBuild =
	| { ok: true; pdf: Buffer; preview: string }
	| { ok: false; message: string }

/**
 * Compiles resume.typ to a PDF. Fails on errors, on warnings (an unknown font
 * family is only a warning), and when the layout overflows one page.
 */
export function buildResume(): ResumeBuild {
	const compiler = NodeCompiler.create({
		workspace: resumeDir,
		fontArgs: [{ fontPaths: [join(resumeDir, 'fonts')] }],
	})

	const result = compiler.compile({
		mainFilePath: join(resumeDir, 'resume.typ'),
	})

	const errors = result.takeDiagnostics()?.shortDiagnostics
	const document = result.result

	if (!document) {
		return {
			ok: false,
			message: `Resume failed to compile:\n${describe(errors)}`,
		}
	}

	const warnings = result.takeWarnings()?.shortDiagnostics

	if (warnings?.length) {
		return {
			ok: false,
			message: `Resume compiled with warnings:\n${describe(warnings)}`,
		}
	}

	if (document.numOfPages > maxPages) {
		return {
			ok: false,
			message: `Resume is ${document.numOfPages} pages; the limit is ${maxPages}. Shorten resume.yaml.`,
		}
	}

	return {
		ok: true,
		pdf: compiler.pdf(document),
		preview: compiler.plainSvg(document),
	}
}

export function compileResume() {
	const build = buildResume()

	if (!build.ok) throw new Error(build.message)

	return build.pdf
}
