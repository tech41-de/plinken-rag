import { WorkflowInput } from './Types';
import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import { Env } from './index';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/d1';
import { room } from './schema';
import { eq } from 'drizzle-orm';

export class ScheduleFlow extends WorkflowEntrypoint<Env, WorkflowInput> {
	async run(event: WorkflowEvent<WorkflowInput>, step: WorkflowStep) {
		const prompt = await step.do(
			`Create Prompt for:  ${event.payload.room} `,
			{
				retries: {
					limit: 1,
					delay: '5 second',
					backoff: 'exponential',
				},
				timeout: '1 minutes',
			},
			async (): Promise<any> => {
				const messages = {
					system:
						'You are a helpful agent that partipates in a meeting with the topic: ' +
						event.payload.topic +
						'. Please prepare based on the agenda.',
					user: 'Meeting Agenda: ' + event.payload.agenda,
				};
				const response = await fetch('https://rag.plinken.com/0/ask', {
					method: 'POST',
					body: JSON.stringify(messages),
				});
				return await response.json();
			}
		);

		await step.do(
			`Store data:  ${event.payload.room} `,
			{
				retries: {
					limit: 1,
					delay: '5 second',
					backoff: 'exponential',
				},
				timeout: '1 minutes',
			},
			async () => {
				//console.log('this is Store data', prompt.answer);
				const msgFromModel = JSON.parse(prompt.answer);
				console.log(msgFromModel.response);
				const db = drizzle(this.env.DB);
				await db.update(room).set({ prompt: msgFromModel.response }).where(eq(room.room, event.payload.room));
			}
		);
	}
}
