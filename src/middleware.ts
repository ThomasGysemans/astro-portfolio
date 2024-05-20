import { defineMiddleware } from "astro/middleware";
import { DAOUser } from "@db/models/DAOUser.ts";

export const onRequest = defineMiddleware(async (context, next) => {
    const pathname = context.url.pathname;

    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
        const isLogin = pathname.startsWith("/login");
        const isConnected = await DAOUser.isConnected(context.cookies);
        if (!isLogin && !isConnected) {
            return context.redirect("/");
        } else if (isLogin && isConnected) {
            return context.redirect("/admin");
        }
    }

    if (pathname.startsWith("/logout")) {
        if (context.cookies.has("user")) {
            context.cookies.delete("user");
        }
        return context.redirect("/");
    }

    return next();
});