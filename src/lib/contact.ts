import { contact } from "@i18n/translations/contact";

// Where every "contact me" affordance of the site ultimately leads. Kept in one
// module because the header, the footer, the FAQ and the quote form all point
// at it: a second literal would drift.
//
// Imports the translation namespace directly rather than "@i18n", which
// re-exports the path helpers and would drag in the "astro:i18n" virtual module.
export const EMAIL = "thomas@gysemans.dev";
export const MALT_URL = "https://malt.fr/profile/thomasgysemans";
export const GITHUB_URL = "https://github.com/ThomasGysemans";
export const LINKEDIN_URL = "https://fr.linkedin.com/in/thomas-gysemans-950536268";

// A `mailto:` opens an empty compose window, and an empty compose window is
// where a quote request dies: the visitor has to invent, alone, how to open a
// money conversation with a stranger. Pre-filling a subject and a three-line
// skeleton answers "what do I write" before the question is asked. (The quote
// form itself does not go through the visitor's mail app: see src/actions.)
export function mailtoHref(lang: App.LangCode): string {
    // CRLF, not LF: Outlook and several Windows clients ignore a lone \n and
    // collapse the whole body onto a single line.
    const text = contact.body[lang].replace(/\r?\n/g, "\r\n");
    const params = new URLSearchParams({ subject: contact.subject[lang], body: text });
    // URLSearchParams encodes spaces as "+", which mail clients render literally
    // in the body instead of as spaces.
    return `mailto:${EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
}
