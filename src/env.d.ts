/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly SUPABASE_KEY: string;
    readonly SUPABASE_STORAGE_URL: string;
    readonly SUPABASE_STORAGE_BUCKET: string;
}

interface ImportEnv {
    readonly env: ImportMetaEnv;
}