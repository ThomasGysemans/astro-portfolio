import { db, ProjectTable } from "astro:db";

type ProjectListItem = Pick<
    Project,
    "name" |
    "type" |
    "showcase" |
    "updatedAt"
>;

export class DAOProject {
    public static async list(): Promise<ProjectListItem[]> {
        return db
            .select({
                name: ProjectTable.name,
                type: ProjectTable.type,
                showcase: ProjectTable.showcase,
                updatedAt: ProjectTable.updatedAt,
            })
            .from(ProjectTable);
    }
}