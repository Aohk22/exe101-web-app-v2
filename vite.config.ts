import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { Connect } from 'vite'
import { handleChatRequest } from './app/.server/chat/handler'

export default defineConfig({
	plugins: [
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
		{
			name: 'chat-api',
			configureServer(server) {
				const handler: Connect.NextHandleFunction = async (
					req,
					res,
					next,
				) => {
					if (
						req.method !== 'POST' ||
						!req.url?.startsWith('/api/chat')
					) {
						return next()
					}

					let body = ''
					req.on('data', (chunk) => (body += chunk))
					req.on('end', async () => {
						const { status, data } = await handleChatRequest(body)
						res.statusCode = status
						res.end(JSON.stringify(data))
					})
				}

				server.middlewares.use('/api/chat', handler)
			},
		},
	],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3001',
				configure: () => {},
			},
		},
	},
})
