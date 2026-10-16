import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/v3/',
  build: {
    outDir: 'dist_v3',
    emptyOutDir: true,
    rollupOptions: {
      input: 'v3.html'
    }
  }
});
