import createMonthPages from './months';
import { env } from '$env/dynamic/private';

test('creates a page for April 2025 with the correct cover image', async () => {
	const weekIds = new Array(52).fill(0).map((_, i) => `x2025-w${i + 1}x`);
	const parentId = 'month-db';

	await createMonthPages(notion, parentId, weekIds);

	expect(notion.pages.create).toHaveBeenCalledWith({
		cover: {
			type: 'external',
			external: {
				url: `https://link.storjshare.io/raw/${env.STORJ_ACCESS_GRANT}/${env.STORJ_BUCKET_NAME}/april.png`
			}
		},
		parent: {
			type: 'database_id',
			database_id: parentId
		},
		properties: {
			Month: { title: [{ text: { content: '2025-04' } }] },
			Dates: {
				date: {
					start: '2025-04-01',
					end: '2025-04-30'
				}
			},
			Weeks: {
				relation: [15, 16, 17, 18].map((id) => ({
					id: `x2025-w${id}x`
				}))
			}
		}
	});
});
