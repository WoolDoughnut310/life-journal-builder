import { vi } from 'vitest';
import createWeekPages from './weeks';
import { Client } from '@notionhq/client';

// vi.mock('@notionhq/client', () => {
// 	const Client = vi.fn();
// 	Client.prototype.pages.create = vi.fn();
// 	return { Client };
// });

vi.mock('@notionhq/client', () => {
	console.log('hithere');
	return {
		__esModule: true,
		Client: vi.fn().mockImplementation(() => {
			return { pages: { create: vi.fn() } };
		})
	};
});
describe('eiwj', () => {
	beforeEach(async () => {
		const notion = new Client();
		console.log('client is', await notion.pages.create());
	});
	afterEach(() => vi.clearAllMocks());
	it('creates a page for Week 29 of 2025', async () => {
		//	const notion = new Client();
		console.log('hi');
		await notion.pages.create('jkfld');
		console.log('yo');

		await createWeekPages(notion);

		const emptyRichText = { rich_text: [{ text: { content: '' } }] };
		const emptyRelation = { relation: [] };
		const parentId = process.env.WEEK_DATABASE_ID;

		// No cover image in Week Pages
		expect(notion.pages.create).toHaveBeenCalledWith({
			parent: {
				type: 'database_id',
				database_id: parentId
			},
			properties: {
				Name: { title: [{ text: { content: '2025-W29' } }] },
				Dates: {
					date: {
						start: '2025-07-14',
						end: '2025-07-20'
					}
				},
				Complete: { checkbox: false },
				'→ Week Goals': emptyRichText,
				'→ Week Wins': emptyRichText,
				'→ Week Losses': emptyRichText,
				'→ Week Thoughts': emptyRichText,
				'→ Week Rating (1-10)': {
					number: 0
				},
				Days: emptyRelation,
				Months: emptyRelation
			}
		});
	});
});
