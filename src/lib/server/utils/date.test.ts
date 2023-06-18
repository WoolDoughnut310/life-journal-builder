import { formatDate } from './date'

test('formats the Date object for 2025/07/29', () => {
    const date = new Date('2025/07/29')
    expect(formatDate(date)).toBe('2025-07-29')
})
