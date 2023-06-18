import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints.js';

interface DateRange {
	start: string;
	end: string;
}

// Full type definition of result needed
function createCoverImage(
	image?: string
): { type: 'external'; external: { url: string } } | undefined {
	if (!image) return;
	return {
		type: 'external',
		external: {
			url: image
		}
	};
}

function createTitle(title: string) {
	return {
		title: [
			{
				text: {
					content: title
				}
			}
		]
	};
}

function createParentRelation(parentId: string): {
	type: 'database_id';
	database_id: string;
} {
	return {
		type: 'database_id',
		database_id: parentId
	};
}

function isDateRange(object: any): object is DateRange {
	return 'start' in object && 'end' in object;
}

function addDefaultProperties(type: string, props: { [key: string]: any }) {
	const KEYS = ['Goals', 'Wins', 'Losses', 'Thoughts'];
	const keysEntries = Object.fromEntries(
		KEYS.map((key): [string, string] => {
			let name = `${type} ${key}`;

			// The `Year Goals` property doesn't depend
			// on properties from other pages
			if (!(type === 'Year' && key === 'Goals')) {
				name = `→ ${name}`;
			}

			return [name, ''];
		})
	);

	return Object.assign(props, { Complete: false }, keysEntries);
}

function createProperties(props: { [key: string]: any }) {
	return Object.fromEntries(
		Object.entries(props).map(([name, value]) => {
			const key = name;
			const output: { [key: string]: any } = {};

			if (typeof value === 'boolean') {
				output.checkbox = value;
			} else if (value instanceof Array) {
				output.relation = value.map((id) => ({ id }));
			} else if (typeof value === 'string') {
				output.rich_text = [{ text: { content: value } }];
			} else if (typeof value === 'number') {
				output.number = value;
			} else if (isDateRange(value)) {
				output.date = value;
			}

			return [key, output];
		})
	);
}

export function createPage(
	type: string,
	title: string,
	coverImage: string,
	parentId: string,
	props: { [key: string]: any }
): CreatePageParameters {
	const addDefaultProperties = (_: any, a: any) => a;
	return {
		cover: createCoverImage(coverImage),
		parent: createParentRelation(parentId),
		properties: {
			[type]: createTitle(title),
			...createProperties(addDefaultProperties(type, props))
		}
	} as any;
}
