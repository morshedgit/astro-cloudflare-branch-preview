import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Set output to hybrid for dynamic Cloudflare Worker API routes
export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare()
});
