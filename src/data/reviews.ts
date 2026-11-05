import type { Review } from "./models";
import { cached, pb } from "./pb";

// Client reviews shown on the homepage. Each one is Thomas's own summary of
// what the client said, not a verbatim quote, and is displayed as such.
export async function getReviews(): Promise<Review[]> {
    return cached("reviews", async () => {
        const records = await pb.collection("reviews").getFullList({ sort: "-year", expand: "project" });
        // en falls back to fr, like the project translations, when the
        // English columns are left empty in the back-office.
        return records.map(r => ({
            quote: { fr: r.quote_fr, en: r.quote_en || r.quote_fr },
            role: { fr: r.role_fr, en: r.role_en || r.role_fr },
            company: { fr: r.company_fr, en: r.company_en || r.company_fr },
            year: r.year,
            // Clamp to 1–5; legacy rows predating the field (0/undefined) show 5.
            rating: Math.min(5, Math.max(1, r.rating || 5)),
            // Whether the English quote is a real translation: when the EN
            // column is empty the page shows the French text as-is, so the
            // "Translated from French" note would be wrong twice.
            translated: !!r.quote_en,
            // Only the slug: the page resolves it against the public projects,
            // so a review never links to a hidden project (whose page is a 404)
            project: r.expand?.project?.slug,
        }));
    });
}
