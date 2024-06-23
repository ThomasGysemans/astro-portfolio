import { db, eq, LanguagesTable, PicturesTable, ProjectTable, ProjectTechnologiesTable } from "astro:db";

export type ProjectListItem = Pick<
    Project,
    "slug" |
    "name" |
    "type" |
    "showcase" |
    "updatedAt"
>;

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

    public static async remove(slug: string): Promise<boolean> {
        return (await db.batch([
            db.delete(PicturesTable).where(eq(PicturesTable.project, slug)),
            db.delete(LanguagesTable).where(eq(LanguagesTable.project, slug)),
            db.delete(ProjectTechnologiesTable).where(eq(ProjectTechnologiesTable.project, slug)),
            db.delete(ProjectTable).where(eq(ProjectTable.slug, slug)),
        ]))[3].rowsAffected > 0;
    }
}