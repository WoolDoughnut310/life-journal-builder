import createQuarterPages from './quarters'

test('creates a page for Q4 with the correct cover image', () => {
    const monthIds = new Array(12).fill(0).map((_, i) => `x2025-m${i + 1}x`) // e.g. x2025-m8x
    createQuarterPages(monthIds)

    const emptyRichText = { rich_text: [{ text: { content: '' } }] }
    const parentId = process.env.QUARTER_DATABASE_ID

    expect(notion.pages.create).toHaveBeenCalledWith({
        cover: {
            type: 'external',
            external: { url: 'image-q4.png' },
        },
        parent: {
            type: 'database_id',
            database_id: parentId,
        },
        properties: {
            Name: { title: [{ text: { content: '2025-Q4' } }] },
            'Date Range': {
                date: {
                    start: '2025-10-01',
                    end: '2025-12-31',
                },
            },
            Complete: { checkbox: false },
            Months: {
                relation: [10, 11, 12].map((id) => ({ id: `x2025-m${id}x` })),
            },
            '→ Quarter Goals': emptyRichText,
            '→ Quarter Wins': emptyRichText,
            '→ Quarter Losses': emptyRichText,
            '→ Quarter Thoughts': emptyRichText,
            Year: { relation: [] },
        },
    })
})
