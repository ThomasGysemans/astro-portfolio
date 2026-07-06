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

export async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) {
        return hit.value as T;
    }
    const value = await load();
    cache.set(key, { at: Date.now(), value });
    return value;
}

// The back-office calls this after every mutation so the same instance
// serves fresh content immediately (other instances expire within TTL_MS).
export function invalidateCache(): void {
    cache.clear();
}
