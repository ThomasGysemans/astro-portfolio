import { describe, expect, it } from "vitest";
import { alternateLinks, localeOfPath, pathInLocale, stripLocale } from "@i18n/paths";

describe("stripLocale", () => {
    it("removes the non-default locale prefix", () => {
        expect(stripLocale("/en/projects/ysa")).toBe("/projects/ysa");
        expect(stripLocale("/en/freelance")).toBe("/freelance");
    });

    it("maps the bare locale root to the site root", () => {
        expect(stripLocale("/en")).toBe("/");
    });

    it("leaves default-locale (prefix-less) paths untouched", () => {
        expect(stripLocale("/projects")).toBe("/projects");
        expect(stripLocale("/")).toBe("/");
    });

    it("does not strip a path that merely starts with the locale letters", () => {
        expect(stripLocale("/english-notes")).toBe("/english-notes");
        expect(stripLocale("/enveloppe")).toBe("/enveloppe");
    });

    it("normalises duplicate slashes before matching", () => {
        expect(stripLocale("/en//projects")).toBe("/projects");
    });
});

describe("localeOfPath", () => {
    it("detects the locale from the prefix", () => {
        expect(localeOfPath("/en/projects")).toBe("en");
        expect(localeOfPath("/en")).toBe("en");
    });

    it("returns the default locale for prefix-less paths", () => {
        expect(localeOfPath("/projects")).toBe("fr");
        expect(localeOfPath("/")).toBe("fr");
    });

    it("is not fooled by paths that start with the locale letters", () => {
        expect(localeOfPath("/enveloppe")).toBe("fr");
    });
});

describe("pathInLocale", () => {
    // The trailing slash is dropped (except at the root) so the canonical URL,
    // the hreflang alternates and the sitemap all share one URL form.
    it("switches an English URL to its French (prefix-less) equivalent", () => {
        expect(pathInLocale("fr", "/en/projects")).toBe("/projects");
    });

    it("switches a French URL to its English (prefixed) equivalent", () => {
        expect(pathInLocale("en", "/projects")).toBe("/en/projects");
    });

    it("is idempotent when the locale already matches", () => {
        expect(pathInLocale("en", "/en/projects")).toBe("/en/projects");
    });

    it("keeps the English prefix on the root but drops it for French", () => {
        expect(pathInLocale("en", "/")).toBe("/en");
        expect(pathInLocale("fr", "/en")).toBe("/");
    });
});

describe("alternateLinks", () => {
    const domain = "https://thomasgysemans.dev";
    const links = alternateLinks("/en/projects", domain);

    it("emits one link per locale plus x-default", () => {
        const hreflangs = links.map(l => l.hreflang);
        expect(hreflangs).toContain("fr");
        expect(hreflangs).toContain("en");
        expect(hreflangs).toContain("x-default");
        expect(links).toHaveLength(3);
    });

    it("points every href at the same page in the right locale", () => {
        const by = Object.fromEntries(links.map(l => [l.hreflang, l.href]));
        expect(by.fr).toBe(`${domain}/projects`);
        expect(by.en).toBe(`${domain}/en/projects`);
    });

    it("points x-default at the default locale", () => {
        const xDefault = links.find(l => l.hreflang === "x-default");
        expect(xDefault?.href).toBe(`${domain}/projects`);
    });
});
