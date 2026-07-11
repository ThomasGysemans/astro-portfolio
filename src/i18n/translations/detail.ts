import { text, type Localized } from "../text";

export const detail = {
    "allprojects": text("Tous les projets", "All projects"),
    "visit": text("Voir en ligne ↗", "View it live ↗"),
    "githubrepo": text("Repo GitHub", "GitHub repo"),
    "aboutproject": text("À propos de ce projet", "About this project"),
    "techstack": text("Stack technique", "Tech stack"),
    "year": text("Année", "Year"),
    "categories": text("Catégories", "Categories"),
    "team": text("Équipe", "Team"),
    "context": text("Contexte", "Context"),
    "languages": text("Langues", "Languages"),
    "moreprojects": text("Autres projets", "More projects"),
} satisfies Record<string, Localized>;
