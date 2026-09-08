import { describe, expect, it } from "vitest";
import { isVideo, mediaKind, mergeMedia, parseEmbeds, youtubeEmbedUrl, youtubeId } from "@data/media";

describe("youtubeId", () => {
    // Every URL form the back-office may receive from a copy/paste.
    it.each([
        ["https://youtu.be/0IFQUaUi2pw", "0IFQUaUi2pw"],
        ["https://youtu.be/0IFQUaUi2pw?t=42", "0IFQUaUi2pw"],
        ["https://www.youtube.com/watch?v=0IFQUaUi2pw", "0IFQUaUi2pw"],
        ["https://www.youtube.com/watch?v=0IFQUaUi2pw&list=PL123", "0IFQUaUi2pw"],
        ["https://m.youtube.com/watch?v=0IFQUaUi2pw", "0IFQUaUi2pw"],
        ["https://www.youtube.com/embed/0IFQUaUi2pw", "0IFQUaUi2pw"],
        ["https://www.youtube-nocookie.com/embed/0IFQUaUi2pw", "0IFQUaUi2pw"],
        ["https://www.youtube.com/shorts/0IFQUaUi2pw", "0IFQUaUi2pw"],
        ["https://www.youtube.com/live/0IFQUaUi2pw", "0IFQUaUi2pw"],
        ["  https://youtu.be/0IFQUaUi2pw  ", "0IFQUaUi2pw"],
    ])("reads the id out of %s", (url, id) => {
        expect(youtubeId(url)).toBe(id);
    });

    // The parser doubles as the validator on both sides of the form, so
    // anything it accepts ends up in an <iframe> src: it must stay strict.
    it.each([
        "",
        "not a url",
        "0IFQUaUi2pw",
        "https://vimeo.com/123456789",
        "https://youtu.be/tooshort",
        "https://www.youtube.com/watch?v=waytoolongforanid",
        "https://www.youtube.com/results?search_query=0IFQUaUi2pw",
        "javascript:alert(1)//youtu.be/0IFQUaUi2pw",
        "https://evil-youtube.com/watch?v=0IFQUaUi2pw",
        "https://youtu.be.evil.com/0IFQUaUi2pw",
    ])("rejects %s", url => {
        expect(youtubeId(url)).toBeNull();
    });
});

describe("mediaKind", () => {
    it("tells the three media apart", () => {
        expect(mediaKind("https://youtu.be/0IFQUaUi2pw")).toBe("youtube");
        expect(mediaKind("demo_a1b2c3.mp4")).toBe("video");
        expect(mediaKind("shot_a1b2c3.png?thumb=800x0")).toBe("image");
    });

    it("keeps isVideo about uploaded files only", () => {
        expect(isVideo("clip.webm")).toBe(true);
        expect(isVideo("https://youtu.be/0IFQUaUi2pw")).toBe(false);
    });
});

describe("youtubeEmbedUrl", () => {
    it("plays from the cookie-less host", () => {
        expect(youtubeEmbedUrl("0IFQUaUi2pw")).toContain("https://www.youtube-nocookie.com/embed/0IFQUaUi2pw?");
        expect(youtubeEmbedUrl("0IFQUaUi2pw")).not.toContain("autoplay");
        expect(youtubeEmbedUrl("0IFQUaUi2pw", true)).toContain("autoplay=1");
    });
});

describe("parseEmbeds", () => {
    it("keeps the well-formed entries and trims the links", () => {
        expect(parseEmbeds([{ url: " https://youtu.be/0IFQUaUi2pw ", position: 2 }]))
            .toEqual([{ url: "https://youtu.be/0IFQUaUi2pw", position: 2 }]);
    });

    // The column is hand-editable from the PocketBase dashboard: a broken
    // value must be dropped, never rendered as an <iframe> src.
    it.each([
        ["not an array", "nope"],
        ["a null column", null],
        ["a non-YouTube link", [{ url: "https://vimeo.com/1", position: 0 }]],
        ["a missing position", [{ url: "https://youtu.be/0IFQUaUi2pw" }]],
        ["a non-numeric position", [{ url: "https://youtu.be/0IFQUaUi2pw", position: "0" }]],
        ["a bare string", ["https://youtu.be/0IFQUaUi2pw"]],
        ["a null entry", [null]],
    ])("drops %s", (_label, value) => {
        expect(parseEmbeds(value)).toEqual([]);
    });
});

describe("mergeMedia", () => {
    const file = (name: string) => ({ name, youtube: false });
    const embed = (url: string) => ({ name: url, youtube: true });
    const yt = "https://youtu.be/0IFQUaUi2pw";
    const yt2 = "https://youtu.be/1IFQUaUi2pw";

    it("returns the files alone when there is no embed", () => {
        expect(mergeMedia(["a.png", "b.png"], [])).toEqual([file("a.png"), file("b.png")]);
    });

    it("lets an embed claim the index recorded with it", () => {
        expect(mergeMedia(["a.png", "b.png"], [{ url: yt, position: 1 }]))
            .toEqual([file("a.png"), embed(yt), file("b.png")]);
    });

    it("puts an embed first at position 0", () => {
        expect(mergeMedia(["a.png"], [{ url: yt, position: 0 }]))
            .toEqual([embed(yt), file("a.png")]);
    });

    it("interleaves several embeds, whatever order they are stored in", () => {
        expect(mergeMedia(["a.png", "b.png"], [{ url: yt2, position: 3 }, { url: yt, position: 0 }]))
            .toEqual([embed(yt), file("a.png"), file("b.png"), embed(yt2)]);
    });

    // A position beyond the list happens as soon as a file is deleted from
    // the PocketBase dashboard: the embed must land at the end, not vanish.
    it("appends an embed whose position overshoots the list", () => {
        expect(mergeMedia(["a.png"], [{ url: yt, position: 99 }]))
            .toEqual([file("a.png"), embed(yt)]);
    });

    it("keeps the embeds when the project has no file at all", () => {
        expect(mergeMedia([], [{ url: yt, position: 4 }])).toEqual([embed(yt)]);
    });
});
