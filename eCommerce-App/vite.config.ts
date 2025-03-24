/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.PROJECT_KEY': JSON.stringify(env.PROJECT_KEY),
      'process.env.CLIENT_ID': JSON.stringify(env.CLIENT_ID),
      'process.env.SECRET': JSON.stringify(env.SECRET),
      'process.env.SCOPE': JSON.stringify(env.SCOPE),
      'process.env.API_URL': JSON.stringify(env.API_URL),
      'process.env.AUTH_URL': JSON.stringify(env.AUTH_URL),
      global: {},
    },
    resolve: {
      alias: {
        'node-fetch': 'isomorphic-fetch',
      },
    },
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test_setup/setupTests.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
      },
    },
    css: {
      modules: {},
    },
    build: {
      chunkSizeWarningLimit: 700,
    },
  };
});
