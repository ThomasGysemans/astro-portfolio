import { EnumUtilities } from "./Enum.ts";

export class ProjectNature {
    public static readonly SCHOOL = new ProjectNature("graduation-cap", "École", "School");
    public static readonly PROFESSIONAL = new ProjectNature("briefcase", "Professionnel", "Professional");
    public static readonly PERSONAL = new ProjectNature("heart", "Personnel", "Personal");

    public constructor(
        public icon: string,
        public frenchName: string,
        public englishName: string,
    ) {}

    public getTranslatedName(lang: App.LangCode): string {
        return lang === "fr" ? this.frenchName : this.englishName;
    }

    public static getAllNatures(): ProjectNature[] {
        return EnumUtilities.getAllStaticInstances<ProjectNature>(ProjectNature as any);
    }

    public static getNature(name: string): ProjectNature {
        return EnumUtilities.getStaticInstance<ProjectNature>(name, ProjectNature as any, "frenchName") ?? ProjectNature.PERSONAL;
    }
}
