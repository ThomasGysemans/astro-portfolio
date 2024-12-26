import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://portfolio.sciencesky.fr",
  integrations: [tailwind(), icon({ iconDir: "./public/icons" }), svelte()],
  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
    routing: "manual",
    fallback: {
      en: "fr",
    },
  },
  vite: {
    server: {
      host: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  },
  security: {
    checkOrigin: true,
  },
});
