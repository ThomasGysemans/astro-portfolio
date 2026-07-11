import { describe, expect, it } from "vitest";
import { text } from "@i18n/text";

describe("text", () => {
    it("defaults the English version to the French one", () => {
        expect(text("Bonjour")).toEqual({ fr: "Bonjour", en: "Bonjour" });
    });

    it("keeps both versions when the English one is provided", () => {
        expect(text("Bonjour", "Hello")).toEqual({ fr: "Bonjour", en: "Hello" });
    });

    it("does not treat an empty French string as missing", () => {
        expect(text("")).toEqual({ fr: "", en: "" });
    });
});
