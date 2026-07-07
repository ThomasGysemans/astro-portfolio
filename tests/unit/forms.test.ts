import { describe, expect, it } from "vitest";
import { ClientResponseError } from "pocketbase";
import { file, files, pbErrorMessage, text } from "@data/admin/forms";

function form(entries: [string, FormDataEntryValue][]): FormData {
    const data = new FormData();
    for (const [k, v] of entries) data.append(k, v);
    return data;
}

describe("text", () => {
    it("returns the trimmed value of a text field", () => {
        expect(text(form([["name", "  Hello  "]]), "name")).toBe("Hello");
    });

    it("returns an empty string for a missing field", () => {
        expect(text(form([]), "name")).toBe("");
    });

    it("returns an empty string when the field is a file", () => {
        expect(text(form([["name", new File(["x"], "a.txt")]]), "name")).toBe("");
    });
});

describe("file", () => {
    it("keeps a real upload", () => {
        const upload = new File(["content"], "photo.png", { type: "image/png" });
        expect(file(form([["thumb", upload]]), "thumb")).toBe(upload);
    });

    it("ignores an empty file input (size 0)", () => {
        const empty = new File([], "", { type: "application/octet-stream" });
        expect(file(form([["thumb", empty]]), "thumb")).toBeUndefined();
    });

    it("ignores a plain text value", () => {
        expect(file(form([["thumb", "not-a-file"]]), "thumb")).toBeUndefined();
    });

    it("returns undefined for a missing field", () => {
        expect(file(form([]), "thumb")).toBeUndefined();
    });
});

describe("files", () => {
    it("returns only the real uploads among several entries", () => {
        const a = new File(["a"], "a.png");
        const empty = new File([], "");
        const b = new File(["b"], "b.png");
        const result = files(form([["pics", a], ["pics", empty], ["pics", b]]), "pics");
        expect(result).toEqual([a, b]);
    });

    it("returns an empty array when there is nothing", () => {
        expect(files(form([]), "pics")).toEqual([]);
    });
});

describe("pbErrorMessage", () => {
    it("returns a plain Error message", () => {
        expect(pbErrorMessage(new Error("boom"))).toBe("boom");
    });

    it("returns a generic message for a non-Error value", () => {
        expect(pbErrorMessage("weird")).toBe("Erreur inconnue.");
    });

    it("appends the per-field validation details of a PocketBase error", () => {
        const err = new ClientResponseError({
            status: 400,
            response: {
                message: "Failed to create record.",
                data: {
                    slug: { message: "Value must be unique." },
                    year: { message: "Required." },
                },
            },
        });
        const msg = pbErrorMessage(err);
        expect(msg).toContain("Failed to create record.");
        expect(msg).toContain("slug : Value must be unique.");
        expect(msg).toContain("year : Required.");
        expect(msg).toContain(" ; ");
    });

    it("returns just the message when a PocketBase error has no field details", () => {
        const err = new ClientResponseError({
            status: 403,
            response: { message: "Only superusers can perform this action." },
        });
        expect(pbErrorMessage(err)).toBe("Only superusers can perform this action.");
    });
});
