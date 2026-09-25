import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    environment: 'jsdom',
    setupFiles: './src/testing/setup.ts',
  },
});
