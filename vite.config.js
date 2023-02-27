import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	base: '/MDIcons/',
	outDir: '/docs',
	plugins: [sveltekit()]
});
