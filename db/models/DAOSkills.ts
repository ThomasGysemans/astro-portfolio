import { db, TechnologyTable } from "astro:db";

export type Technology = {
    name: string;
    logo: string;
    loved: boolean;
};

export class DAOSkills {
    public static async list(): Promise<Technology[]> {
        return db.select().from(TechnologyTable);
    }
}