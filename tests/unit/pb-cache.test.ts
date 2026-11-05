import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cached, ContentUnavailableError, ifAvailable, invalidateCache } from "@data/pb";

// What the PocketBase SDK throws when the server cannot be reached
// (ClientResponseError: refused connection, timeout…) or answers an error.
const unreachable = () => Object.assign(new Error("Something went wrong."), { status: 0 });
const badRequest = () => Object.assign(new Error("Invalid filter."), { status: 400 });

// Each test uses its own cache key: the cache is module-level state shared
// by the whole test file.

describe("cached", () => {
    it("loads once and serves the cached value afterwards", async () => {
        let loads = 0;
        const load = async () => {
            loads++;
            return "value";
        };
        expect(await cached("basic", load)).toBe("value");
        expect(await cached("basic", load)).toBe("value");
        expect(loads).toBe(1);
    });

    it("shares a single in-flight load between concurrent callers", async () => {
        let loads = 0;
        const load = async () => {
            loads++;
            return "value";
        };
        // Concurrent cold-cache calls, like the data functions all deriving
        // from the projects list during one page render.
        const results = await Promise.all([cached("dedup", load), cached("dedup", load), cached("dedup", load)]);
        expect(results).toEqual(["value", "value", "value"]);
        expect(loads).toBe(1);
    });

    it("does not cache a failed load", async () => {
        await expect(cached("retry", () => Promise.reject(new Error("boom")))).rejects.toThrow("boom");
        expect(await cached("retry", async () => "recovered")).toBe("recovered");
    });

    it("serves fresh data after invalidateCache", async () => {
        expect(await cached("invalidate", async () => "old")).toBe("old");
        invalidateCache();
        expect(await cached("invalidate", async () => "new")).toBe("new");
    });

    it("discards a load that resolves after an invalidation", async () => {
        let resolveLoad!: (value: string) => void;
        const inFlight = cached("stale", () => new Promise<string>(resolve => {
            resolveLoad = resolve;
        }));
        // The mutation lands while the load is in flight: its result predates
        // the mutation and must not be stored (the caller still receives it).
        invalidateCache();
        resolveLoad("stale");
        expect(await inFlight).toBe("stale");
        expect(await cached("stale", async () => "fresh")).toBe("fresh");
    });
});

describe("cached, when PocketBase is unreachable", () => {
    beforeEach(() => {
        // Only the clock is faked: promises still settle normally
        vi.useFakeTimers({ toFake: ["Date"] });
        vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("serves the last loaded copy, even once it has expired", async () => {
        expect(await cached("down-stale", async () => "last copy")).toBe("last copy");
        vi.advanceTimersByTime(5 * 60_000);
        expect(await cached("down-stale", () => Promise.reject(unreachable()))).toBe("last copy");
    });

    it("throws ContentUnavailableError when nothing was ever loaded", async () => {
        await expect(cached("down-cold", () => Promise.reject(unreachable()))).rejects.toBeInstanceOf(ContentUnavailableError);
    });

    it("waits a little before asking PocketBase again", async () => {
        let loads = 0;
        const failing = () => {
            loads++;
            return Promise.reject(unreachable());
        };
        await expect(cached("down-retry", failing)).rejects.toBeInstanceOf(ContentUnavailableError);
        // Right after the failure: answered at once, without waiting on PocketBase
        await expect(cached("down-retry", failing)).rejects.toBeInstanceOf(ContentUnavailableError);
        expect(loads).toBe(1);
        // A few seconds later, PocketBase is back
        vi.advanceTimersByTime(10_000);
        expect(await cached("down-retry", async () => "back")).toBe("back");
    });

    it("keeps surfacing the errors that are not about reachability", async () => {
        await expect(cached("bad-query", () => Promise.reject(badRequest()))).rejects.toThrow("Invalid filter.");
        // Not mistaken for an outage: the next call tries again at once
        expect(await cached("bad-query", async () => "fixed")).toBe("fixed");
    });
});

describe("ifAvailable", () => {
    it("resolves to undefined when the content is unavailable", async () => {
        expect(await ifAvailable(Promise.reject(new ContentUnavailableError("key")))).toBeUndefined();
    });

    it("passes the value through, and any other error", async () => {
        expect(await ifAvailable(Promise.resolve("value"))).toBe("value");
        await expect(ifAvailable(Promise.reject(new Error("bug")))).rejects.toThrow("bug");
    });
});
