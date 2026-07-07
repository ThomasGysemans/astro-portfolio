import { defineConfig, devices } from "@playwright/test";

// End-to-end tests hit a real dev server, which in turn needs the local
// PocketBase running (`docker compose up -d`) with seeded content.
const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
    testDir: "./tests/e2e",
    // Astro dev compiles routes on demand; the first hit of a page can be slow.
    timeout: 30_000,
    expect: { timeout: 10_000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? "github" : "list",
    use: {
        baseURL: BASE_URL,
        trace: "on-first-retry",
    },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    ],
    // Start the Astro dev server for the tests (reuse a running one locally).
    // Astro 7's `astro dev` daemonises when stdout is not a TTY, so its
    // foreground process would exit early and Playwright would think the
    // server died. `dev:e2e` starts the daemon then tails its logs, giving
    // Playwright a long-lived foreground process to watch.
    webServer: {
        command: "npm run dev:e2e",
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
