/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly POCKETBASE_URL: string
}

interface ImportEnv {
    readonly env: ImportMetaEnv;
}

declare namespace App {
    interface Locals {
        lang: App.LangCode,
        theme: App.Theme,
        // Authenticated PocketBase superuser client; set by the middleware
        // on /admin routes only (null when the visitor is not logged in).
        admin?: import("pocketbase").default | null,
    }

    // Derived from the single source of truth in src/i18n/config.ts.
    type LangCode = import("./i18n/config").Locale;
    type Theme = "dark" | "light";
}