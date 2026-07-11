import { text, type Localized } from "../text";

export const nav = {
    "home": text("Accueil", "Home"),
    "projects": text("Projets", "Projects"),
    "freelance": text("Freelance"),
    "showcase": text("Vitrine ✦", "Showcase ✦"),
    "mainnav": text("Navigation principale", "Main navigation"),
    "mobilenav": text("Navigation mobile", "Mobile navigation"),
} satisfies Record<string, Localized>;
