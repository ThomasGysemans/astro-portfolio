import { text, type Localized } from "../text";

export const showcase = {
    "title": text(
        "Portfolio de Thomas Gysemans - Vitrine de mes projets principaux",
        "Portfolio of Thomas Gysemans - Showcase of my main projects",
    ),
    "description": text(
        "Une visite immersive de mes meilleurs projets.",
        "An immersive tour of my best projects.",
    ),
    "label": text("VITRINE", "SHOWCASE"),
    "mybestprojects": text("Mes meilleurs projets", "My best projects"),
    "exit": text("Quitter la vitrine", "Exit showcase"),
    "traveltip": text("↑ ↓ ou cliquez sur un projet pour voyager", "↑ ↓ or click a project to travel"),
    "learnmore": text("En savoir plus", "Learn more"),
} satisfies Record<string, Localized>;
