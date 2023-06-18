import type { LayoutServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import initialiseMainStages from '$lib/server/mainStages';

export const load = (async ({ cookies, locals }) => {
	const token = cookies.get('token');
	if (!(token && locals.notion)) {
		throw redirect(307, '/');
	}
}) satisfies LayoutServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		const notion = locals.notion;
		const databaseIds = locals.databaseIds;

		if (!(notion && databaseIds)) {
			return fail(403);
		}

		const data = await request.formData();
		const chunk = data.get('chunk');

		if (!chunk) {
			return fail(400);
		}

		const mainStages = initialiseMainStages(notion);

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
