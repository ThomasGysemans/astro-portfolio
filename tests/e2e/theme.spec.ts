import { expect, test } from "@playwright/test";

test.use({ locale: "fr-FR" });

test.describe("theming (cookie-driven, no FOUC)", () => {
    test("defaults to the dark theme with no cookie", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    });

    test("renders the light theme when the theme cookie says so", async ({ page, context }) => {
        await context.addCookies([
            { name: "theme", value: "light", url: "http://localhost:4321" },
        ]);
        await page.goto("/");
        // Rendered server-side straight onto <html>, before any hydration.
        await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    });

    test("the header toggle flips the theme in the browser", async ({ page }) => {
        await page.goto("/");
        const html = page.locator("html");
        await expect(html).toHaveAttribute("data-theme", "dark");
        await page.getByRole("button", { name: /th[eè]me/i }).first().click();
        await expect(html).toHaveAttribute("data-theme", "light");
    });
});
