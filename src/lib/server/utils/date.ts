import getYear from 'date-fns/getYear/index.js';
import addDays from 'date-fns/addDays/index.js';
import format from 'date-fns/format/index.js';
import { retrieveImage } from './images';
import { createPage } from './notion';
import logger from '../logger';
import type { Client } from '@notionhq/client';

interface DateRange {
	start: string;
	end: string;
}

export interface Pagination {
	skip: number;
	take: number;
}

interface Options {
	getDateRanges: () => (DateRange | undefined)[];
	getImageName?: (i: number) => string;
	getTitle: (year: string, i: number) => string;
	databaseId: string;
	dateRangeField: string;
	relations?: {
		name: string;
		ids: string[];
		// 0-indexed
		getSelection: (year: number, i: number) => [number, number];
	};
}

export function formatDate(date: Date) {
	return format(date, 'yyyy-MM-dd');
}

export function getCurrentYear() {
	return getYear(new Date());
}

export function getDateRanges(
	endOfFunction: (date: Date, params?: { [key: string]: number }) => Date,
	n: number,
	params: { [key: string]: number } = {},
	pagination?: Pagination
) {
	if (!pagination) {
		pagination = { skip: 0, take: n };
	}

	const year = getCurrentYear();
	const ranges: (DateRange | undefined)[] = [];

	let start = new Date(`1 Jan ${year}`);

	let taking = false;

	const { skip, take } = pagination;

	for (let i = 0; i < n; i++) {
		// start collecting date ranges once `skip`
		// number of iterations have passed
		if (i === skip) {
			taking = true;
		}

		if (i === skip + take) {
			// if the correct number of dateRanges
			// have been added to the array, stop
			break;
		}

		const end = endOfFunction(start, params);

		ranges.push(
			taking
				? {
						start: formatDate(start),
						end: formatDate(end)
				  }
				: undefined
		);

		start = addDays(end, 1);
	}

	return ranges;
}

export async function createTimeRangePages(notion: Client, type: string, options: Options) {
	const year = getCurrentYear();
	const dateRanges = options.getDateRanges();

	return Promise.all(
		dateRanges.map(async (dateRange, i) => {
			if (!dateRange) return Promise.resolve(undefined);
			logger.info(`creating ${type} ${i} in range ${dateRange.start} -> ${dateRange.end}`);

			const coverImage = retrieveImage(options.getImageName?.(i + 1));
			let relationsOutput: { [key: string]: string[] } = {};

			if (options.relations) {
				relationsOutput = {
					[options.relations.name]: options.relations.ids.slice(
						...options.relations.getSelection(year, i)
					)
				};
			}

			const response = await notion.pages.create(
				createPage(type, options.getTitle(year.toString(), i + 1), coverImage, options.databaseId, {
					[options.dateRangeField]: dateRange,
					...(options.relations ? relationsOutput : {})
				})
			);

			return response;
		})
	);
}
