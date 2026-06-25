import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleChatRequest } from '../app/.server/chat/handler'

export default async function handler(
	req: IncomingMessage,
	res: ServerResponse,
) {
	if (req.method !== 'POST') {
		res.writeHead(405, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ error: 'Method not allowed' }))
		return
	}

	const body = await new Promise<string>((resolve) => {
		let data = ''
		req.on('data', (chunk) => (data += chunk))
		req.on('end', () => resolve(data))
	})

	const { status, data } = await handleChatRequest(body)
	res.writeHead(status, { 'Content-Type': 'application/json' })
	res.end(JSON.stringify(data))
}
