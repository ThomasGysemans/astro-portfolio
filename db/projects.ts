import type { FullProject, PBProject, PBShowcaseProject, ShowcaseProject } from "@db/models"
import type { RecordListOptions } from "pocketbase";
import { pb } from "@db/pb.ts";

const languageTables: Record<App.LangCode, string> = {
    "fr": "french",
    "en": "english",
};

function getLangTable(lang: App.LangCode) {
    return (languageTables[lang] as "french" | "english") ?? "french";
}

function mapPocketbaseToFullProject(project: PBProject): FullProject {
    const langTable = "english" in project.expand ? "english" : "french";
    return {
        ...project,
        technologies: project.expand.technologies ?? [],
        summary: project.expand[langTable]?.summary ?? "",
        description: project.expand[langTable]?.description ?? "",
        showcaseDescription: project.expand[langTable]?.showcaseDescription,
    };
}

export async function presentProjects(lang: App.LangCode, limit?: number): Promise<FullProject[]> {
    try {
        const opt: RecordListOptions = {
            sort: "+created",
            expand: `technologies,${getLangTable(lang)}`,
        };
        if (limit !== undefined) {
            return ((await pb.collection<PBProject>("projects").getList(1, limit, opt)).items).map(mapPocketbaseToFullProject);
        } else {
            return (await pb.collection<PBProject>("projects").getFullList(opt)).map(mapPocketbaseToFullProject);
        }
    } catch (e) {
        return [];
    }
}

export async function findProject(lang: App.LangCode, slug: string): Promise<FullProject|undefined> {
    try {
        const langTable = getLangTable(lang);
        const res = await pb
            .collection<PBProject>("projects")
            .getFirstListItem(`slug="${slug}"`, {
                expand: `technologies,${langTable}`
            });
        return mapPocketbaseToFullProject(res);
    } catch (e) {
        return;
    }
}

export async function getShowcase(lang: App.LangCode): Promise<ShowcaseProject[]> {
    try {
        const langTable = getLangTable(lang);
        return (await pb.collection<PBShowcaseProject>("projects").getFullList({
            expand: langTable,
            fields: `slug,name,expand.${langTable}.description,expand.${langTable}.showcaseDescription`,
            filter: "showcase=True",
        })).map(p => ({
            slug: p.slug,
            name: p.name,
            showcaseDescription: p.expand[langTable]?.showcaseDescription,
            description: p.expand[langTable]?.description ?? "",
        }));
    } catch (e) {
        return [];
    }
}

export function getImageURL(record: {[p: string]: any}, filename: string): string {
    return pb.files.getURL(record, filename);
}
