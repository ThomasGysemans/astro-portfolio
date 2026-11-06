import { describe, expect, it } from "vitest";
import { inlineLinks } from "@lib/inline-links";

const pages: Record<string, string> = { "space-visitor": "/projects/space-visitor" };
const resolve = (key: string) => pages[key];

describe("inlineLinks", () => {
    it("turns each [text](key) into a link and keeps the words around it", () => {
        expect(inlineLinks("With [Space Visitor](space-visitor), I learned.", resolve)).toEqual([
            { text: "With " },
            { text: "Space Visitor", href: "/projects/space-visitor" },
            { text: ", I learned." },
        ]);
    });

    it("leaves a key that leads nowhere as plain text, without its brackets", () => {
        const runs = inlineLinks("[ScienceSky](sciencesky) and [Space Visitor](space-visitor)", resolve);
        expect(runs.map(run => run.text).join("")).toBe("ScienceSky and Space Visitor");
        expect(runs[0]!.href).toBeUndefined();
    });

    it("returns a sentence without links as one run", () => {
        expect(inlineLinks("No link here.", resolve)).toEqual([{ text: "No link here." }]);
    });
});
