import { getCurrentYear } from './utils/date';
import { retrieveImage } from './utils/images';
import { createPage } from './utils/notion';
import type { Client } from '@notionhq/client';

export default async function createYearPage(notion: Client, quarterIds: string[]) {
	const year = getCurrentYear().toString();
	const coverImage = await retrieveImage(year);

	return notion.pages.create(
		createPage('Year', year, coverImage, process.env.YEAR_DATABASE_ID, {
			Quarters: quarterIds
		})
	);
}
