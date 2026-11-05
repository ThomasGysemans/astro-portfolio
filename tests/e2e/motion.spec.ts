import { expect, test } from "@playwright/test";

test.use({ locale: "fr-FR" });

// RGAA 13.8: everything that moves on its own can be paused, and the choice
// is remembered (in the browser only, nothing is sent anywhere).
test.describe("pause button", () => {
    test("animations run by default", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
    });

    test("pausing stops them and is remembered on the next page", async ({ page }) => {
        await page.goto("/");
        const pause = page.getByRole("button", { name: "Mettre en pause les animations" });
        await pause.click();
        await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
        await expect(page.getByRole("button", { name: "Reprendre les animations" })).toBeVisible();

        await page.goto("/projects");
        await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
    });

    test("the system setting turns them off from the first paint", async ({ browser }) => {
        const context = await browser.newContext({ reducedMotion: "reduce", locale: "fr-FR" });
        const page = await context.newPage();
        await page.goto("/");
        await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
        await context.close();
    });
});
