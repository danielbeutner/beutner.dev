import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

const SITE_URL = 'https://beutner.dev';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  adapter: cloudflare({ sessionKVBindingName: undefined }),
  integrations: [
    preact({ compat: true }),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'night-owl',
    },
  },
});
