import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://bloggerskin-wanttomakeitastro.hoi3227.workers.dev',
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  security: {
    checkOrigin: false,
  },
  vite: {
    ssr: {
      external: ['node:crypto']
    }
  }
});
