import {
	defineConfig,
	devices,
	type PlaywrightTestConfig,
} from '@playwright/test'

const deploymentURL = process.env.BASE_URL?.trim()

// Playwright never starts a server. CI tests deployed URLs only; locally it
// falls back to the dev server that Pitchfork already runs.
if (process.env.CI && !deploymentURL) {
	throw new Error('Set BASE_URL to a deployed URL; CI does not start a server.')
}

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

export default defineConfig(config)
