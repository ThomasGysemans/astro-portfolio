import { text, type Localized } from "../text";

export const footer = {
    "status": text(
        "Actuellement développeur indépendant, disponible pour donner vie à vos projets.",
        "Currently an independent developer, available to bring your projects to life.",
    ),
    "getintouch": text("Me contacter", "Get in touch"),
} satisfies Record<string, Localized>;

export const error = {
    "notfound": text("Page introuvable", "Page not found"),
    "backhome": text("Retour à l'accueil", "Back home"),
} satisfies Record<string, Localized>;
