import { resolve } from 'node:path'

import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { varlockVitePlugin } from '@varlock/vite-integration'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'

const root = import.meta.dirname

export default defineConfig({
	root,
	staged: { '*': 'vp check --fix' },
	optimizeDeps: {
		include: [
			'vite-plus/test',
			'vite-plus/test/browser',
			'vitest-browser-react',
		],
	},
	server: { host: '127.0.0.1', port: Number(process.env.APP_PORT ?? 3000) },
	build: {
		rollupOptions: { checks: { moduleLevelDirective: false } },
	},
	resolve: {
		tsconfigPaths: true,
		dedupe: ['react', 'react-dom'],
		alias: [
			{ find: '@/mocks', replacement: resolve(root, '__mocks__') },
			{ find: '@', replacement: resolve(root, 'src') },
			{ find: '@tests', replacement: resolve(root, 'tests') },
		],
	},
	plugins: [
		tanstackStart({
			router: { routeFileIgnorePattern: '(\\.test\\.tsx$|__screenshots__)' },
			server: { build: { inlineCss: true } },
		}),
		...(process.env.VITEST === 'true'
			? []
			: [
					devtools({ injectSource: { enabled: false } }),
					nitro({ sourcemap: true, experimental: { sourcemapMinify: false } }),
				]),
		tailwindcss(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
		svgr({ include: '**/*.svg', svgrOptions: { exportType: 'default' } }),
		varlockVitePlugin({ ssrInjectMode: 'resolved-env' }),
	],
	fmt: {
		singleQuote: true,
		semi: false,
		useTabs: true,
		experimentalTailwindcss: {},
		experimentalSortImports: {},
		printWidth: 80,
		experimentalSortPackageJson: false,
		proseWrap: 'always',
		ignorePatterns: [
			'**/.output',
			'**/.vite',
			'**/dist/**',
			'pnpm-lock.yaml',
			'env.d.ts',
			'**/routeTree.gen.ts',
		],
		overrides: [{ files: ['*.{yaml,yml}'], options: { useTabs: false } }],
	},
	lint: {
		plugins: [
			'eslint',
			'unicorn',
			'typescript',
			'oxc',
			'react',
			'react-perf',
			'import',
			'jsdoc',
			'jsx-a11y',
			'node',
			'promise',
		],
		categories: {},
		options: { typeAware: true, typeCheck: true },
		rules: {
			'no-empty-pattern': 'off',
			'no-console': ['error', { allow: ['warn', 'error'] }],
			'oxc/no-accumulating-spread': 'error',
		},
		overrides: [
			{
				files: ['scripts/**', '**/*.server.ts'],
				rules: { 'no-console': 'off' },
			},
		],
		ignorePatterns: ['**/dist/**'],
	},
	test: {
		api: { allowWrite: true, allowExec: false },
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					include: ['src/**/*.unit.test.ts', 'src/**/*.test.unit.ts'],
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
					sequence: { groupOrder: 1 },
					include: ['src/**/*.test.tsx', 'tests/**/*.test.tsx'],
					setupFiles: ['./src/styles.css'],
					fileParallelism: false,
					retry: 0,
					testTimeout: 15_000,
					browser: {
						instances: [{ browser: 'chromium' }],
						provider: playwright({
							launchOptions: {
								channel: 'chromium',
								args: ['--headless=new'],
								...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
									? {
											executablePath:
												process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
										}
									: {}),
							},
							actionTimeout: 3_000,
						}),
						enabled: true,
						headless: true,
					},
				},
			},
		],
	},
})
