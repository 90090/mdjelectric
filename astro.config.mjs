import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  // Static output for CloudFront + S3 distribution
  output: 'static',
});
