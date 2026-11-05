import { describe, expect, it } from "vitest";
import { composeQuoteMail, EMAIL_PATTERN, quoteTypes, typesPhrase } from "@lib/quote";

describe("quoteTypes", () => {
    it("keeps several actual types", () => {
        expect(quoteTypes(["site", "app"])).toEqual(["site", "app"]);
    });

    it("drops \"not sure yet\" next to an actual type, and duplicates", () => {
        expect(quoteTypes(["unsure", "site", "site"])).toEqual(["site"]);
        expect(quoteTypes(["unsure"])).toEqual(["unsure"]);
    });
});

describe("typesPhrase", () => {
    it("reads as a sentence in each language", () => {
        expect(typesPhrase(["site", "app", "soft"], "fr")).toBe("Site web, application mobile et logiciel");
        expect(typesPhrase(["site", "app"], "en")).toBe("Website and mobile app");
    });
});

describe("EMAIL_PATTERN", () => {
    it("accepts real addresses and catches the usual typos", () => {
        expect(EMAIL_PATTERN.test("thomas@gysemans.dev")).toBe(true);
        expect(EMAIL_PATTERN.test("jean.dupont+devis@mail.example.fr")).toBe(true);
        expect(EMAIL_PATTERN.test("thomas@gysemans")).toBe(false);
        expect(EMAIL_PATTERN.test("thomas gysemans.dev")).toBe(false);
        expect(EMAIL_PATTERN.test("@gysemans.dev")).toBe(false);
    });
});

describe("composeQuoteMail", () => {
    it("writes the request in French for Thomas, whatever the visitor's language", () => {
        const { subject, text } = composeQuoteMail({
            types: ["site", "app"],
            idea: "  A website and an app for my restaurant.  ",
            email: "visitor@example.com",
            budget: "2 000 €",
            lang: "en",
        });
        expect(subject).toBe("Demande de devis : Site web et application mobile");
        expect(text).toContain("Projet : Site web et application mobile");
        expect(text).toContain("E-mail : visitor@example.com");
        expect(text).toContain("Échéance souhaitée : non précisé");
        expect(text).toContain("Budget envisagé : 2 000 €");
        expect(text).toContain("Langue du visiteur : anglais");
        expect(text.endsWith("Son idée :\nA website and an app for my restaurant.")).toBe(true);
    });
});
