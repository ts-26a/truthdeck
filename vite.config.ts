import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/': `${__dirname}/src/`, // path.join(__dirname, "src/") でも可
    },
  },
});
