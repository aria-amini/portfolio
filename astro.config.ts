import node from '@astrojs/node'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import varlock from '@varlock/astro-integration'
import { defineConfig } from 'astro/config'

import { resumeIntegration } from './resume/astro-integration.ts'

export default defineConfig({
	site: 'https://www.ariaamini.dev',
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	integrations: [varlock(), sitemap(), react(), resumeIntegration()],
	server: { host: '127.0.0.1', port: Number(process.env.APP_PORT ?? 3000) },
	vite: {
		cacheDir: '.astro/vite',
		plugins: [tailwindcss()],
		resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
		server: { strictPort: true },
	},
})
