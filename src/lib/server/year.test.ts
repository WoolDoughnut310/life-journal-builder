import createYearPage from './year'

test('creates a page for 2025 with the correct cover image', () => {
    const quarterIds = new Array(4).fill(0).map((_, i) => `xq${i + 1}x`) // e.g. xq2x
    createYearPage(quarterIds)

    const emptyRichText = { rich_text: [{ text: { content: '' } }] }
    const parentId = process.env.YEAR_DATABASE_ID

    expect(notion.pages.create).toHaveBeenCalledWith({
        cover: {
            type: 'external',
            external: { url: 'image-2025.png' },
        },
        parent: {
            type: 'database_id',
            database_id: parentId,
        },
        properties: {
            Name: { title: [{ text: { content: '2025' } }] },
            Complete: { checkbox: false },
            Quarters: { relation: quarterIds.map((id) => ({ id })) },
            'Year Goals': emptyRichText,
            '→ Year Wins': emptyRichText,
            '→ Year Losses': emptyRichText,
            '→ Year Thoughts': emptyRichText,
        },
    })
})
