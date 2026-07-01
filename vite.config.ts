import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: 'localhost',
    port: 3000,
    strictPort: false,
    open: true,
  },
});
