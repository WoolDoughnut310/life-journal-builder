import initialiseMainStages, { type OutputType } from './mainStages';

describe('creates Notion pages in chunks', () => {
	let mainStages: OutputType;
	const databaseIds = {
		weeks: 'week-db',
		months: 'month-db',
		quarters: 'quarter-db',
		years: 'year-db'
	};
	const weekIds = new Array(52).fill(0).map((_, i) => `x2025-w${i + 1}x`);

	beforeAll(() => {
		mainStages = initialiseMainStages(notion, databaseIds);
	});

	test('first chunk creates 18 pages', async () => {
		await mainStages[0]();
		expect(notion.pages.create).toHaveBeenCalledTimes(18);
	});

	test('second chunk creates 17 pages', async () => {
		await mainStages[1]();
		expect(notion.pages.create).toHaveBeenCalledTimes(17);
	});

	test('third chunk creates 17 pages', async () => {
		await mainStages[2]();
		expect(notion.pages.create).toHaveBeenCalledTimes(17);
	});

	test('fourth chunk creates 17 pages', async () => {
		await mainStages[3](weekIds);
		expect(notion.pages.create).toHaveBeenCalledTimes(17);
	});
});
