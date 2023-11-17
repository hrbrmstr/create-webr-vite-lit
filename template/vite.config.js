import { defineConfig } from 'vite'
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import topLevelAwait from "vite-plugin-top-level-await";

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
        topLevelAwait({
          promiseExportName: "__tla",
          promiseImportName: i => `__tla_${i}`
        }),
				resolve({ browser: true }),
				commonjs(),
				esbuild({
					minify: true,
					target: 'esnext', 
				})
			]
		},
	},
	plugins: [
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
