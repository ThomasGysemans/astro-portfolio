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
  site: "https://portfolio.sciencesky.fr",
  integrations: [icon({ iconDir: "./public/icons" }), svelte()],
  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: "manual",
    // Non-default locales have no page files of their own:
    // their URLs are rewritten to the shared pages, and the middleware
    // keeps `locals.lang` based on the original URL.
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
