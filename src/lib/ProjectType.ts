import { EnumUtilities } from "./Enum.ts";

export class ProjectType {
    public static readonly WEB = new ProjectType("globe", "Web", "bg-[#566CF5]");
    public static readonly APPLICATION = new ProjectType("smartphone", "Application", "bg-[#F09953]");
    public static readonly SOFTWARE = new ProjectType("laptop", "Logiciel", "bg-[#D34DF9]");
    public static readonly LANGUAGE = new ProjectType("languages", "Langage", "bg-[#24D5FB]");
    public static readonly GAME = new ProjectType("gamepad-2", "Jeu vidéo", "bg-[#EC323B]");
    public static readonly CHALLENGE = new ProjectType("swords", "Challenge", "bg-[#F9DA08]");
    public static readonly OTHER = new ProjectType("folder-dot", "Autre", "bg-[#F983E7]");

    public constructor(
        public icon: string,
        public frenchName: string,
        public color: string,
    ) {}

    public static getAllTypes(): ProjectType[] {
        return EnumUtilities.getAllStaticInstances<ProjectType>(ProjectType as any);
    }

    public static getProjectType(name: string): ProjectType {
        return EnumUtilities.getStaticInstance<ProjectType>(name, ProjectType as any, "frenchName") ?? ProjectType.OTHER;
    }
}
