import type { Localized, TechGroupId, Technology } from "./models";
import { cached, pb } from "./pb";

// Display order of the groups in the "My tech skills" section.
export const GROUP_ORDER: TechGroupId[] = [
    "frontend-frameworks",
    "languages",
    "styling-markup",
    "backend-databases",
    "mobile-3d-games",
];

// Labels of the `group` select identifiers stored in PocketBase.
export const GROUP_TITLES: Record<TechGroupId, Localized> = {
    "frontend-frameworks": { fr: "Frameworks frontend", en: "Frontend frameworks" },
    "languages": { fr: "Langages", en: "Languages" },
    "styling-markup": { fr: "Styles & markup", en: "Styling & markup" },
    "backend-databases": { fr: "Backend & bases de données", en: "Backend & databases" },
    "mobile-3d-games": { fr: "Mobile, 3D & jeux", en: "Mobile, 3D & games" },
};

export async function getTechnologies(): Promise<Technology[]> {
    return cached("technologies", async () => {
        const records = await pb.collection("technologies").getFullList({ sort: "name" });
        return records.map(r => ({
            name: r.name,
            color: r.color,
            group: r.group,
        }));
    });
}
