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

    private static getKeys(): (keyof typeof ProjectType)[] {
        return Object.keys(ProjectType) as (keyof typeof ProjectType)[];
    }

    public static getAllTypes(): ProjectType[] {
        const projects: ProjectType[] = [];
        const keys = this.getKeys();
        for (const key of keys) {
            projects.push(ProjectType[key] as ProjectType);
        }
        return projects;
    }

    public static getProjectType(name: string): ProjectType {
        const keys = this.getKeys();
        for (const key of keys) {
            const projectType = ProjectType[key] as ProjectType;
            if (projectType.frenchName === name) {
                return projectType;
            }
        }
        return ProjectType.OTHER;
    }
}