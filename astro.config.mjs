import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Astro 5.x uses output: 'static' by default for static pages with dynamic API routes (prerender = false)
export default defineConfig({
  output: 'static',
  adapter: cloudflare()
});
