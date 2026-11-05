import { text, type Localized } from "../text";

export const detail = {
    "breadcrumb": text("Fil d'Ariane", "Breadcrumb"),
    "allprojects": text("Tous les projets", "All projects"),
    "visit": text("Voir en ligne", "View it live"),
    "githubrepo": text("Code sur GitHub", "Code on GitHub"),
    "aboutproject": text("À propos de ce projet", "About this project"),
    "techstack": text("Stack technique", "Tech stack"),
    "year": text("Année", "Year"),
    "categories": text("Catégories", "Categories"),
    "team": text("Équipe", "Team"),
    "context": text("Contexte", "Context"),
    "languages": text("Langues", "Languages"),
    "moreprojects": text("Autres projets", "More projects"),
    "gallery": text("Galerie du projet", "Project gallery"),
    "enlarge": text("Agrandir l'image", "Enlarge the picture"),
    "closepicture": text("Fermer l'image", "Close the picture"),
    "previouspicture": text("Image précédente", "Previous picture"),
    "nextpicture": text("Image suivante", "Next picture"),
    "zoomin": text("Zoomer sur l'image", "Zoom into the picture"),
    "zoomout": text("Dézoomer", "Zoom out"),
    "ctatitle": text("Un projet du même genre ?", "A project like this one?"),
    "ctatext": text(
        "Décrivez-le en quelques lignes, je vous réponds sous 48 h avec un devis gratuit.",
        "Describe it in a few lines, I reply within 48 hours with a free quote.",
    ),
} satisfies Record<string, Localized>;
