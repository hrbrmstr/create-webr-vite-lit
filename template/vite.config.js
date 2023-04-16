import { defineConfig } from 'vite'
import topLevelAwait from "vite-plugin-top-level-await";
import webfontDownload from 'vite-plugin-webfont-dl';
import urlResolve from 'rollup-plugin-url-resolve';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';

// https://vitejs.dev/config/
export default defineConfig({
	base: '/', // # MAKE SURE TO CHANGE to match final deployment
  build: {
		lib: {
			entry: 'index.html',
      // entry: 'src/main.js',
			formats: [ 'es' ]
    },
		rollupOptions: {
			plugins: [
				urlResolve({
					cacheManager: '.cache',
					minify: true,
				}),
				resolve({ browser: true }),
				commonjs(),
				esbuild({
					minify: true,
					target: 'es2022', 
				})
			]
		},
	},
	plugins: [
		topLevelAwait({
			promiseExportName: "__tla",
			promiseImportName: i => `__tla_${i}`
		}),
		webfontDownload(),
	],
	server: {
		headers: {
		"Cache-Control": "no-cache; max-age=1",
    "Cross-Origin-Embedder-Policy": "require-corp",
		"Cross-Origin-Opener-Policy": "same-origin",
		"Cross-Origin-Resource-Policy": "cross-origin",
		}
	}
})
