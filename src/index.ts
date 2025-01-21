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
import { cors } from 'hono/cors';

export type Env = {
	INQUEUE: Queue<any>;
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

app.post('/0/inqueue', async (c: Context) => {
	const body = await c.req.json();
	await c.env.INQUEUE.send(body);
});
