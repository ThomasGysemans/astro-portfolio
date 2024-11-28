import type { PBFullProject, ShowcaseProject } from "@db/models"
import type { RecordListOptions } from "pocketbase";
import { pb } from "@db/pb.ts";

export async function presentProjects(limit?: number): Promise<PBFullProject[]> {
    try {
        const opt: RecordListOptions = {
            sort: "+created",
            expand: "technologies",
        };
        if (limit !== undefined) {
            return (await pb.collection<PBFullProject>("projects").getList(1, limit, opt)).items;
        } else {
            return await pb.collection<PBFullProject>("projects").getFullList(opt);
        }
    } catch (e) {
        return [];
    }
}

export async function findProject(slug: string): Promise<PBFullProject|undefined> {
    try {
        const res = await pb
            .collection<PBFullProject>("projects")
            .getFirstListItem(`slug="${slug}"`, {
                expand: "technologies"
            });
        res.technologies = res.expand!.technologies!;
        return res;
    } catch (e) {
        return;
    }
}

export async function getShowcase(): Promise<ShowcaseProject[]> {
    try {
        return await pb.collection<PBFullProject>("projects").getFullList({
            fields: "slug,name,showcaseDescription",
            filter: "showcase=True",
        });
    } catch (e) {
        return [];
    }
}

export function getImageURL(record: {[p: string]: any}, filename: string): string {
    return pb.files.getURL(record, filename);
}
