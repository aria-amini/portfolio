import { spawnSync } from 'node:child_process'
import { basename, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

const checkout = basename(root)

const slug =
	checkout === 'portfolio'
		? checkout
		: `portfolio-${checkout.replace(/^portfolio[.-]/, '')}`
				.replaceAll(/[^a-zA-Z0-9-]/g, '-')
				.toLowerCase()

function run(command: string, args: string[], capture = false): string {
	const result = spawnSync(command, args, {
		cwd: root,
		encoding: 'utf8',
		stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
	})

	if (result.error) throw result.error

	if (result.status !== 0) {
		throw new Error(`${command} failed (${result.signal ?? result.status})`)
	}

	return result.stdout?.trim() ?? ''
}

async function bootstrap() {
	run('vp', ['install'])
	run('pitchfork', ['settings', 'set', 'proxy.enable', 'true', '--global'])
	run('pitchfork', ['proxy', 'add', slug, '--daemon', 'dev', '--dir', root])
	run('pitchfork', ['start', 'dev'])

	const tld = run('pitchfork', ['settings', 'get', 'proxy.tld'], true)
	const url = `https://${slug}.${tld}`
	const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
	const html = await response.text()

	if (!response.ok || !html.includes('id="intro-title"')) {
		throw new Error(`${url} did not return the portfolio page`)
	}

	console.log(`Portfolio ready: ${url}`)
}

try {
	await bootstrap()
} catch (error) {
	console.error(error)
	process.exitCode = 1
}
