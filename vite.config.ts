import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  return {
    plugins: [react()],
    base: mode === 'test' ? '/battery/' : '/',
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].${Date.now()}.js`,
          chunkFileNames: `assets/[name].[hash].${Date.now()}.js`,
          assetFileNames: `assets/[name].[hash].${Date.now()}.[ext]`
        }
      }
    },
    server: {
      port: 5173,
      host: true
    }
  }
});