// Single source of truth for the locales of the site.
// astro.config.ts, the middleware and App.LangCode all derive from these values.
export const LOCALES = ["fr", "en"] as const;

export const DEFAULT_LOCALE = "fr" satisfies Locale;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
    return (LOCALES as readonly string[]).includes(value);
}
