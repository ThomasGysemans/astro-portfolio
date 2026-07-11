// Authentication of the back-office (/admin): PocketBase superusers only.
// The superuser token lives in an httpOnly cookie; every admin request gets
// its own authenticated client so the shared public client of pb.ts
// never carries credentials.
import PocketBase from "pocketbase";
import type { AstroCookies } from "astro";
import { forwardClientIP } from "@data/client-ip";

export const ADMIN_COOKIE = "admin_token";

// The superuser token itself expires (PocketBase decides its duration),
// so the cookie can safely outlive it: an expired token fails `isValid`
// and sends the visitor back to the login page.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function newClient(): PocketBase {
    const client = new PocketBase(import.meta.env.POCKETBASE_URL);
    client.autoCancellation(false);
    // Auth endpoints have the strictest per-IP rate limits: make sure a
    // login/refresh counts against the visitor's IP, not the server's.
    forwardClientIP(client);
    return client;
}

// Exchanges superuser credentials for a token. Throws on invalid credentials.
export async function adminLogin(email: string, password: string): Promise<string> {
    const client = newClient();
    const auth = await client.collection("_superusers").authWithPassword(email, password);
    return auth.token;
}

// An authenticated client built from the cookie, or null when the visitor
// is not (or no longer) a logged-in superuser. The token is confirmed with
// PocketBase, not just decoded: `authStore.isValid` only reads the payload and
// checks expiry — it never verifies the signature — so a forged token would
// otherwise pass. `authRefresh` proves the signature server-side.
export async function adminFromCookies(cookies: AstroCookies): Promise<PocketBase | null> {
    const token = cookies.get(ADMIN_COOKIE)?.value;
    if (!token) return null;

    const client = newClient();
    client.authStore.save(token, null);
    // Reject empty/expired/non-superuser tokens locally first, before spending
    // a network round-trip on them.
    if (!client.authStore.isValid || !client.authStore.isSuperuser) return null;

    try {
        // Verifies the token's signature and that the superuser still exists;
        // throws on a forged or revoked token, and refreshes the auth store.
        await client.collection("_superusers").authRefresh();
    } catch {
        return null;
    }
    return client.authStore.isValid && client.authStore.isSuperuser ? client : null;
}

export function setAdminCookie(cookies: AstroCookies, token: string): void {
    cookies.set(ADMIN_COOKIE, token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: import.meta.env.PROD,
        maxAge: COOKIE_MAX_AGE,
    });
}

export function clearAdminCookie(cookies: AstroCookies): void {
    cookies.delete(ADMIN_COOKIE, { path: "/" });
}
