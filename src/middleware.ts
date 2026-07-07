import type { APIContext } from "astro";
import { defineMiddleware, sequence } from "astro:middleware";
import { DEFAULT_LOCALE, isLocale, preferredLocale } from "@i18n/config";
import { localeOfPath, pathInLocale } from "@i18n/paths";
import { adminFromCookies } from "@data/admin/client";

const LANG_COOKIE = "lang";
// Persist the language choice for a year so a returning visitor is never
// bounced by the `Accept-Language` auto-redirect again.
const LANG_COOKIE_OPTS = { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" as const };

// Top-level HTML navigations we may auto-redirect: not an asset, not a form
// POST, and not the French-only back-office (which has no locale prefix).
function isNavigablePage(context: APIContext): boolean {
    if (context.request.method !== "GET") return false;
    const path = context.url.pathname;
    if (path === "/admin" || path.startsWith("/admin/")) return false;
    if (path.startsWith("/_")) return false;
    // File-like routes (sitemap.xml, robots.txt, …) have no locale variant, so
    // redirecting them to a `/en/*` prefix would only 404.
    if (/\.[a-z0-9]+$/i.test(path)) return false;
    return (context.request.headers.get("accept") ?? "").includes("text/html");
}

export const userMiddleware = defineMiddleware((context, next) => {
    const themeCookie = context.cookies.get("theme");
    context.locals.theme = themeCookie?.value === "light" ? "light" : "dark";

    // The i18n fallback rewrite re-runs the chain; resolve the locale once.
    if (context.locals.lang) return next();

    const urlLocale = localeOfPath(context.url.pathname);
    context.locals.lang = urlLocale;

    const chosen = context.cookies.get(LANG_COOKIE)?.value;
    const preference = chosen !== undefined && isLocale(chosen) ? chosen : undefined;

    // Only the prefix-less URLs are ambiguous entry points we may redirect: a
    // `/en/*` URL is an explicit request for English and is always honoured
    // (crawlers included, so both language versions stay indexable). On the
    // default URLs, send the visitor to their preferred language — their past
    // choice (the `lang` cookie, set by the switch) first, otherwise their
    // browser's `Accept-Language`.
    if (urlLocale === DEFAULT_LOCALE && isNavigablePage(context)) {
        const target = preference ?? preferredLocale(context.request.headers.get("accept-language"));
        if (target !== DEFAULT_LOCALE) {
            context.cookies.set(LANG_COOKIE, target, LANG_COOKIE_OPTS);
            return context.redirect(pathInLocale(target, context.url.pathname) + context.url.search);
        }
    }

    // Remember the language actually being served for next time.
    if (chosen !== urlLocale) {
        context.cookies.set(LANG_COOKIE, urlLocale, LANG_COOKIE_OPTS);
    }

    return next();
});

// The back-office is only reachable by logged-in PocketBase superusers.
// It runs after userMiddleware, so a locale-prefixed URL has already been
// rewritten to its locale-less form when this executes.
export const adminMiddleware = defineMiddleware((context, next) => {
    const path = context.url.pathname;
    if (path !== "/admin" && !path.startsWith("/admin/")) {
        return next();
    }

    context.locals.admin = adminFromCookies(context.cookies);

    const onLoginPage = path === "/admin/login" || path === "/admin/login/";
    if (!context.locals.admin && !onLoginPage) {
        return context.redirect("/admin/login");
    }
    if (context.locals.admin && onLoginPage) {
        return context.redirect("/admin/projects");
    }
    return next();
});

// Astro's i18n middleware runs automatically now that `routing` is no longer
// "manual", so it no longer needs to be added to the sequence by hand.
export const onRequest = sequence(userMiddleware, adminMiddleware);
