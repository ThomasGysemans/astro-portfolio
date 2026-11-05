import { defineConfig, envField } from 'astro/config';
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";

import { LOCALES, DEFAULT_LOCALE } from "./src/i18n/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  site: "https://thomasgysemans.dev",
  integrations: [icon({ iconDir: "./public/icons" }), svelte()],
  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    // Non-default locales have no page files of their own. Astro's native
    // fallback renders the shared (default-locale) pages in place at the
    // `/en/*` URLs — no `src/pages/en/` folder and no manual routing needed.
    // `Astro.currentLocale` stays the requested locale (en) under `rewrite`.
    routing: {
      prefixDefaultLocale: false,
      fallbackType: "rewrite",
    },
    fallback: {
      en: "fr",
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // One chunk is expected above Vite's 500 kB default: /showcase's viewer
      // (three.js + Threlte + postprocessing, ~820 kB, ~210 kB gzipped), loaded
      // by that page alone. Splitting it would not get three.js itself under
      // 500 kB, so the bar sits just above it and still flags any other chunk.
      chunkSizeWarningLimit: 900,
    },
    server: {
      host: true,
    },
  },
  security: {
    checkOrigin: true,
  },
  // The SMTP account the quote form sends with (src/actions/index.ts). Secrets,
  // read at runtime and never inlined in the bundle. Optional on purpose: a
  // missing one must only disable the form, not take the whole site down.
  env: {
    schema: {
      QUOTE_EMAIL_SENDER: envField.string({ context: "server", access: "secret", optional: true }),
      QUOTE_EMAIL_SENDER_PASSWORD: envField.string({ context: "server", access: "secret", optional: true }),
      QUOTE_EMAIL_SENDER_HOST: envField.string({ context: "server", access: "secret", optional: true }),
      QUOTE_EMAIL_SENDER_PORT: envField.number({ context: "server", access: "secret", optional: true }),
      QUOTE_EMAIL_RECEIVER: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
});
