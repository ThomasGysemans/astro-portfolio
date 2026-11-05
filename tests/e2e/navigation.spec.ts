import { expect, test } from "@playwright/test";

test.use({ locale: "fr-FR" });

test.describe("navigation", () => {
    test("the header links reach the projects page", async ({ page }) => {
        await page.goto("/");
        const nav = page.getByRole("navigation", { name: "Navigation principale" });
        await nav.getByRole("link", { name: "Réalisations" }).click();
        await expect(page).toHaveURL(/\/projects\/?$/);
        // The heading follows the active filter; the default is "featured".
        await expect(page.getByRole("heading", { name: "Mes projets à la une" })).toBeVisible();
        // The current section is marked in the bar
        await expect(page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link", { name: "Réalisations" })).toHaveAttribute("aria-current", "page");
    });

    test("the language switch moves to the English URL and serves English", async ({ page, context }) => {
        await page.goto("/");
        // The EN pill records the explicit choice in a cookie, then navigates.
        await page.locator('a[data-set-lang="en"]').first().click();
        await expect(page).toHaveURL(/\/en\/?$/);
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
        const cookies = await context.cookies();
        expect(cookies.find(c => c.name === "lang")?.value).toBe("en");
    });

    test("the old freelance page permanently redirects to the homepage, in each language", async ({ request }) => {
        const fr = await request.get("/freelance", { maxRedirects: 0, headers: { accept: "text/html" } });
        expect(fr.status()).toBe(301);
        expect(fr.headers().location).toBe("/");
        const en = await request.get("/en/freelance", { maxRedirects: 0, headers: { accept: "text/html" } });
        expect(en.status()).toBe(301);
        expect(en.headers().location).toMatch(/^\/en\/?$/);
    });
});
