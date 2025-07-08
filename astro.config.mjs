// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
    sentry({
      dsn: process.env.PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      // Setting this option to true will send default PII data to Sentry.
      // For example, automatic IP address collection on events
      // sendDefaultPii: true,
      sourceMapsUploadOptions: {
        project: "habbit-week",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    })
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});