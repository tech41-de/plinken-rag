import { Context } from 'hono';

export type WorkflowInput = {
	room: string;
	workflow: string;
	creator: string;
	topic: string;
	agenda: string;
	schedule: number;
	model: string;
};

export interface Handler {
	handle(ctx: ExecutionContext, env: Env, input: WorkflowInput): void;
}
