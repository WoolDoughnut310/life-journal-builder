import type { Client } from '@notionhq/client';
import createWeekPages from './weeks';
import createMonthPages from './months';
import createQuarterPages from './quarters';
import createYearPage from './year';
import type { PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

type OutputType = [
	() => Promise<string[]>,
	() => Promise<string[]>,
	() => Promise<string[]>,
	(weekIds: string[]) => Promise<void>
];

const extractIds = (pages: (PartialPageObjectResponse | undefined)[]) => pages.map((page) => page.id)

export default (notion: Client): OutputType => [
	() => createWeekPages(notion, { skip: 0, take: 18 }).then(extractIds),
	() => createWeekPages(notion, { skip: 18, take: 17 }).then(extractIds),
	() => createWeekPages(notion, { skip: 18, take: 17 }).then(extractIds),
	async (weekIds: string[]) => {
		const monthIds = extractIds(await createMonthPages(notion, weekIds));
		const quarterIds = extractIds(await createQuarterPages(notion, monthIds));
		await createYearPage(notion, quarterIds);
	}
];
