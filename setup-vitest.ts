import { Client } from '@notionhq/client';

vi.mock('@notionhq/client', () => {
	const Client = vi.fn();
	Client.prototype.pages = { create: vi.fn(() => Math.round(Math.random() * 1000)) };
	Client.prototype.search = vi.fn();
	return { Client };
});

beforeAll(() => {
	vi.useFakeTimers();
	vi.setSystemTime(new Date('20 Aug 2025'));
	globalThis.notion = new Client();
});

afterAll(() => {
	vi.useRealTimers();
});

beforeEach(() => {
	vi.clearAllMocks();
});
