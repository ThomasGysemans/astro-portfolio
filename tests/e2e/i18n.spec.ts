import { expect, test } from "@playwright/test";

// These tests exercise the middleware's language-redirection rules, which are
// the most unusual part of the app. See CLAUDE.md > i18n.

test.describe("first visit with an English browser", () => {
    test.use({ locale: "en-US" });

    test("redirects the prefix-less URL to /en/ and remembers the choice", async ({ page, context }) => {
        await page.goto("/");
        // Auto-redirected to the English URL...
        await expect(page).toHaveURL(/\/en\/?$/);
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
        await expect(page.getByRole("link", { name: "Projects", exact: true })).toBeVisible();
        // ...and the choice is persisted in the `lang` cookie.
        const cookies = await context.cookies();
        expect(cookies.find(c => c.name === "lang")?.value).toBe("en");
    });

    test("never redirects an explicit /en/ URL", async ({ page }) => {
        await page.goto("/en/");
        await expect(page).toHaveURL(/\/en\/?$/);
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });
});

test.describe("first visit with a French browser", () => {
    test.use({ locale: "fr-FR" });

    test("stays on the prefix-less French URL", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveURL("/");
        await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    });

    test("still serves an explicit /en/ URL in English (crawlers stay indexable)", async ({ page }) => {
        await page.goto("/en/");
        await expect(page).toHaveURL(/\/en\/?$/);
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });
});

test.describe("a returning visitor's cookie beats the browser language", () => {
    test.use({ locale: "en-US" });

    test("keeps a fr-cookie visitor on the French URL despite an English browser", async ({ page, context }) => {
        await context.addCookies([
            { name: "lang", value: "fr", url: "http://localhost:4321" },
        ]);
        await page.goto("/");
        await expect(page).toHaveURL("/");
        await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    });
});
