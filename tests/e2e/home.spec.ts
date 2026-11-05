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
        await expect(nav.getByRole("link", { name: "Réalisations" })).toBeVisible();
        await expect(nav.getByRole("link", { name: "Tarifs" })).toBeVisible();
        await expect(nav.getByRole("link", { name: "Devis gratuit" })).toBeVisible();
    });

    test("exposes hreflang alternates for fr, en and x-default", async ({ page }) => {
        await page.goto("/");
        for (const hreflang of ["fr", "en", "x-default"]) {
            await expect(page.locator(`head link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1);
        }
    });

    test("publishes the visible FAQ as FAQPage structured data", async ({ page }) => {
        await page.goto("/");
        const questions = page.locator("#faq details.qa");
        const count = await questions.count();
        expect(count).toBeGreaterThan(0);
        const scripts = await page.locator('head script[type="application/ld+json"]').allTextContents();
        const faq = scripts.map(s => JSON.parse(s)).find(data => data["@type"] === "FAQPage");
        expect(faq?.mainEntity).toHaveLength(count);
    });

    test("the quote form reports its missing fields instead of opening the mail app", async ({ page }) => {
        await page.goto("/");
        const form = page.locator("#devis-form");
        await form.getByRole("button", { name: "Demander un devis gratuit" }).click();
        await expect(page.locator("#err-type")).toHaveText("Choisissez le type de projet.");
        await expect(page.locator("#err-idea")).toHaveText("Décrivez votre idée en quelques mots.");
        await expect(page.locator("#idea")).toHaveAttribute("aria-invalid", "true");
        // Nothing was sent: the form is still there
        await expect(form).toBeVisible();
        await expect(page.locator("#form-done")).toBeHidden();
    });
});
