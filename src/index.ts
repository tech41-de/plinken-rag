/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.json`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Context, Hono } from 'hono';
import { env } from 'hono/adapter';
import { cors } from 'hono/cors';

export type Env = {
	INQUEUE: Queue<any>;
	AI: Ai;
};

const app = new Hono();
app.use(
	'*',
	cors({
		origin: ['https://plinken.com', 'https://home.plinken.com', 'http://localhost:3000', 'http://localhost:5173'],
		allowHeaders: ['Authorization', 'X-Custom-Header', 'Content-Type', 'Upgrade-Insecure-Requests'],
		allowMethods: ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);
app.get('/', async (c: Context) => {
	return Response.json({ status: 'OK' });
});

app.post('/0/ask', async (c: Context) => {
	const body = await c.req.json();
	const messages = [
		{ role: 'system', content: body.system },
		{
			role: 'user',
			content: body.user,
		},
	];
	const answer = await c.env.AI.run('@cf/meta/llama-3.1-70b-instruct', { messages });
	return Response.json({ status: 'OK', answer: JSON.stringify(answer) });
});

app.post('/0/inqueue', async (c: Context) => {
	const body = await c.req.json();
	console.log(body);
	await c.env.INQUEUE.send(body);
	return c.json({ status: 'OK' });
});

export default app;
