import { describe, expect, it } from "vitest";
import { cached, invalidateCache } from "@data/pb";

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
