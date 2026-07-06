import type { RecordModel } from "pocketbase";
import type { Localized, Project, ProjectTech } from "./models";
import { CATEGORIES } from "./categories";
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

    return {
        slug: record.slug,
        name: text("name"),
        featured: !!record.featured,
        carousel: !!record.carousel,
        category: record.category,
        badge: record.badge || undefined,
        type: record.type,
        year: record.year,
        date: record.date,
        teamSize: record.team_size,
        context: record.context,
        languages: record.languages,
        thumb: pb.files.getURL(record, record.thumb, { thumb: "800x0" }),
        thumbLarge: pb.files.getURL(record, record.thumb, { thumb: "1200x0" }),
        // No thumb sizes are declared on `pictures` (it also holds videos): full-size URLs.
        pictures: ((record.pictures as string[] | undefined) ?? []).map(name => pb.files.getURL(record, name)),
        github: record.github || undefined,
        link: record.link || undefined,
        sub: text("sub"),
        description: text("description"),
        about: text("about"),
        tagline: text("tagline"),
        caption: text("caption"),
        techs,
    };
}

// All projects, newest first (`created` keeps a stable order within a year).
export async function getAllProjects(): Promise<Project[]> {
    return cached("projects", async () => {
        const records = await pb.collection("projects").getFullList({
            sort: "-year,created",
            expand: EXPAND,
        });
        return records.map(mapProject);
    });
}

// The projects shown on the homepage and in the showcase.
export async function getFeaturedProjects(): Promise<Project[]> {
    return (await getAllProjects()).filter(p => p.featured);
}

// The single project whose pictures fill the homepage carousel, chosen
// in the back-office. Falls back to the first featured project.
export async function getCarouselProject(): Promise<Project | undefined> {
    const all = await getAllProjects();
    return all.find(p => p.carousel) ?? all.find(p => p.featured);
}

// The client work shown on the freelance page.
export async function getProfessionalProjects(): Promise<Project[]> {
    return (await getAllProjects()).filter(p => p.context === "professional");
}

export async function findProject(slug: string): Promise<Project | undefined> {
    return (await getAllProjects()).find(p => p.slug === slug);
}

// Previous/next projects in the "newest first" order, cycling at both ends.
export async function getAdjacentProjects(slug: string): Promise<{ prev: Project, next: Project }> {
    const all = await getAllProjects();
    const i = Math.max(0, all.findIndex(p => p.slug === slug));
    return {
        prev: all[(i - 1 + all.length) % all.length],
        next: all[(i + 1) % all.length],
    };
}

export function getProjectBadge(project: Project): string {
    return project.badge ?? CATEGORIES[project.category].badge;
}

export function countProjectsUsing(projects: Project[], tech: string): number {
    return projects.filter(p => p.techs.some(t => t.name === tech)).length;
}
