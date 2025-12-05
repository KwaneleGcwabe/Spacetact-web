import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // This section fixes the white screen crash
  define: {
    'process.env': {},
  },
  server: {
    host: true,
    port: 3000,
  },
});
