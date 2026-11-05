import { text, type Localized } from "../text";

export const footer = {
    "status": text(
        "Actuellement développeur indépendant, disponible pour donner vie à vos projets.",
        "Currently an independent developer, available to bring your projects to life.",
    ),
    "site": text("Le site", "The site"),
    "elsewhere": text("Ailleurs", "Elsewhere"),
    "allprojects": text("Tous les projets", "All projects"),
    "credit": text(
        "Conçu et codé par mes soins, étoiles, planètes et fusée comprises.",
        "Designed and coded by me, stars, planets and rocket included.",
    ),
} satisfies Record<string, Localized>;

export const error = {
    "title": text("Page introuvable", "Page not found"),
    "eyebrow": text("Erreur 404", "Error 404"),
    "heading": text("Cette page s'est perdue dans l'espace.", "This page got lost in space."),
    "text": text(
        "Le lien est peut-être ancien, ou l'adresse contient une faute de frappe. Pas de panique : la Terre n'est jamais loin.",
        "The link may be old, or the address may contain a typo. Don't panic: Earth is never far away.",
    ),
    "backhome": text("Retour à l'accueil", "Back home"),
    "seework": text("Voir les réalisations", "See my work"),
} satisfies Record<string, Localized>;

// The page answered (503) when PocketBase cannot be reached and the page has
// nothing to show without it: the project list, a project, the showcase
export const unavailable = {
    "title": text("Contenu momentanément indisponible", "Content temporarily unavailable"),
    "eyebrow": text("Erreur 503", "Error 503"),
    "heading": text("Le signal est coupé pour un moment.", "The signal is down for a moment."),
    "text": text(
        "Mes projets ne peuvent pas être chargés pour l'instant. Réessayez dans quelques minutes, ou parlez-moi de votre projet en attendant.",
        "My projects cannot be loaded right now. Try again in a few minutes, or tell me about your project in the meantime.",
    ),
    "retry": text("Réessayer", "Try again"),
} satisfies Record<string, Localized>;
