import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'extension/popup.html'),
        options: resolve(__dirname, 'extension/options.html'),
        background: resolve(__dirname, 'extension/src/background/index.ts'),
        content: resolve(__dirname, 'extension/src/content/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
    outDir: 'extension/dist',
    emptyOutDir: true,
  },
});
