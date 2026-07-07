import { expect, test } from "@playwright/test";

test.use({ locale: "fr-FR" });

test.describe("404 page", () => {
    test("returns a 404 status and still renders the layout", async ({ page }) => {
        const response = await page.goto("/this-route-does-not-exist");
        expect(response?.status()).toBe(404);
        // The custom 404 page reuses the shared header.
        await expect(page.getByRole("navigation", { name: "Navigation principale" })).toBeVisible();
    });

    test("an unknown project slug 404s", async ({ page }) => {
        const response = await page.goto("/projects/definitely-not-a-real-slug");
        expect(response?.status()).toBe(404);
    });
});
