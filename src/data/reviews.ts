import type { Review } from "./models";
import { cached, pb } from "./pb";

// Client testimonials shown on the freelance page.
// Quotes are stored bare: the displaying page adds the quotation marks.
export async function getReviews(): Promise<Review[]> {
    return cached("reviews", async () => {
        const records = await pb.collection("reviews").getFullList({ sort: "-year" });
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
        }));
    });
}
