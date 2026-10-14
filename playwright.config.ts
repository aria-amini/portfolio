import {
	defineConfig,
	devices,
	type PlaywrightTestConfig,
} from '@playwright/test'

const deploymentURL = process.env.BASE_URL?.trim()

const baseURL = deploymentURL || 'http://127.0.0.1:4321'

const launchOptions: NonNullable<
	NonNullable<PlaywrightTestConfig['use']>['launchOptions']
> = { args: ['--disable-lcd-text', '--headless=new'] }

if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
	launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
}

const config: PlaywrightTestConfig = {
	snapshotPathTemplate:
		'{testDir}/{testFilePath}-snapshots/{arg}-{projectName}-{platform}{ext}',
	webServer: deploymentURL
		? []
		: {
				command: 'vp run build && HOST=127.0.0.1 PORT=4321 vp run start',
				url: baseURL,
				timeout: 120_000,
			},
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
		reducedMotion: 'reduce',
	},
	timeout: 15_000,
	expect: { timeout: 5_000 },
	projects: [
		{
			name: 'desktop',
			use: { ...devices['Desktop Chrome'], channel: 'chromium', launchOptions },
		},
		{
			name: 'mobile',
			use: {
				...devices['Desktop Chrome'],
				channel: 'chromium',
				launchOptions,
				viewport: { width: 375, height: 812 },
			},
		},
		{
			name: 'mobile-webkit',
			testIgnore: ['**/visual.spec.ts', '**/domains.spec.ts'],
			use: { ...devices['iPhone 13'], browserName: 'webkit' },
		},
	],
}

export default defineConfig(config)
