import { describe, expect, it } from "vitest";
import { countProjectsUsing, homepageWork, projectsYearRange } from "@data/projects";
import type { Project, ProjectTech } from "@data/models";

// Minimal Project builder — only the fields the functions under test read.
function makeProject(overrides: Partial<Project> = {}): Project {
    const empty = { fr: "", en: "" };
    return {
        slug: "demo",
        name: empty,
        featured: false,
        headline: false,
        onHomepage: false,
        categories: ["web"],
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
        updated: "2024-01-01T00:00:00.000Z",
        ...overrides,
    };
}

function tech(name: string): ProjectTech {
    return { name, color: "#000000", role: "language" };
}

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

describe("projectsYearRange", () => {
    it("follows the displayed `date`, not the `year` sorting key", () => {
        // sciencesky-like: an old project kept on top of the list by a recent `year`.
        const projects = [
            makeProject({ slug: "old", date: "2018", year: 2026 }),
            makeProject({ slug: "recent", date: "2026", year: 2026 }),
            makeProject({ slug: "mid", date: "2020", year: 2020 }),
        ];
        expect(projectsYearRange(projects)).toEqual({ from: 2018, to: 2026 });
    });

    it("reads both ends of a date range", () => {
        const projects = [makeProject({ date: "2018 → 2025", year: 2025 })];
        expect(projectsYearRange(projects)).toEqual({ from: 2018, to: 2025 });
    });

    it("falls back on `year` when the date holds no year", () => {
        const projects = [makeProject({ date: "en cours", year: 2024 })];
        expect(projectsYearRange(projects)).toEqual({ from: 2024, to: 2024 });
    });

    it("returns undefined without projects", () => {
        expect(projectsYearRange([])).toBeUndefined();
    });
});

// The owner picks the homepage cards in the back-office; the section must
// follow those flags exactly, with nothing standing in for a missing one.
describe("homepageWork", () => {
    const slugs = (list: Project[]) => list.map(p => p.slug);

    it("puts the headline first and the projects checked for the homepage under it", () => {
        const projects = [
            makeProject({ slug: "a", featured: true }),
            makeProject({ slug: "b", onHomepage: true }),
            makeProject({ slug: "c", headline: true }),
            makeProject({ slug: "d", onHomepage: true }),
        ];
        const { headline, others } = homepageWork(projects);
        expect(headline?.slug).toBe("c");
        expect(slugs(others)).toEqual(["b", "d"]);
    });

    it("keeps every project checked for the homepage, not just two", () => {
        const projects = ["a", "b", "c", "d"].map(slug => makeProject({ slug, onHomepage: true }));
        expect(slugs(homepageWork(projects).others)).toEqual(["a", "b", "c", "d"]);
    });

    it("does not show the headline twice when it is also checked for the homepage", () => {
        const projects = [makeProject({ slug: "a", headline: true, onHomepage: true }), makeProject({ slug: "b", onHomepage: true })];
        const { headline, others } = homepageWork(projects);
        expect(headline?.slug).toBe("a");
        expect(slugs(others)).toEqual(["b"]);
    });

    it("promotes no card to the headline when none is flagged", () => {
        const { headline, others } = homepageWork([makeProject({ slug: "a", onHomepage: true })]);
        expect(headline).toBeUndefined();
        expect(slugs(others)).toEqual(["a"]);
    });

    it("shows nothing when nothing is flagged, featured projects included", () => {
        const projects = ["a", "b", "c"].map(slug => makeProject({ slug, featured: true }));
        expect(homepageWork(projects)).toEqual({ headline: undefined, others: [] });
    });
});
