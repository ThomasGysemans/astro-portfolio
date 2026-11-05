import { text, type Localized } from "../text";

// Copy of the quote request. The subject and the bodies are what the visitor's
// mail client opens with, so they are read *outside* the page: plain text, no
// HTML. `{…}` placeholders are filled in by the form.
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
    // The request written by the form
    "subjecttype": text("Demande de devis : {type}", "Quote request: {type}"),
    "brief": text(
        [
            "Bonjour Thomas,",
            "",
            "Mon projet : {type}",
            "",
            "{idea}",
            "",
            "Échéance souhaitée : {deadline}",
            "Budget envisagé : {budget}",
        ].join("\n"),
        [
            "Hi Thomas,",
            "",
            "My project: {type}",
            "",
            "{idea}",
            "",
            "Ideal deadline: {deadline}",
            "Budget in mind: {budget}",
        ].join("\n"),
    ),
    "undecided": text("à définir ensemble", "to be defined together"),

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
    "deadlinelabel": text("Échéance souhaitée", "Ideal deadline"),
    "deadlineplaceholder": text("Par exemple : mars 2027", "For example: March 2027"),
    "budgetlabel": text("Budget envisagé", "Budget in mind"),
    "budgetplaceholder": text("Par exemple : 1 500 €", "For example: €1,500"),
    "optional": text("(facultatif)", "(optional)"),
    "submit": text("Demander un devis gratuit", "Get a free quote"),
    "howitworks": text(
        "Votre messagerie s'ouvre avec votre demande déjà rédigée : il ne reste qu'à l'envoyer. Rien n'est enregistré sur ce site.",
        "Your email app opens with your request already written: you just have to send it. Nothing is stored on this site.",
    ),
    "errtype": text("Choisissez au moins un type de projet.", "Choose at least one type of project."),
    "erridea": text("Décrivez votre idée en quelques mots.", "Describe your idea in a few words."),
    "errideashort": text("Ajoutez quelques détails, 20 caractères au minimum.", "Add a few details, 20 characters minimum."),
    "errone": text("1 champ à corriger.", "1 field to fix."),
    "errmany": text("{count} champs à corriger.", "{count} fields to fix."),
    "padproject": text("projet", "project"),
    "padidea": text("idée", "idea"),

    // Once the mail client is open
    "donetitle": text("Votre demande est prête", "Your request is ready"),
    "donetext": text(
        "Votre messagerie s'est ouverte avec votre demande. Envoyez-la, et je vous réponds sous 48 h.",
        "Your email app has opened with your request. Send it, and I will reply within 48 hours.",
    ),
    "donefallback": text(
        "Rien ne s'est ouvert ? Copiez votre demande et envoyez-la à {email}.",
        "Nothing opened? Copy your request and send it to {email}.",
    ),
    "copybrief": text("Copier ma demande", "Copy my request"),
    "briefcopied": text("Demande copiée", "Request copied"),
    "briefcopyfailed": text("Copie impossible, le texte est sélectionné", "Could not copy, the text is selected"),
    "briefsr": text("Votre demande", "Your request"),
    "edit": text("Modifier ma demande", "Edit my request"),
    "direct": text("Vous préférez écrire directement ?", "Prefer to write directly?"),
} satisfies Record<string, Localized>;
