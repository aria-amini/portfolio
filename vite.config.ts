import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { fmt, lint, mergeToolkitConfig } from '@aamini/config/vite-plus'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'

const root = import.meta.dirname

export default defineConfig(
	mergeToolkitConfig(
		{ fmt, lint: lint('react') },
		{
			staged: {
				'*': 'vp check --fix',
			},
			root,
			// Pre-bundle the browser test stack at startup; without this each dep is
			// discovered lazily mid-run, and the re-optimization reload aborts
			// whichever test file is loading.
			optimizeDeps: {
				include: ['vite-plus/test', 'vite-plus/test/browser'],
			},
			server: { host: '127.0.0.1', port: Number(process.env.APP_PORT ?? 3000) },
			resolve: {
				tsconfigPaths: true,
				dedupe: ['react', 'react-dom'],
				alias: [
					{ find: '@/mocks', replacement: resolve(root, '__mocks__') },
					{ find: '@', replacement: resolve(root, 'src') },
					{ find: '@tests', replacement: resolve(root, 'tests') },
				],
			},
			plugins: [tailwindcss(), viteReact()],
			fmt: { ignorePatterns: (preset) => [...preset, '.astro/**'] },
			lint: {
				jsPlugins: ['@shadcn/lint'],
				rules: {
					'shadcn/require-static-classes': 'error',
					'shadcn/no-raw-colors': 'error',
					// The theme declares these utilities in @theme inline, but the rule
					// cannot resolve values declared that way, so they are allow-listed
					// by name.
					'shadcn/no-unknown-classes': [
						'error',
						{
							allow: [
								'text-2xs',
								'text-3xs',
								'text-4xs',
								'text-5xs',
								'leading-display',
								'animate-pending-slide',
							],
						},
					],
					'shadcn/no-arbitrary-values': ['error', { allow: ['layout'] }],
					'shadcn/no-inline-styles': 'error',
					'shadcn/no-restyle': [
						'error',
						{
							allow: ['layout'],
							contracts: [
								{ pattern: '^Card$', allow: ['layout', 'spacing', 'color'] },
								{ pattern: '^Button$', allow: ['layout'] },
							],
						},
					],
				},
				overrides: [
					{
						files: ['src/components/ui/**'],
						rules: {
							'shadcn/require-static-classes': 'off',
							'shadcn/no-restyle': 'off',
							'shadcn/no-arbitrary-values': 'off',
						},
					},
				],
				ignorePatterns: (preset) => [...preset, '.astro/**'],
			},
			test: {
				// Headless runs and screenshot baselines work with writes disabled.
				// allowWrite exists for UI clients on the tailnet (snapshot/baseline
				// updates from the browser UI); execution stays disabled.
				api: { allowWrite: true, allowExec: false },
				projects: [
					{
						extends: true,
						test: {
							name: 'unit',
							include: [
								'src/**/*.unit.test.ts',
								'src/**/*.test.unit.ts',
								'tests/**/*.unit.test.ts',
							],
						},
					},
					{
						extends: true,
						test: {
							name: 'server',
							include: ['src/**/*.server.test.ts', 'src/**/server.test.ts'],
							testTimeout: 30_000,
							fileParallelism: false,
						},
					},
					{
						extends: true,
						test: {
							name: 'browser',
							// Docker network changes in server tests abort Chromium module requests.
							sequence: { groupOrder: 1 },
							include: ['src/**/*.test.tsx', 'tests/**/*.test.tsx'],
							setupFiles: ['./src/styles.css'],
							fileParallelism: false,
							retry: 0,
							testTimeout: 15_000,
							browser: {
								commands: {
									async resetScreenshotPointer({ page }) {
										await page.mouse.move(0, 0)
									},
									// Writes the prebuilt avatar print; see tests/dither-print.test.tsx.
									async writePublicPng(_context, name: string, base64: string) {
										await writeFile(
											resolve(import.meta.dirname, 'public', name),
											Buffer.from(base64, 'base64'),
										)
									},
									async resizeBrowserViewport(
										{ page },
										width: number,
										height: number,
									) {
										await page.setViewportSize({ width, height })
									},
								},
								instances: [
									{
										browser: 'chromium',
										name: 'desktop',
										viewport: { width: 1280, height: 720 },
									},
									{
										browser: 'chromium',
										name: 'mobile',
										viewport: { width: 375, height: 812 },
									},
								],
								provider: playwright({
									launchOptions: {
										channel: 'chromium',
										args: ['--disable-lcd-text', '--headless=new'],
									},
									actionTimeout: 3_000,
									// Ambient canvases loop forever; reduced motion renders them as still frames.
									contextOptions: { reducedMotion: 'reduce' },
								}),
								enabled: true,
								headless: true,
								expect: {
									toMatchScreenshot: {
										comparatorName: 'pixelmatch',
										// CI and local Chromium can disagree on a few anti-aliased canvas pixels.
										comparatorOptions: { allowedMismatchedPixels: 50 },
									},
								},
								// Failure captures land beside the goldens and get committed by accident.
								screenshotFailures: false,
							},
						},
					},
				],
			},
		},
	),
)
