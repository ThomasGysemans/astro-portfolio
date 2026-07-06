import type { Locale } from "./config";

// A piece of copy available in every locale.
export type Localized = Record<Locale, string>;

// Shorthand to declare a localized text; the English version
// defaults to the French one when they are identical.
export function text(fr: string, en?: string): Localized {
    return {
        fr,
        en: en ?? fr,
    };
}
