import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://sciencesky.fr",
  integrations: [tailwind(), icon(), svelte(), db()],
  security: {
    checkOrigin: true,
  },
});