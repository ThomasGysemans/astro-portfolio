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
        lang: string,
    }
}