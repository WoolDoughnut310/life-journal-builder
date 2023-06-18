import type { Handle } from '@sveltejs/kit';
import { Client } from '@notionhq/client';
import findDatabases from '$lib/server/findDatabases';

export const handle = (async ({ event, resolve }) => {
	const token = event.cookies.get('token');

	if (token) {
		event.locals.notion = new Client({ auth: event.cookies.get('token') });
		event.locals.databaseIds = await findDatabases(event.locals.notion);
	}

	return resolve(event);
}) satisfies Handle;
