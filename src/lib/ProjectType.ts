export class ProjectType {
    public static readonly WEB = new ProjectType("globe", "Web");
    public static readonly APPLICATION = new ProjectType("smartphone", "Application");
    public static readonly SOFTWARE = new ProjectType("laptop", "Logiciel");
    public static readonly LANGUAGE = new ProjectType("languages", "Langage");
    public static readonly GAME = new ProjectType("gamepad-2", "Jeu vidéo");
    public static readonly CHALLENGE = new ProjectType("swords", "Challenge");
    public static readonly OTHER = new ProjectType("folder-dot", "Autre");

    public constructor(
        public icon: string,
        public frenchName: string,
    ) {}

    public static getProjectType(name: string): ProjectType {
        const keys = Object.keys(ProjectType) as (keyof typeof ProjectType)[];
        for (const key of keys) {
            const projectType = ProjectType[key] as ProjectType;
            if (projectType.frenchName === name) {
                return projectType;
            }
        }
        return ProjectType.OTHER;
    }
}