import type { AstroCookies } from "astro";

export function createCookie(cookies: AstroCookies, name: string, value: string): void {
    cookies.set(name, value, {
        path: '/',
        httpOnly: true,
        sameSite: true,
        secure: true,
    });
}