import { expect, test, type Page } from "@playwright/test";

// The projects page is driven by the `ProjectsExplorer` Svelte island.
test.use({ locale: "fr-FR" });

// The layout wrapper. Scoping text queries here excludes Astro's dev-toolbar
// (a body-level sibling whose island inspector embeds the same label strings
// in hidden <code> elements, which would otherwise pollute getByText).
function content(page: Page) {
    return page.locator("body > div").first();
}

// The island hydrates on `client:idle`; wait until it actually reacts to a
// click before asserting, instead of racing the idle callback.
async function gotoHydratedProjects(page: Page) {
    await page.goto("/projects");
    const allPill = content(page).getByRole("button", { name: /^Tous/ });
    await expect(async () => {
        await allPill.click();
        await expect(allPill).toHaveAttribute("aria-pressed", "true", { timeout: 500 });
    }).toPass({ timeout: 15_000 });
    return allPill;
}

test.describe("projects explorer", () => {
    test("lists project cards", async ({ page }) => {
        await page.goto("/projects");
        await expect(content(page).getByRole("heading", { name: "Tous mes projets" })).toBeVisible();
        await expect(page.locator("article.explorer-card").first()).toBeVisible();
    });

    test("category pills toggle their pressed state", async ({ page }) => {
        const allPill = await gotoHydratedProjects(page);
        await expect(allPill).toHaveAttribute("aria-pressed", "true");

        const featuredPill = content(page).getByRole("button", { name: /^À la une/ });
        await featuredPill.click();
        await expect(featuredPill).toHaveAttribute("aria-pressed", "true");
        await expect(allPill).toHaveAttribute("aria-pressed", "false");
    });

    test("search narrows the results and clears back", async ({ page }) => {
        await gotoHydratedProjects(page);
        const cards = page.locator("article.explorer-card");
        await expect(cards.first()).toBeVisible();

        // A query that cannot match anything empties the grid.
        await page.getByRole("searchbox").fill("zzz-nothing-matches-this-xyz");
        await expect(cards).toHaveCount(0);
        await expect(content(page).getByText("Aucun projet ne correspond.", { exact: false })).toBeVisible();

        // "Show all projects" resets every active filter.
        await content(page).getByRole("button", { name: "Afficher tous les projets" }).click();
        await expect(cards.first()).toBeVisible();
    });

    test("clicking a technology chip filters by that technology", async ({ page }) => {
        await gotoHydratedProjects(page);
        const firstChip = page.locator("article.explorer-card button", { hasText: /\S/ }).first();
        const tech = (await firstChip.innerText()).trim();
        await firstChip.click();
        // The active-filter banner names the chosen technology.
        await expect(content(page).getByText("Projets réalisés avec", { exact: false })).toBeVisible();
        await expect(content(page).getByRole("button", { name: new RegExp(`Retirer le filtre ${tech}`) })).toBeVisible();
    });
});
