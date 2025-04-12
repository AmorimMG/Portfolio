import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        build: {
            sourcemap: true // Source map generation must be turned on
        },
        plugins: [
            vue(),
        ],
        assetsInclude: ['**/*.fbx'],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    };
});
