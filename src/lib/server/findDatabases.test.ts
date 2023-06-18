import { vi } from 'vitest';
import findDatabases from './findDatabases';
import { Client } from '@notionhq/client';

vi.mock('@notionhq/client', () => {
	const Client = vi.fn();
	Client.prototype.search = vi.fn();
	return { Client };
});

describe('retrieve database IDs from a workspace', () => {
	let notion: Client;
	const names = ['Weeks', 'Months', 'Quarters', 'Years'];
	const createDBMock = (title: string) => ({
		id: `db-${title.toLowerCase()}`,
		title: [{ plain_text: title }]
	});

	beforeEach(() => {
		notion = new Client();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('resolves with correct DB IDs', async () => {
		notion.search.mockResolvedValueOnce({
			results: [...names.map(createDBMock), createDBMock('Houses'), createDBMock('School')]
		});

		const returned = await findDatabases(notion);

		expect(returned).toEqual(names.map((name) => `db-${name.toLowerCase()}`));
	});

	it('throws with insufficient databases', async () => {
		notion.search.mockResolvedValueOnce({
			results: [createDBMock('Months')]
		});

		await expect(() => findDatabases(notion)).rejects.toThrowError();
	});
});
