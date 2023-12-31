import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
	return defineConfig({
		plugins: [sveltekit()],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}'],
			globals: true,
			setupFiles: 'setup-vitest.ts'
		}
	});
};
