import { text, type Localized } from "../text";

// Copy of the pre-filled quote request. The subject and the body are what the
// visitor's mail client opens with, so this is the only place on the site where
// a translation string is read *outside* the page — keep it plain text, no HTML.
//
// The body deliberately ends on a permission line ("a rough idea is enough"):
// what stops a prospect is not the address, it is not knowing what to write, and
// above all not knowing whether an unfinished idea is worth sending.
export const contact = {
    "subject": text("Demande de devis", "Quote request"),
    "body": text(
        [
            "Bonjour Thomas,",
            "",
            "Mon projet : ",
            "Idéalement livré pour : ",
            "Ordre de budget envisagé : ",
            "",
            "(Une idée approximative suffit, on affine ensemble.)",
        ].join("\n"),
        [
            "Hi Thomas,",
            "",
            "My project: ",
            "Ideally delivered by: ",
            "Budget range in mind: ",
            "",
            "(A rough idea is enough, we refine it together.)",
        ].join("\n"),
    ),
    "copyaddress": text("Copier l'adresse e-mail", "Copy the email address"),
    "copied": text("Adresse copiée", "Address copied"),
    "copyfailed": text("Copie impossible, sélectionnez l'adresse", "Copy failed, select the address"),
} satisfies Record<string, Localized>;
