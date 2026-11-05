import { text, type Localized } from "../text";

export const nav = {
    "mainnav": text("Navigation principale", "Main navigation"),
    "mobilenav": text("Navigation mobile", "Mobile navigation"),
    "home": text("accueil", "home"),
    "why": text("Pourquoi moi", "Why me"),
    "work": text("Réalisations", "Work"),
    "about": text("À propos", "About"),
    "method": text("Méthode", "Process"),
    "compare": text("Comparatif", "Comparison"),
    "pricing": text("Tarifs", "Pricing"),
    "faq": text("FAQ"),
    "showcase": text("Mode vitrine", "Showcase mode"),
    "quote": text("Devis gratuit", "Free quote"),
    "quotelong": text("Demander un devis gratuit", "Get a free quote"),
    "menufoot": text("Réponse sous 48 h", "Reply within 48 hours"),
    "language": text("Langue du site", "Site language"),
} satisfies Record<string, Localized>;
