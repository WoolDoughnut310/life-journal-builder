import createQuarterPages from './quarters';
import { env } from '$env/dynamic/private';

test('creates a page for Q4 with the correct cover image', async () => {
	const monthIds = new Array(12).fill(0).map((_, i) => `x2025-m${i + 1}x`); // e.g. x2025-m8x
	const parentId = 'quarter-db';

	await createQuarterPages(notion, parentId, monthIds);

	expect(notion.pages.create).toHaveBeenCalledWith({
		cover: {
			type: 'external',
			external: {
				url: `https://link.storjshare.io/raw/${env.STORJ_ACCESS_GRANT}/${env.STORJ_BUCKET_NAME}/q4.png`
			}
		},
		parent: {
			type: 'database_id',
			database_id: parentId
		},
		properties: {
			Quarter: { title: [{ text: { content: '2025-Q4' } }] },
			'Date Range': {
				date: {
					start: '2025-10-01',
					end: '2025-12-31'
				}
			},
			Months: {
				relation: [10, 11, 12].map((id) => ({ id: `x2025-m${id}x` }))
			}
		}
	});
});
