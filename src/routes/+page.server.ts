import { redirect, error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ cookies, request, locals }) => {
		const data = await request.formData();

		if (!data.has('token')) {
			throw error(400, 'no token');
		}

		const token = data.get('token') as string;
		cookies.set('token', token);
		throw redirect(301, '/setup');
	}
} satisfies Actions;
