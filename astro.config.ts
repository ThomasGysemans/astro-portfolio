import { defineConfig } from 'astro/config';
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
    server: {
      host: true,
    },
  },
  security: {
    checkOrigin: true,
  },
});
