import { getDateRanges, createTimeRangePages, type Pagination } from './utils/date';
import endOfWeek from 'date-fns/endOfWeek';
import type { Client } from '@notionhq/client';

function getWeekRanges(pagination?: Pagination) {
	return getDateRanges(endOfWeek, 52, { weekStartsOn: 1 }, pagination);
}

export default function createWeekPages(notion: Client, pagination?: Pagination) {
	return createTimeRangePages(notion, 'Week', {
		getDateRanges: () => getWeekRanges(pagination),
		getTitle: (year: string, i: number) => `${year}-W${i.toString().padStart(2, '0')}`,
		databaseId: process.env.WEEK_DATABASE_ID,
		dateRangeField: 'Dates',
		props: {
			Days: [],
			Months: [],
			'→ Week Rating (1-10)': 0
		}
	});
}
