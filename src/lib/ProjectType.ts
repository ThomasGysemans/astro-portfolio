import { EnumUtilities } from "./Enum.ts";

export class ProjectType {
    public static readonly WEB = new ProjectType("globe", "Web", "Web", "bg-[#566CF5]");
    public static readonly APPLICATION = new ProjectType("smartphone", "Application", "Application", "bg-[#F09953]");
    public static readonly SOFTWARE = new ProjectType("laptop", "Logiciel", "Software", "bg-[#D34DF9]");
    public static readonly LANGUAGE = new ProjectType("languages", "Langage", "Language", "bg-[#24D5FB]");
    public static readonly GAME = new ProjectType("gamepad-2", "Jeu vidéo", "Video game", "bg-[#EC323B]");
    public static readonly CHALLENGE = new ProjectType("swords", "Challenge", "Challenge", "bg-[#F9DA08]");
    public static readonly OTHER = new ProjectType("folder-dot", "Autre", "Other", "bg-[#F983E7]");

    private constructor(
        public icon: string,
        public frenchName: string,
        public englishName: string,
        public color: string,
    ) {}

    public getTranslatedName(lang: App.LangCode): string {
        return lang === "fr" ? this.frenchName : this.englishName;
    }

    public static getAllTypes(): ProjectType[] {
        return EnumUtilities.getAllStaticInstances<ProjectType>(ProjectType as any);
    }

    public static getProjectType(name: string): ProjectType {
        return EnumUtilities.getStaticInstance<ProjectType>(name, ProjectType as any, "frenchName") ?? ProjectType.OTHER;
    }
}
