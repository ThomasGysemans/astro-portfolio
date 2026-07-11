// Server-side logic of the back-office review form (create + edit).
import type PocketBase from "pocketbase";
import { invalidateCache } from "@data/pb";
import { pbErrorMessage, text } from "./forms";
import type { ReviewFormValues } from "@components/pages/admin/AdminReviewFormPage.astro";

type PostResult = { redirect: string } | { error: string, values: ReviewFormValues };

export function parseReviewForm(data: FormData): ReviewFormValues {
    return {
        quote: text(data, "quote"),
        role: text(data, "role"),
        company: text(data, "company"),
        year: text(data, "year"),
        rating: text(data, "rating"),
        quoteEn: text(data, "quote_en"),
        roleEn: text(data, "role_en"),
        companyEn: text(data, "company_en"),
    };
}

export async function reviewFormValues(pb: PocketBase, id: string): Promise<ReviewFormValues | undefined> {
    try {
        const r = await pb.collection("reviews").getOne(id);
        return {
            quote: r.quote_fr,
            role: r.role_fr,
            company: r.company_fr,
            year: String(r.year ?? ""),
            rating: String(r.rating || 5),
            quoteEn: r.quote_en ?? "",
            roleEn: r.role_en ?? "",
            companyEn: r.company_en ?? "",
        };
    } catch {
        return undefined;
    }
}

export async function handleReviewPost(pb: PocketBase, data: FormData, id?: string): Promise<PostResult> {
    const values = parseReviewForm(data);
    const fields = {
        quote_fr: values.quote,
        role_fr: values.role,
        company_fr: values.company,
        year: Number(values.year),
        rating: Number(values.rating),
        quote_en: values.quoteEn,
        role_en: values.roleEn,
        company_en: values.companyEn,
    };

    try {
        if (id) {
            await pb.collection("reviews").update(id, fields);
        } else {
            await pb.collection("reviews").create(fields);
        }
        invalidateCache();
        return { redirect: "/admin/reviews?saved=1" };
    } catch (err) {
        return { error: pbErrorMessage(err), values };
    }
}
