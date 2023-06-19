import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
		deps: {
			inline: ['@aws-sdk/util-user-agent-node', '@aws-sdk/signature-v4-multi-region']
		},
		setupFiles: 'setup-vitest.ts'
	}
});
