import {
	defineConfig,
	devices,
	type PlaywrightTestConfig,
} from '@playwright/test'

const deploymentURL = process.env.BASE_URL?.trim()

const baseURL =
	deploymentURL || `http://127.0.0.1:${process.env.APP_PORT ?? '3000'}`

const launchOptions: NonNullable<
	NonNullable<PlaywrightTestConfig['use']>['launchOptions']
> = { args: ['--headless=new'] }

if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
	launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
}

const config: PlaywrightTestConfig = {
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
		launchOptions,
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
}

if (!deploymentURL) {
	config.webServer = {
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
	}
}

export default defineConfig(config)
