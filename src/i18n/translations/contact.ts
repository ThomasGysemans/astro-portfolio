import { text, type Localized } from "../text";

// Copy of the contact affordances. `subject` and `body` prefill the visitor's
// mail client when they write directly (mailto links), so they are read
// *outside* the page: plain text, no HTML. The quote form itself sends its
// request from the server (src/actions), in a mail composed by lib/quote.ts.
//
// The default body ends on a permission line ("a rough idea is enough"): what
// stops a prospect is not the address, it is not knowing what to write, and
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

    // The form
    "legend": text("Votre projet", "Your project"),
    "several": text("(plusieurs choix possibles)", "(several choices allowed)"),
    "typesite": text("Site web", "Website"),
    "typeapp": text("Application mobile", "Mobile app"),
    "typesoft": text("Logiciel", "Software"),
    "typeunsure": text("Pas encore sûr", "Not sure yet"),
    "idealabel": text("Votre idée, en quelques lignes", "Your idea, in a few lines"),
    "ideahint": text("Une idée approximative suffit.", "A rough idea is enough."),
    "ideaplaceholder": text(
        "Par exemple : un site pour présenter mon restaurant, avec la carte et la réservation.",
        "For example: a site to present my restaurant, with the menu and table booking.",
    ),
    "emaillabel": text("Votre adresse e-mail", "Your email address"),
    "emailplaceholder": text("nom@exemple.fr", "name@example.com"),
    "deadlinelabel": text("Échéance souhaitée", "Ideal deadline"),
    "deadlineplaceholder": text("Par exemple : mars 2027", "For example: March 2027"),
    "budgetlabel": text("Budget envisagé", "Budget in mind"),
    "budgetplaceholder": text("Par exemple : 1 500 €", "For example: €1,500"),
    "optional": text("(facultatif)", "(optional)"),
    "submit": text("Demander un devis gratuit", "Get a free quote"),
    "sending": text("Envoi en cours…", "Sending…"),
    "howitworks": text(
        "Votre demande m'arrive directement par e-mail. Votre adresse sert uniquement à vous répondre.",
        "Your request comes straight to my inbox. Your address is only used to reply to you.",
    ),
    "errtype": text("Choisissez au moins un type de projet.", "Choose at least one type of project."),
    "erridea": text("Décrivez votre idée en quelques mots.", "Describe your idea in a few words."),
    "errideashort": text("Ajoutez quelques détails, 20 caractères au minimum.", "Add a few details, 20 characters minimum."),
    "erremail": text("Indiquez votre adresse e-mail.", "Enter your email address."),
    "erremailformat": text(
        "Cette adresse semble incomplète, par exemple : nom@exemple.fr",
        "This address looks incomplete, for example: name@example.com",
    ),
    "errone": text("1 champ à corriger.", "1 field to fix."),
    "errmany": text("{count} champs à corriger.", "{count} fields to fix."),
    "errsend": text(
        "L'envoi a échoué. Réessayez dans un instant, ou écrivez-moi directement à {email}.",
        "Sending failed. Try again in a moment, or write to me directly at {email}.",
    ),
    "padproject": text("projet", "project"),
    "pademail": text("e-mail", "email"),
    "padidea": text("idée", "idea"),

    // Once the request is sent
    "donetitle": text("Demande envoyée !", "Request sent!"),
    "donetext": text(
        "Merci ! Je vous réponds sous 48 h, à l'adresse {email}.",
        "Thank you! I will reply within 48 hours, at {email}.",
    ),
    "another": text("Envoyer une autre demande", "Send another request"),
    "direct": text("Vous préférez écrire directement ?", "Prefer to write directly?"),
} satisfies Record<string, Localized>;
