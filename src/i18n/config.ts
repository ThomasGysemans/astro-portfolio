// Single source of truth for the locales of the site.
// astro.config.ts, the middleware and App.LangCode all derive from these values.
export const LOCALES = ["fr", "en"] as const;

export const DEFAULT_LOCALE = "fr" satisfies Locale;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
    return (LOCALES as readonly string[]).includes(value);
}

// The visitor's preferred locale from an `Accept-Language` header, honouring
// the quality (`;q=`) ranking and matching on the base tag ("en-US" -> "en").
// Falls back to the default locale when none of ours are requested.
export function preferredLocale(header: string | null): Locale {
    if (!header) return DEFAULT_LOCALE;
    const ranked = header
        .split(",")
        .map((part) => {
            const [tag, q] = part.trim().split(";q=");
            return { base: tag.toLowerCase().split("-")[0], q: q ? parseFloat(q) : 1 };
        })
        .sort((a, b) => b.q - a.q);
    for (const { base } of ranked) {
        const match = LOCALES.find((locale) => locale === base);
        if (match) return match;
    }
    return DEFAULT_LOCALE;
}
