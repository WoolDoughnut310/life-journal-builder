import createMonthPages from './months'

test('creates a page for April 2025 with the correct cover image', () => {
    const weekIds = new Array(52).fill(0).map((_, i) => `x2025-w${i + 1}x`)
    createMonthPages(weekIds)

    const emptyRichText = { rich_text: [{ text: { content: '' } }] }
    const parentId = process.env.MONTH_DATABASE_ID

    expect(notion.pages.create).toHaveBeenCalledWith({
        cover: {
            type: 'external',
            external: { url: 'image-April.png' },
        },
        parent: {
            type: 'database_id',
            database_id: parentId,
        },
        properties: {
            Name: { title: [{ text: { content: '2025-04' } }] },
            Dates: {
                date: {
                    start: '2025-04-01',
                    end: '2025-04-30',
                },
            },
            Complete: { checkbox: false },
            Weeks: {
                relation: [15, 16, 17, 18].map((id) => ({
                    id: `x2025-w${id}x`,
                })),
            },
            '→ Month Goals': emptyRichText,
            '→ Month Wins': emptyRichText,
            '→ Month Losses': emptyRichText,
            '→ Month Thoughts': emptyRichText,
        },
    })
})
