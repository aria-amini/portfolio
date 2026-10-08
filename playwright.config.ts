import { defineConfig, devices } from '@playwright/test'

const deploymentURL = process.env.BASE_URL?.trim()
const baseURL =
	deploymentURL || `http://127.0.0.1:${process.env.APP_PORT ?? '3000'}`

export default defineConfig({
	...(deploymentURL
		? {}
		: {
				webServer: {
					command:
						'vp run build && exec vp exec varlock run -- node .output/server/index.mjs',
					url: baseURL,
					reuseExistingServer: !process.env.CI,
					timeout: 120_000,
					gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
					env: {
						NODE_ENV: 'production',
						PORT: process.env.APP_PORT ?? '3000',
						HOST: '127.0.0.1',
					},
				},
			}),
	testDir: './e2e',
	outputDir: '.playwright/test-results',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: [
		['list'],
		['html', { open: 'never', outputFolder: '.playwright/report' }],
	],
	use: {
		baseURL,
		ignoreHTTPSErrors: !process.env.CI && baseURL.startsWith('https://'),
		trace: 'retain-on-failure',
		channel: 'chromium',
		launchOptions: {
			args: ['--headless=new'],
			...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
				? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
				: {}),
		},
	},
	timeout: 15_000,
	expect: { timeout: 5_000 },
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		{
			name: 'mobile',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 390, height: 844 },
			},
		},
	],
})
