import PocketBase from "pocketbase";
import { forwardClientIP } from "./client-ip";

if (!import.meta.env.POCKETBASE_URL) {
    throw new Error("Missing environment variable 'POCKETBASE_URL'");
}

export const pb = new PocketBase(import.meta.env.POCKETBASE_URL);

// Concurrent SSR requests would cancel each other's identical queries otherwise.
pb.autoCancellation(false);

// PocketBase rate-limits per IP: forward the visitor's, not the server's.
forwardClientIP(pb);

// A PocketBase that accepts connections but never answers would hold every
// page render: past this delay a read fails like an unreachable server, and
// the page falls back (see `cached`). The public client only reads; the
// back-office has its own clients, whose uploads may legitimately take longer.
const TIMEOUT_MS = 5_000;
const sendWithIP = pb.beforeSend!;
pb.beforeSend = (url, options) => {
    options.signal ??= AbortSignal.timeout(TIMEOUT_MS);
    return sendWithIP(url, options);
};

// Thrown by the data functions when PocketBase cannot be reached and there is
// no previously loaded copy to fall back on. Pages catch it (`ifAvailable`) to
// render without their content, or answer 503, instead of crashing.
export class ContentUnavailableError extends Error {
    constructor(key: string, options?: ErrorOptions) {
        super(`PocketBase is unreachable: "${key}" could not be loaded`, options);
        this.name = "ContentUnavailableError";
    }
}

// A failure that says nothing about the request itself: the server is down or
// unreachable (status 0, which also covers the timeout above), overloaded or
// behind a proxy that cannot reach it (5xx, e.g. nginx's 502), or rate-limiting
// (429). Any other error is a bug in the query and keeps surfacing as is.
function isUnreachable(error: unknown): boolean {
    const status = (error as { status?: unknown } | null)?.status;
    return typeof status === "number" && (status === 0 || status === 429 || status >= 500);
}

// The content changes rarely: a short in-memory cache (per serverless instance)
// spares PocketBase a round-trip on every page render.
const TTL_MS = 60_000;
// After PocketBase failed to answer, wait this long before asking again: a
// server that times out would otherwise cost every page render the full
// TIMEOUT_MS before falling back.
const RETRY_MS = 10_000;
// Expired entries are kept on purpose: they are the fallback when PocketBase
// is unreachable (an old copy beats an empty page).
const cache = new Map<string, { at: number, value: unknown }>();
// Time of the last failed load of each key, for RETRY_MS.
const failures = new Map<string, number>();
// One in-flight load per key ("single flight"): several data functions derive
// from the same list (e.g. the homepage needs the featured projects, the
// headline and the count, all from the projects), so concurrent renders of a cold cache would otherwise each
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

    // PocketBase failed a moment ago: don't wait on it again yet.
    const failedAt = failures.get(key);
    if (failedAt !== undefined && Date.now() - failedAt < RETRY_MS) {
        if (hit) return hit.value as T;
        throw new ContentUnavailableError(key);
    }

    const inFlight = pending.get(key);
    if (inFlight) return inFlight as Promise<T>;

    const startedAt = epoch;
    const promise = load()
        .then(value => {
            if (startedAt === epoch) {
                cache.set(key, { at: Date.now(), value });
                failures.delete(key);
            }
            return value;
        }, (error: unknown) => {
            if (!isUnreachable(error)) throw error;
            if (startedAt === epoch) failures.set(key, Date.now());
            console.warn(`[pocketbase] "${key}" could not be loaded (${error instanceof Error ? error.message : error}): ${hit ? "serving the last loaded copy" : "rendering without it"}.`);
            if (hit) return hit.value as T;
            throw new ContentUnavailableError(key, { cause: error });
        })
        .finally(() => {
            if (pending.get(key) === promise) pending.delete(key);
        });
    pending.set(key, promise);
    return promise;
}

// The value of a data function, or undefined when PocketBase is unreachable,
// for the pages that can render without it (any other error still throws).
export async function ifAvailable<T>(load: Promise<T>): Promise<T | undefined> {
    try {
        return await load;
    } catch (error) {
        if (error instanceof ContentUnavailableError) return undefined;
        throw error;
    }
}

// The back-office calls this after every mutation so the same instance
// serves fresh content immediately (other instances expire within TTL_MS).
export function invalidateCache(): void {
    cache.clear();
    failures.clear();
    pending.clear();
    epoch++;
}
