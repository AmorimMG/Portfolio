import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        build: {
            sourcemap: true // Source map generation must be turned on
        },
        plugins: [
            vue(),
            sentryVitePlugin({
                authToken: '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',
                org: 'amorim-um',
                project: 'javascript-vue'
            })
        ],
        assetsInclude: ['**/*.fbx'],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    };
});
