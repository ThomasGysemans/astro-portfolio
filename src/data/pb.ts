import PocketBase from "pocketbase";

if (!import.meta.env.POCKETBASE_URL) {
    throw new Error("Missing environment variable 'POCKETBASE_URL'");
}

export const pb = new PocketBase(import.meta.env.POCKETBASE_URL);

// Concurrent SSR requests would cancel each other's identical queries otherwise.
pb.autoCancellation(false);

// The content changes rarely: a short in-memory cache (per serverless instance)
// spares PocketBase a round-trip on every page render.
const TTL_MS = 60_000;
const cache = new Map<string, { at: number, value: unknown }>();
// One in-flight load per key ("single flight"): several data functions derive
// from the same list (e.g. the homepage needs featured/carousel/count, all from
// the projects), so concurrent renders of a cold cache would otherwise each
// fire their own identical PocketBase query.
const pending = new Map<string, Promise<unknown>>();
// Bumped by invalidateCache() so a load started before a mutation cannot
// write its (pre-mutation) result into the fresh cache when it resolves.
let epoch = 0;

export async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) {
        return hit.value as T;
    }

    const inFlight = pending.get(key);
    if (inFlight) return inFlight as Promise<T>;

    const startedAt = epoch;
    const promise = load()
        .then(value => {
            if (startedAt === epoch) {
                cache.set(key, { at: Date.now(), value });
            }
            return value;
        })
        .finally(() => {
            if (pending.get(key) === promise) pending.delete(key);
        });
    pending.set(key, promise);
    return promise;
}

// The back-office calls this after every mutation so the same instance
// serves fresh content immediately (other instances expire within TTL_MS).
export function invalidateCache(): void {
    cache.clear();
    pending.clear();
    epoch++;
}
