import { Client, LogLevel } from '@notionhq/client'
import createWeekPages from './weeks'
import createMonthPages from './months'
import createQuarterPages from './quarters'
import createYearPage from './year'

async function chainPageCreation(
    functions: ((ids: string[]) => Promise<any[]>)[]
) {
    let pageIds: string[] = []

    // Pass the pageIds from a given collection of pages
    // into the next collection e.g. pass all the monthIds
    // into the creation of the quarters pages

    for (let createPages of functions) {
            let pages = await createPages(pageIds);
            pageIds = pages.map((page) => page.id);
    }

    return pageIds
}

export default async function main() {
    global.notion = new Client({
        auth: process.env.NOTION_TOKEN,
        logLevel: LogLevel.INFO,
        timeoutMs: 600_000
    })

    let quarterIds = await chainPageCreation([
        createWeekPages,
        createMonthPages,
        createQuarterPages,
    ])
    await createYearPage(quarterIds)
}
