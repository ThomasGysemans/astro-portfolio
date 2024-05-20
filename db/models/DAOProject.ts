import { db, ProjectTable } from "astro:db";

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
}