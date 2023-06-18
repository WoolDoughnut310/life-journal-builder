// See https://kit.svelte.dev/docs/types#app

import type { Client } from '@notionhq/client';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			notion: Client;
			databaseIds: {
				weeks: string;
				months: string;
				quarters: string;
				years: string;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
