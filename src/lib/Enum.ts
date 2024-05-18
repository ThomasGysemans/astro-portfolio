export abstract class EnumUtilities {
    protected static getKeys<T extends Object>(e: T): (keyof T)[] {
        return Object.keys(e) as (keyof T)[];
    }

    public static getAllStaticInstances<T extends Object>(e: T): T[] {
        const projects: T[] = [];
        const keys = EnumUtilities.getKeys<T>(e);
        for (const key of keys) {
            projects.push(e[key] as T);
        }
        return projects;
    }

    public static getStaticInstance<T extends { frenchName: string }>(name: string, e: T): T | undefined {
        const keys = EnumUtilities.getKeys<T>(e);
        for (const key of keys) {
            const projectType = e[key] as T;
            if (projectType.frenchName === name) {
                return projectType;
            }
        }
    }
}