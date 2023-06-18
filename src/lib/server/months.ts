import { getDateRanges, createTimeRangePages } from './utils/date';
import endOfMonth from 'date-fns/endOfMonth';
import format from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import getWeek from 'date-fns/getWeek';
import nextMonday from 'date-fns/nextMonday';
import isMonday from 'date-fns/isMonday';
import type { Client } from '@notionhq/client';

function getMonthRanges() {
	return getDateRanges(endOfMonth, 12);
}

function getMonthName(i: number) {
	return format(addMonths(new Date('1 Jan'), i - 1), 'MMMM').toLowerCase();
}

function getWeekSelection(year: number, i: number): [number, number] {
	let start = addMonths(new Date(`1 Jan ${year}`), i);
	const end = endOfMonth(start);

	// A month only includes a certain week if the Monday of
	// the week is in the month
	// e.g. The first week in March 2025 is week 10, despite
	// March 1st being in week 9
	if (!isMonday(start)) {
		start = nextMonday(start);
	}

	// e.g. `getWeek(start) = 1`, so week 1 - first week of year
	// `getWeek(end) = 5`, so week 5 - fifth week of year
	// Subtract 1 from start for week index 0
	// , but leave the end for the range [0,1,2,3,4], which is 5 weeks
	return [getWeek(start) - 1, getWeek(end)];
}

export default function createMonthPages(notion: Client, weekIds: string[]) {
	return createTimeRangePages(notion, 'Month', {
		getDateRanges: getMonthRanges,
		getImageName: (i: number) => getMonthName(i),
		getTitle: (year: string, i: number) => `${year}-${i.toString().padStart(2, '0')}`,
		databaseId: process.env.MONTH_DATABASE_ID,
		dateRangeField: 'Dates',
		relations: {
			name: 'Weeks',
			ids: weekIds,
			getSelection: getWeekSelection
		}
	});
}
