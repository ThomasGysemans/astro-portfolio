import type { RecordModel } from "pocketbase";
import type { Localized, Project, ProjectPicture, ProjectTech } from "./models";
import { cached, pb } from "./pb";

const EXPAND = "project_translations_via_project,project_techs_via_project.technology";

function localize(rows: RecordModel[] | undefined, key: string): Localized {
    const fr = rows?.find(r => r.locale === "fr")?.[key] ?? "";
    const en = rows?.find(r => r.locale === "en")?.[key] || fr;
    return { fr, en };
}

function mapProject(record: RecordModel): Project {
    const translations = record.expand?.project_translations_via_project as RecordModel[] | undefined;
    const junctions = ((record.expand?.project_techs_via_project as RecordModel[] | undefined) ?? [])
        .slice()
        .sort((a, b) => a.position - b.position);
    const techs: ProjectTech[] = junctions.map(j => ({
        name: j.expand?.technology?.name ?? "?",
        color: j.expand?.technology?.color ?? "var(--accent)",
        role: j.role,
    }));
    const text = (key: string) => localize(translations, key);

    // Per-picture captions written by the back-office, keyed by filename.
    const captions = (record.picture_captions ?? {}) as Record<string, { fr?: string, en?: string }>;
    const pictures: ProjectPicture[] = ((record.pictures as string[] | undefined) ?? []).map(name => {
        const fr = captions[name]?.fr ?? "";
        return {
            // No thumb sizes are declared on `pictures` (it also holds videos): full-size URLs.
            url: pb.files.getURL(record, name),
            caption: { fr, en: captions[name]?.en || fr },
        };
    });

    return {
        slug: record.slug,
        name: text("name"),
        featured: !!record.featured,
        carousel: !!record.carousel,
        categories: record.categories ?? [],
        year: record.year,
        date: record.date,
        teamSize: record.team_size,
        context: record.context,
        languages: record.languages,
        thumb: pb.files.getURL(record, record.thumb, { thumb: "800x0" }),
        thumbLarge: pb.files.getURL(record, record.thumb, { thumb: "1200x0" }),
        // No thumb size on a video: PocketBase only resizes images.
        thumbVideo: record.thumb_video ? pb.files.getURL(record, record.thumb_video) : undefined,
        pictures,
        github: record.github || undefined,
        link: record.link || undefined,
        sub: text("sub"),
        description: text("description"),
        about: text("about"),
        tagline: text("tagline"),
        caption: text("caption"),
        techs,
        updated: record.updated,
    };
}

// All projects, newest first (`created` keeps a stable order within a year).
// Every public read derives from this list, so the `hidden` projects are
// filtered out here once and for all: they vanish from the cards, the
// showcase, the carousel, the sitemap and their own detail page (404).
export async function getAllProjects(): Promise<Project[]> {
    return cached("projects", async () => {
        const records = await pb.collection("projects").getFullList({
            sort: "-year,created",
            filter: "hidden != true",
            expand: EXPAND,
        });
        return records.map(mapProject);
    });
}

// The projects shown on the homepage and in the showcase.
export async function getFeaturedProjects(): Promise<Project[]> {
    return (await getAllProjects()).filter(p => p.featured);
}

// The client work shown on the freelance page.
export async function getProfessionalProjects(): Promise<Project[]> {
    return (await getAllProjects()).filter(p => p.context === "professional");
}

export async function findProject(slug: string): Promise<Project | undefined> {
    return (await getAllProjects()).find(p => p.slug === slug);
}

// Previous/next projects in the "newest first" order, cycling at both ends.
// Empty when the slug is unknown or the project is alone: a project must
// never be its own neighbour (the page then hides the prev/next links).
export async function getAdjacentProjects(slug: string): Promise<{ prev?: Project, next?: Project }> {
    const all = await getAllProjects();
    const i = all.findIndex(p => p.slug === slug);
    if (i === -1 || all.length < 2) return {};
    return {
        prev: all[(i - 1 + all.length) % all.length],
        next: all[(i + 1) % all.length],
    };
}

export function countProjectsUsing(projects: Project[], tech: string): number {
    return projects.filter(p => p.techs.some(t => t.name === tech)).length;
}

// The years a visitor actually reads live in `date` (a free string, e.g.
// "2023" or "2018 → 2025"); `year` is only the sorting key, so a project
// still maintained today carries a recent `year` next to a much older
// `date`. The range shown above the list must follow the cards, hence every
// 4-digit year found in `date`, with `year` as the fallback when it holds
// no year at all. Undefined when there is nothing to derive a range from.
export function projectsYearRange(projects: Project[]): { from: number, to: number } | undefined {
    const years = projects
        .flatMap(p => {
            const found = (p.date?.match(/\d{4}/g) ?? []).map(Number);
            return found.length > 0 ? found : [p.year];
        })
        .filter(y => Number.isFinite(y));
    if (years.length === 0) return undefined;
    return { from: Math.min(...years), to: Math.max(...years) };
}
