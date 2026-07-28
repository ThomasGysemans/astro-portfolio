import { contact } from "@i18n/translations/contact";

// Where every "contact me" affordance of the site ultimately leads. Kept in one
// module because the header, the footer, the availability badge and the
// freelance page all point at it: a second literal would drift.
//
// Imports the translation namespace directly rather than "@i18n", which
// re-exports the path helpers and would drag in the "astro:i18n" virtual module.
export const EMAIL = "contact@thomasgysemans.dev";
export const MALT_URL = "https://malt.fr/profile/thomasgysemans";

// A `mailto:` opens an empty compose window, and an empty compose window is
// where a quote request dies: the visitor has to invent, alone, how to open a
// money conversation with a stranger. Pre-filling a subject and a three-line
// skeleton answers "what do I write" before the question is asked.
//
// `body` is optional so a richer composer can pass a brief the visitor filled in
// on the page; without it, the localized template is used as-is.
export function mailtoHref(lang: App.LangCode, body?: string): string {
    // CRLF, not LF: Outlook and several Windows clients ignore a lone \n and
    // collapse the whole body onto a single line.
    const text = (body ?? contact.body[lang]).replace(/\r?\n/g, "\r\n");
    const params = new URLSearchParams({ subject: contact.subject[lang], body: text });
    // URLSearchParams encodes spaces as "+", which mail clients render literally
    // in the body instead of as spaces.
    return `mailto:${EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
}

// True when the given locale-less pathname is the freelance page. The site's
// "contact me" links normally *navigate* to that page — but once the visitor is
// already on it, navigating there again reloads the page they are reading, so
// the same affordance has to become the actual ask instead.
export function isFreelancePath(langlessPathname: string): boolean {
    return langlessPathname.replace(/\/+$/, "") === "/freelance";
}
