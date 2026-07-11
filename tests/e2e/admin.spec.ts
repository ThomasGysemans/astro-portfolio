import { expect, test } from "@playwright/test";

// The back-office is gated by `adminMiddleware`.
test.use({ locale: "fr-FR" });

test.describe("back-office gate", () => {
    test("redirects a logged-out visitor from /admin to the login page", async ({ page }) => {
        await page.goto("/admin");
        await expect(page).toHaveURL(/\/admin\/login\/?$/);
    });

    test("redirects a protected sub-route to the login page too", async ({ page }) => {
        await page.goto("/admin/projects");
        await expect(page).toHaveURL(/\/admin\/login\/?$/);
    });

    test("the login page shows an email and password form", async ({ page }) => {
        await page.goto("/admin/login");
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"], input[type="submit"]')).toBeVisible();
    });

    test("wrong credentials keep the user on the login page with an error", async ({ page }) => {
        await page.goto("/admin/login");
        await page.locator('input[name="email"]').fill("nobody@example.com");
        await page.locator('input[name="password"]').fill("wrong-password");
        await page.locator('button[type="submit"], input[type="submit"]').first().click();
        await expect(page).toHaveURL(/\/admin\/login\/?$/);
        await expect(page.getByText("Identifiants invalides.")).toBeVisible();
    });
});
