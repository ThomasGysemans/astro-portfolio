import type { FullProject, ShowcaseProject } from "@db/models"
import { Language } from "@lib/Language.ts";
import { ProjectType } from "@lib/ProjectType.ts";
import { ProjectNature } from "@lib/ProjectNature.ts";

export async function presentProjects(): Promise<FullProject[]> {
    return [await findProject("sciencesky")];
}

export async function findProject(slug: string): Promise<FullProject> {
    return {
        slug,
        date: "2024",
        description: "Description",
        languages: [Language.FR.short],
        type: ProjectType.WEB.frenchName,
        link: "",
        name: "ScienceSky",
        github: "",
        nature: ProjectNature.PERSONAL.frenchName,
        pictures: ["https://sciencesky.fr/"],
        showcase: true,
        summary: "Summary",
        presentationPicture: 0,
        teamMembers: 1,
        updatedAt: new Date(),
        technologies: [{ name: "Svelte", logo: "https://sciencesky.fr/logo.png", loved: true, }],
        showcaseDescription: "Showcase description",
    };
}

export async function getShowcase(): Promise<ShowcaseProject[]> {
    return [{
        slug: "sciencesky",
        name: "ScienceSky",
        showcaseDescription: "Description random"
    }];
}