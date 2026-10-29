// Content of the back-office sidebar ("explorer"): every project and review,
// so the admin can jump from one record to another without going back to a
// list. Loaded by AdminLayout on every page; a failure only empties the tree.
// It reuses the lists of the list pages (memoised per request), so those
// pages do not pay the same query twice.
import type PocketBase from "pocketbase";
import { type AdminProjectRow, listAdminProjects } from "./projects";
import { listAdminReviews } from "./reviews";
import type { AdminReviewRow } from "@components/pages/admin/AdminReviewsPage.astro";

export type Explorer = {
    projects: AdminProjectRow[],
    reviews: AdminReviewRow[],
    technologies: number,
};

export async function loadExplorer(pb: PocketBase): Promise<Explorer> {
    try {
        const [projects, reviews, technologies] = await Promise.all([
            listAdminProjects(pb),
            listAdminReviews(pb),
            pb.collection("technologies").getList(1, 1, { fields: "id" }),
        ]);
        return { projects, reviews, technologies: technologies.totalItems };
    } catch {
        return { projects: [], reviews: [], technologies: 0 };
    }
}
