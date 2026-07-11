// PocketBase rate-limits per IP, but every SSR fetch leaves from the server
// (the Vercel function), so all visitors would otherwise share the proxy's
// single bucket. The middleware stores the visitor's IP for the lifetime of
// the request (AsyncLocalStorage survives Astro's streamed rendering, where
// data fetching happens after the middleware chain has returned) and every
// PocketBase client forwards it as `X-Forwarded-For`. PocketBase only trusts
// the header once it is listed in Settings → Application → user IP proxy
// headers; until then it keeps using the connecting IP, so sending it is
// always harmless.
import { AsyncLocalStorage } from "node:async_hooks";
import type PocketBase from "pocketbase";

const currentIP = new AsyncLocalStorage<string>();

export function withClientIP<T>(ip: string | undefined, run: () => T): T {
    // No IP available (prerendering, adapter without support): keep whatever
    // ambient context exists rather than shadowing it with an empty one.
    return ip ? currentIP.run(ip, run) : run();
}

// Makes every request of the client carry the visitor's IP resolved at send
// time — the hook must not capture an IP eagerly, because the public client
// is a module-level singleton shared by concurrent requests.
export function forwardClientIP(client: PocketBase): void {
    client.beforeSend = (url, options) => {
        const ip = currentIP.getStore();
        if (ip) {
            options.headers = { ...options.headers, "X-Forwarded-For": ip };
        }
        return { url, options };
    };
}
