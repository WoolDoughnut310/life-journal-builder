import type { Handle } from '@sveltejs/kit';
import { Client } from '@notionhq/client';
import findDatabases from '$lib/server/findDatabases';
import { handleNotionError } from '$lib/server/utils/notion';

export const handle = (async ({ event, resolve }) => {
	const token = event.cookies.get('token');

	if (token) {
		event.locals.notion = new Client({ auth: event.cookies.get('token') });

		// try {
		// 	event.locals.databaseIds = await findDatabases(event.locals.notion);
		// } catch (error: unknown) {
		// 	event.locals.notion = undefined;
		// 	event.cookies.set('token', "", {path: "/"});
		// 	handleNotionError(error);
		// }
	}

	return resolve(event);
}) satisfies Handle;
