import { defineMiddleware, sequence } from "astro:middleware";
import { middleware } from "astro:i18n";

export const userMiddleware = defineMiddleware((context, next) => {
    const langCookie = context.cookies.get("lang") ;
    const url = context.url.pathname;

    if (langCookie) {
        context.locals.lang = langCookie.value as App.LangCode;
    }

    if (url.startsWith("/en")) {
        if (langCookie?.value !== "en") {
            context.cookies.set("lang", "en");
            context.locals.lang = "en";
        }
    } else {
        if (langCookie?.value !== "fr") {
            context.cookies.set("lang", "fr");
            context.locals.lang = "fr";
        }
    }

    return next();
});

export const onRequest = sequence(
    userMiddleware,
    middleware({
        redirectToDefaultLocale: true,
        prefixDefaultLocale: false,
        fallbackType: "redirect",
    }),
  )