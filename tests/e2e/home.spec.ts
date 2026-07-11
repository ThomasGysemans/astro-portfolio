import { expect, test } from "@playwright/test";

// A French-speaking visitor is the default: no locale prefix, no redirect.
test.use({ locale: "fr-FR" });

test.describe("home page", () => {
    test("renders the French homepage at the prefix-less URL", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveURL("/");
        await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    });

    test("has a non-empty document title and a description meta tag", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/\S/);
        const description = page.locator('head meta[name="description"]');
        await expect(description).toHaveAttribute("content", /\S/);
    });

    test("shows the header navigation in French", async ({ page }) => {
        await page.goto("/");
        const nav = page.getByRole("navigation", { name: "Navigation principale" });
        await expect(nav.getByRole("link", { name: "Projets" })).toBeVisible();
        await expect(nav.getByRole("link", { name: "Accueil" })).toBeVisible();
    });

    test("exposes hreflang alternates for fr, en and x-default", async ({ page }) => {
        await page.goto("/");
        for (const hreflang of ["fr", "en", "x-default"]) {
            await expect(page.locator(`head link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1);
        }
    });
});
