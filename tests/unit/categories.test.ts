import { describe, expect, it } from "vitest";
import { CATEGORIES, CONTEXTS, PROJECT_TYPES, TECH_ROLES } from "@data/categories";
import { GROUP_ORDER, GROUP_TITLES } from "@data/technologies";
import type { Localized } from "@data/models";

// The select identifiers stored in PocketBase must all have a complete,
// non-empty fr/en label — a missing one would render blank on the site.
function expectLocalized(value: Localized) {
    expect(value.fr.length).toBeGreaterThan(0);
    expect(value.en.length).toBeGreaterThan(0);
}

describe("CATEGORIES", () => {
    it("gives every category a complete label, singular and badge", () => {
        for (const meta of Object.values(CATEGORIES)) {
            expectLocalized(meta.label);
            expectLocalized(meta.single);
            expect(meta.badge.length).toBeGreaterThan(0);
        }
    });

    it("uses a valid hex colour for every filter dot", () => {
        for (const meta of Object.values(CATEGORIES)) {
            expect(meta.dot).toMatch(/^#[0-9A-Fa-f]{6}$/);
        }
    });
});

describe("select label maps", () => {
    it("localises every context", () => {
        for (const value of Object.values(CONTEXTS)) expectLocalized(value);
    });

    it("localises every project type", () => {
        for (const value of Object.values(PROJECT_TYPES)) expectLocalized(value);
    });

    it("localises every tech role", () => {
        for (const value of Object.values(TECH_ROLES)) expectLocalized(value);
    });
});

describe("technology groups", () => {
    it("localises every group title", () => {
        for (const value of Object.values(GROUP_TITLES)) expectLocalized(value);
    });

    it("orders exactly the known groups, without duplicates or gaps", () => {
        const titles = Object.keys(GROUP_TITLES).sort();
        expect([...GROUP_ORDER].sort()).toEqual(titles);
        expect(new Set(GROUP_ORDER).size).toBe(GROUP_ORDER.length);
    });
});
