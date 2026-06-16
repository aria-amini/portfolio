import { createAppConfig } from '@aamini/config/vite'
import { mergeConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'

const root = new URL('.', import.meta.url).pathname

export default mergeConfig(
	createAppConfig({
		root,
		projectOverrides: {
			browser: {
				test: {
					browser: {
						provider: playwright(),
					},
				},
			},
		},
	}),
	{
		ssr: {
			noExternal: ['@aamini/config'],
		},
		lint: {
			overrides: [
				{
					files: ['scripts/**/*'],
					rules: {
						'no-console': 'off',
					},
				},
			],
		},
	},
)
