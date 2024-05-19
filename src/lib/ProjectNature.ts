import { EnumUtilities } from "@lib/Enum.ts";

export class ProjectNature {
    public static readonly SCHOOL = new ProjectNature("graduation-cap", "École");
    public static readonly PROFESSIONAL = new ProjectNature("briefcase", "Professionnel");
    public static readonly PERSONAL = new ProjectNature("heart", "Personnel");

    public constructor(
        public icon: string,
        public frenchName: string,
    ) {}

    public static getAllNatures(): ProjectNature[] {
        return EnumUtilities.getAllStaticInstances<ProjectNature>(ProjectNature as any);
    }

    public static getNature(name: string): ProjectNature {
        return EnumUtilities.getStaticInstance<ProjectNature>(name, ProjectNature as any, "frenchName") ?? ProjectNature.PERSONAL;
    }
}