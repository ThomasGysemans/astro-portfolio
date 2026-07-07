import { describe, expect, it } from "vitest";
import { countProjectsUsing, getProjectBadge } from "@data/projects";
import { CATEGORIES } from "@data/categories";
import type { Project, ProjectCategory, ProjectTech } from "@data/models";

// Minimal Project builder — only the fields the functions under test read.
function makeProject(overrides: Partial<Project> = {}): Project {
    const empty = { fr: "", en: "" };
    return {
        slug: "demo",
        name: empty,
        featured: false,
        carousel: false,
        category: "web",
        type: "website",
        year: 2024,
        date: "2024",
        teamSize: 1,
        context: "personal",
        languages: [],
        thumb: "",
        thumbLarge: "",
        pictures: [],
        sub: empty,
        description: empty,
        about: empty,
        tagline: empty,
        caption: empty,
        techs: [],
        ...overrides,
    };
}

function tech(name: string): ProjectTech {
    return { name, color: "#000000", role: "language" };
}

describe("getProjectBadge", () => {
    it("uses the project's explicit badge when set", () => {
        expect(getProjectBadge(makeProject({ badge: "CUSTOM" }))).toBe("CUSTOM");
    });

    it("falls back to the category's default badge", () => {
        expect(getProjectBadge(makeProject({ category: "games" }))).toBe(CATEGORIES.games.badge);
    });

    it("derives the right default badge for every category", () => {
        for (const category of Object.keys(CATEGORIES) as ProjectCategory[]) {
            expect(getProjectBadge(makeProject({ category }))).toBe(CATEGORIES[category].badge);
        }
    });
});

describe("countProjectsUsing", () => {
    const projects = [
        makeProject({ slug: "a", techs: [tech("TypeScript"), tech("Svelte")] }),
        makeProject({ slug: "b", techs: [tech("TypeScript")] }),
        makeProject({ slug: "c", techs: [tech("Rust")] }),
    ];

    it("counts how many projects use a technology", () => {
        expect(countProjectsUsing(projects, "TypeScript")).toBe(2);
        expect(countProjectsUsing(projects, "Svelte")).toBe(1);
    });

    it("returns 0 for an unused technology", () => {
        expect(countProjectsUsing(projects, "COBOL")).toBe(0);
    });

    it("matches technology names exactly (case-sensitive)", () => {
        expect(countProjectsUsing(projects, "typescript")).toBe(0);
    });

    it("returns 0 on an empty project list", () => {
        expect(countProjectsUsing([], "TypeScript")).toBe(0);
    });
});
