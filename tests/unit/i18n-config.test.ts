import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, isLocale, LOCALES, preferredLocale } from "@i18n/config";

describe("isLocale", () => {
    it("accepts the supported locales", () => {
        expect(isLocale("fr")).toBe(true);
        expect(isLocale("en")).toBe(true);
    });

    it("rejects anything else", () => {
        expect(isLocale("de")).toBe(false);
        expect(isLocale("EN")).toBe(false);
        expect(isLocale("")).toBe(false);
        expect(isLocale("en-US")).toBe(false);
    });
});

describe("preferredLocale", () => {
    it("falls back to the default locale when the header is absent", () => {
        expect(preferredLocale(null)).toBe(DEFAULT_LOCALE);
        expect(preferredLocale("")).toBe(DEFAULT_LOCALE);
    });

    it("falls back to the default locale when none of ours is requested", () => {
        expect(preferredLocale("de,es;q=0.8")).toBe(DEFAULT_LOCALE);
    });

    it("matches on the base tag, ignoring the region", () => {
        expect(preferredLocale("en-US")).toBe("en");
        expect(preferredLocale("en-GB,en;q=0.9")).toBe("en");
    });

    it("honours the quality ranking rather than the written order", () => {
        // fr is written first but requested with a lower quality than en.
        expect(preferredLocale("fr;q=0.5,en;q=0.9")).toBe("en");
        expect(preferredLocale("en;q=0.2,fr;q=0.8")).toBe("fr");
    });

    it("treats a missing q as the highest quality (1)", () => {
        expect(preferredLocale("en,fr;q=0.9")).toBe("en");
    });

    it("skips unsupported higher-ranked tags and picks the best supported one", () => {
        expect(preferredLocale("de;q=1,en;q=0.9,fr;q=0.8")).toBe("en");
    });

    it("only ever returns a supported locale", () => {
        expect(LOCALES).toContain(preferredLocale("zh,ja,ko"));
    });
});
