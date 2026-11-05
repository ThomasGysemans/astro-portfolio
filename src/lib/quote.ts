// The quote request: the rules shared by the form (instant feedback in the
// browser) and the action that sends it (the only check that counts), and the
// mail it becomes. Pure, so both sides and the unit tests import it.
//
// Imports the translation namespace directly rather than "@i18n", which
// re-exports the path helpers and would drag in the "astro:i18n" virtual module.
import { contact } from "@i18n/translations/contact";

export const QUOTE_TYPES = ["site", "app", "soft", "unsure"] as const;
export type QuoteType = typeof QUOTE_TYPES[number];

export const IDEA_MIN = 20;
export const IDEA_MAX = 5000;
// Something, an @, a domain with a dot: enough to catch a typo (the most
// common being a missing ".com") without rejecting a real address.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EMAIL_MAX = 254;
// Deadline and budget are free text, but short
export const SHORT_MAX = 200;

export type QuoteRequest = {
    types: QuoteType[];
    idea: string;
    email: string;
    deadline?: string;
    budget?: string;
    lang: App.LangCode; // the language the visitor used, to answer in it
};

const LANGUAGES: Record<App.LangCode, string> = { fr: "français", en: "anglais" };

// "Not sure yet" means nothing next to an actual type: the form never sends
// both, and if a request does anyway, the actual types win.
export function quoteTypes(types: readonly QuoteType[]): QuoteType[] {
    const unique = [...new Set(types)];
    return unique.some(type => type !== "unsure") ? unique.filter(type => type !== "unsure") : unique;
}

// The types as a phrase in the given language: "Site web, application mobile
// et logiciel" (only the first one keeps its capital).
export function typesPhrase(types: readonly QuoteType[], lang: App.LangCode): string {
    const labels = quoteTypes(types).map((type, i) => {
        const label = {
            site: contact.typesite,
            app: contact.typeapp,
            soft: contact.typesoft,
            unsure: contact.typeunsure,
        }[type][lang];
        return i === 0 ? label : label.charAt(0).toLocaleLowerCase(lang) + label.slice(1);
    });
    return new Intl.ListFormat(lang, { type: "conjunction" }).format(labels);
}

// The mail as Thomas receives it: always in French, whatever the visitor's
// language (which is stated so he can answer in it). Plain text, and the
// visitor's address goes in Reply-To, not here only: answering is one click.
export function composeQuoteMail(request: QuoteRequest): { subject: string, text: string } {
    const types = typesPhrase(request.types, "fr");
    const optional = (value?: string) => value?.trim() || "non précisé";
    const text = [
        "Nouvelle demande de devis depuis thomasgysemans.dev",
        "",
        `Projet : ${types}`,
        `E-mail : ${request.email}`,
        `Échéance souhaitée : ${optional(request.deadline)}`,
        `Budget envisagé : ${optional(request.budget)}`,
        `Langue du visiteur : ${LANGUAGES[request.lang]}`,
        "",
        "Son idée :",
        request.idea.trim(),
    ].join("\n");
    return { subject: `Demande de devis : ${types}`, text };
}
