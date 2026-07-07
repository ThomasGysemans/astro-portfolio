import { getViteConfig } from "astro/config";

// `getViteConfig` reuses the project's Astro config, so the `@i18n`/`@data`
// path aliases and the `astro:i18n` virtual module resolve inside the tests.
export default getViteConfig({
    test: {
        // Pure-logic tests: no DOM needed.
        environment: "node",
        include: ["tests/unit/**/*.test.ts"],
        // `pb.ts` throws on import when this is unset (it only constructs the
        // client — no network call — so a dummy URL is enough for unit tests).
        env: {
            POCKETBASE_URL: "http://127.0.0.1:8090",
        },
    },
});
