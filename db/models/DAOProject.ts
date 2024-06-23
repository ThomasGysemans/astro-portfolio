import { DAO } from "@db/models/DAO.ts";
import {
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
    Project,
    "slug" |
    "name" |
    "type" |
    "showcase" |
    "updatedAt"
>;

export class DAOProject extends DAO {
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

    public static async find(slug: string): Promise<Project|undefined> {
        const results = (await db
            .select()
            .from(ProjectTable)
            .where(eq(ProjectTable.slug, slug))
            .innerJoin(ProjectTechnologiesTable, eq(ProjectTechnologiesTable.project, slug))
            .innerJoin(PicturesTable, eq(PicturesTable.project, slug))
            .innerJoin(LanguagesTable, eq(LanguagesTable.project, slug))
            .innerJoin(TechnologyTable, eq(TechnologyTable.name, ProjectTechnologiesTable.technology))
            .execute());
        const technologies = this.aggregateMap("name", results.map(r => r.TechnologyTable));
        const languages = this.aggregatePrimaryKey("language", results.map(r => r.LanguagesTable));
        const pictures = this.aggregateMap("filename", results.map(r => r.PicturesTable));
        return {
            ...results[0].ProjectTable,
            technologies,
            languages,
            pictures: pictures.map(p => p.picture),
        };
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