import type { LayoutServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import initialiseMainStages from '$lib/server/mainStages';
import findDatabases from '$lib/server/findDatabases';
import { handleNotionError } from '$lib/server/utils/notion';

export const load = (async ({ cookies, locals }) => {
	const token = cookies.get('token');
	if (!(token && locals.notion)) {
		throw redirect(307, '/');
	}

	try {
		cookies.set('databaseIds', JSON.stringify(await findDatabases(locals.notion)));
	} catch (error: unknown) {
		locals.notion = undefined;
		cookies.set('token', '', { path: '/' });
		handleNotionError(error);
	}
}) satisfies LayoutServerLoad;

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const notion = locals.notion;
		const databaseIdString = cookies.get('databaseIds');

		if (!(notion && databaseIdString)) {
			return fail(403);
		}

		const databaseIds = JSON.parse(databaseIdString);

		const data = await request.formData();
		const chunk = data.get('chunk');

		if (!chunk) {
			return fail(400);
		}

		const mainStages = initialiseMainStages(notion, databaseIds);

		// Commence page creation with given chunk
		if (chunk === '0') {
			return mainStages[0]();
		} else if (chunk === '1') {
			return mainStages[1]();
		} else if (chunk === '2') {
			return mainStages[2]();
		} else if (chunk === '3') {
			// chunk 3 involves creating months, quarters and year
			const weekIds = data.get('weekIds');
			if (!(weekIds && typeof weekIds === 'string')) {
				return fail(400, { message: 'no week IDs given' });
			}

			return mainStages[3](JSON.parse(weekIds));
		} else {
			return fail(400, { message: 'invalid chunk number' });
		}
	}
} satisfies Actions;
