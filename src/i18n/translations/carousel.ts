import { text, type Localized } from "../text";

export const carousel = {
    "previouspicture": text("Image précédente", "Previous picture"),
    "nextpicture": text("Image suivante", "Next picture"),
    "gotopicture": text("Aller à l'image", "Go to picture"),
    "pause": text("Mettre le défilement en pause", "Pause automatic slideshow"),
    "resume": text("Reprendre le défilement", "Resume automatic slideshow"),
} satisfies Record<string, Localized>;
