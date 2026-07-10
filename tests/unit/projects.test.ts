import { describe, expect, it } from "vitest";
import { countProjectsUsing } from "@data/projects";
import type { Project, ProjectTech } from "@data/models";

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
