import { spawnSync } from 'node:child_process'
import { basename, resolve } from 'node:path'
import { setTimeout } from 'node:timers/promises'

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
	const args = process.argv.slice(2)

	if (
		args.length > 1 ||
		(args[0] && !['--verbose', '--help'].includes(args[0]))
	) {
		console.error('Usage: mise run bootstrap [--verbose]')
		process.exitCode = 2

		return
	}

	if (args[0] === '--help') {
		console.log('Usage: mise run bootstrap [--verbose]')

		return
	}

	const verbose = args[0] === '--verbose'

	const appName = run(
		'gum',
		['style', '--bold', '--foreground', '212', basename(root)],
		true,
	)

	run('gum', [
		'style',
		'--border',
		'double',
		'--border-foreground',
		'212',
		'--padding',
		'1 3',
		'--margin',
		'1 0',
		'--align',
		'center',
		'--width',
		'44',
		appName,
		'workspace bootstrap',
	])

	function complete(title: string) {
		run('gum', ['style', '--foreground', '82', `  ✓ ${title}`])
	}

	function step(title: string, command: string, commandArgs: string[]) {
		if (verbose) {
			console.log(`  ${title}`)
			run(command, commandArgs)
		} else {
			run('gum', [
				'spin',
				'--show-error',
				'--title',
				`  ${title}...`,
				'--',
				command,
				...commandArgs,
			])
		}

		complete(title)
	}

	step('Install tools (mise i)', 'mise', ['install'])
	step('Install packages (vp i)', 'vp', ['install'])
	step('Enable dev proxy', 'pitchfork', [
		'settings',
		'set',
		'proxy.enable',
		'true',
		'--global',
	])
	step('Register workspace URL', 'pitchfork', [
		'proxy',
		'add',
		slug,
		'--daemon',
		'dev',
		'--dir',
		root,
	])
	step('Start dev daemon', 'pitchfork', ['start', 'dev'])

	const tld = run('pitchfork', ['settings', 'get', 'proxy.tld'], true)
	const url = `https://${slug}.${tld}`

	async function poll(): Promise<boolean> {
		for (let attempt = 0; attempt < 30; attempt++) {
			try {
				const response = await fetch(url, {
					signal: AbortSignal.timeout(5_000),
				})

				const html = await response.text()

				if (response.ok && html.includes('id="intro-title"')) return true
			} catch {
				// The daemon can pass its port probe before the first route is ready.
			}

			if (attempt < 29) await setTimeout(1_000)
		}

		return false
	}

	if (!(await poll())) {
		step('Restart stale dev daemon', 'pitchfork', ['restart', 'dev', '--force'])

		if (!(await poll()))
			throw new Error(`${url} did not return the portfolio page`)
	}

	complete('Verify portfolio page')

	const heading = run(
		'gum',
		['style', '--bold', '--foreground', '82', '✓ Bootstrap complete'],
		true,
	)

	const details = run(
		'gum',
		['style', '--foreground', '39', `Portfolio ready: ${url}`],
		true,
	)

	run('gum', [
		'style',
		'--border',
		'rounded',
		'--border-foreground',
		'82',
		'--padding',
		'0 3',
		'--margin',
		'1 0',
		heading,
		details,
	])
}

try {
	await bootstrap()
} catch (error) {
	console.error(
		`✗ Bootstrap failed: ${error instanceof Error ? error.message : String(error)}`,
	)
	process.exitCode = 1
}
