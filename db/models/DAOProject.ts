import { Storage } from "@db/storage.ts";
import {
    count,
    db,
    eq,
    LanguagesTable,
    PicturesTable,
    ProjectTable,
    ProjectTechnologiesTable,
    TechnologyTable
} from "astro:db";

// TODO: move "Project" here (from env.d.ts)
export type FullProject = Project;

export type ProjectListItem = Pick<
    FullProject,
    "slug" |
    "name" |
    "type" |
    "showcase" |
    "updatedAt"
>;

export type RawProject = Omit<
    FullProject,
    "pictures" |
    "slug" |
    "technologies" |
    "updatedAt"
> & { skills: string[], pictures: File[], existingPictures?: string }

type JoinedProject = {
    ProjectTable: typeof ProjectTable.$inferSelect,
    PicturesTable: typeof PicturesTable.$inferSelect,
    LanguagesTable: typeof LanguagesTable.$inferSelect,
    TechnologyTable: typeof TechnologyTable.$inferSelect,
    ProjectTechnologiesTable: typeof ProjectTechnologiesTable.$inferSelect,
};

export class DAOProject {
    public static async list(): Promise<ProjectListItem[]> {
        return db
            .select({
                slug: ProjectTable.slug,
                name: ProjectTable.name,
                type: ProjectTable.type,
                showcase: ProjectTable.showcase,
                updatedAt: ProjectTable.updatedAt,
            })
            .from(ProjectTable);
    }

    public static async present(): Promise<FullProject[]> {
        return this.getAllProjects();
    }

    private static aggregateProjects(rawResults: JoinedProject[]): FullProject[] {
        return rawResults.reduce<FullProject[]>((previous, current) => {
            const sameOne = previous.find(p => p.slug === current.ProjectTable.slug);
            const currentSlug = current.ProjectTable.slug;
            if (sameOne) {
                const previousProject = previous.find(p => p.slug === currentSlug)!;
                const picturePath = Storage.toPath(currentSlug, current.PicturesTable.filename)
                if (!previous.some(p => p.technologies.map(t => t.name).includes(current.TechnologyTable.name))) {
                    previousProject.technologies.push(current.TechnologyTable);
                } else if (!previousProject.pictures.includes(picturePath)) {
                    previousProject.pictures.push(picturePath);
                } else if (!previousProject.languages.includes(current.LanguagesTable.language)) {
                    previousProject.languages.push(current.LanguagesTable.language);
                }
                return previous;
            } else {
                return [...previous, {
                    ...current.ProjectTable,
                    technologies: [],
                    languages: [],
                    pictures: [],
                }];
            }
        }, []);
    }

    private static async getAllProjects(slug?: string): Promise<FullProject[]> {
        const selectClause = db
            .select()
            .from(ProjectTable)
            .innerJoin(ProjectTechnologiesTable, eq(ProjectTechnologiesTable.project, slug ?? ProjectTable.slug))
            .innerJoin(PicturesTable, eq(PicturesTable.project, slug ?? ProjectTable.slug))
            .innerJoin(LanguagesTable, eq(LanguagesTable.project, slug ?? ProjectTable.slug))
            .innerJoin(TechnologyTable, eq(TechnologyTable.name, ProjectTechnologiesTable.technology));
        return this.aggregateProjects(slug == undefined
            ? (await selectClause.execute())
            : (await selectClause.where(eq(ProjectTable.slug, slug)).execute()));
    }

    public static async find(slug: string): Promise<FullProject|undefined> {
        const results = (await db
            .select()
            .from(ProjectTable)
            .where(eq(ProjectTable.slug, slug))
            .innerJoin(ProjectTechnologiesTable, eq(ProjectTechnologiesTable.project, slug))
            .innerJoin(PicturesTable, eq(PicturesTable.project, slug))
            .innerJoin(LanguagesTable, eq(LanguagesTable.project, slug))
            .innerJoin(TechnologyTable, eq(TechnologyTable.name, ProjectTechnologiesTable.technology))
            .execute());
        if (results.length === 0) {
            return undefined;
        }
        return (this.aggregateProjects(results))[0];
    }

    public static async countShowcase(): Promise<number> {
        return (await db
            .select({ count: count() })
            .from(ProjectTable)
            .where(eq(ProjectTable.showcase, true))
            .execute()).reduce((p, c) => p + c.count, 0);
    }

    public static async remove(slug: string): Promise<boolean> {
        return (await db.batch([
            db.delete(PicturesTable).where(eq(PicturesTable.project, slug)),
            db.delete(LanguagesTable).where(eq(LanguagesTable.project, slug)),
            db.delete(ProjectTechnologiesTable).where(eq(ProjectTechnologiesTable.project, slug)),
            db.delete(ProjectTable).where(eq(ProjectTable.slug, slug)),
        ]))[3].rowsAffected > 0;
    }

    public static async exists(slug: string): Promise<boolean> {
        return (await db
            .select({ slug: ProjectTable.slug })
            .from(ProjectTable)
            .where(eq(ProjectTable.slug, slug))
            .execute()).length > 0;
    }

    public static async create(project: RawProject, slug: string) {
        console.log("creating raw project with data:", project);
        if (await Storage.storeImages(project.pictures, slug)) {
            return (await db.batch([
                db.insert(ProjectTable).values([{
                    name: project.name,
                    slug: slug,
                    description: project.description,
                    summary: project.summary,
                    presentationPicture: project.presentationPicture,
                    teamMembers: project.teamMembers,
                    nature: project.nature,
                    type: project.type,
                    date: project.date,
                    github: project.github,
                    link: project.link,
                    updatedAt: new Date(),
                    showcase: project.showcase,
                    showcaseDescription: project.showcaseDescription,
                }]),
                db.insert(ProjectTechnologiesTable).values(project.skills.map(s => ({ project: slug, technology: s }))),
                db.insert(LanguagesTable).values(project.languages.map(l => ({ project: slug, language: l }))),
                db.insert(PicturesTable).values(project.pictures.map(p => ({
                    project: slug,
                    filename: p.name,
                    lastModified: new Date(p.lastModified),
                    type: p.type,
                    picture: Storage.toPath(slug, p.name),
                }))),
            ]))[0].rowsAffected > 0;
        } else {
            return false;
        }
    }
}