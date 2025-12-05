import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the Google AI SDK to work in the browser
    'process.env': {},
  },
  server: {
    host: true,
    port: 3000,
  },
});
