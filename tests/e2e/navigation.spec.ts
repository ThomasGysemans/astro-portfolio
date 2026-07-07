import { expect, test } from "@playwright/test";

test.use({ locale: "fr-FR" });

test.describe("navigation", () => {
    test("the header links reach the projects page", async ({ page }) => {
        await page.goto("/");
        const nav = page.getByRole("navigation", { name: "Navigation principale" });
        await nav.getByRole("link", { name: "Projets" }).click();
        await expect(page).toHaveURL(/\/projects\/?$/);
        await expect(page.getByRole("heading", { name: "Tous mes projets" })).toBeVisible();
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
});
