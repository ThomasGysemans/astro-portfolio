import { defineMiddleware, sequence } from "astro:middleware";
import { middleware } from "astro:i18n";
import { DEFAULT_LOCALE } from "@i18n/config";
import { localeOfPath, stripLocale } from "@i18n/paths";
import { adminFromCookies } from "@data/admin/client";

export const userMiddleware = defineMiddleware((context, next) => {
    const themeCookie = context.cookies.get("theme");
    context.locals.theme = themeCookie?.value === "light" ? "light" : "dark";

    // The guard matters: `context.rewrite` re-runs the middleware chain,
    // and the locale of the rewritten (locale-less) URL would be the default one.
    if (!context.locals.lang) {
        const lang = localeOfPath(context.url.pathname);
        context.locals.lang = lang;

        if (context.cookies.get("lang")?.value !== lang) {
            context.cookies.set("lang", lang, { path: "/" });
        }

        // Pages only exist once, without locale prefix: serve them
        // for the non-default locales by rewriting the URL.
        if (lang !== DEFAULT_LOCALE) {
            return context.rewrite(stripLocale(context.url.pathname) + context.url.search);
        }
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

export const onRequest = sequence(
    userMiddleware,
    adminMiddleware,
    middleware({
        prefixDefaultLocale: false,
        redirectToDefaultLocale: false,
        fallbackType: "rewrite",
    }),
)
