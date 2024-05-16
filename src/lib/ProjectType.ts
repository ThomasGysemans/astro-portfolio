export const enum ProjectType {
    WEB,
    APPLICATION,
    SOFTWARE,
    LANGUAGE,
    GAME,
    CHALLENGE,
    OTHER,
}

export function getProjectType(name: string): ProjectType {
    switch (name) {
        case "web": return ProjectType.WEB;
        case "application": return ProjectType.APPLICATION;
        case "software": return ProjectType.SOFTWARE;
        case "language": return ProjectType.LANGUAGE;
        case "game": return ProjectType.GAME;
        case "challenge": return ProjectType.CHALLENGE;
        default:
            return ProjectType.OTHER;
    }
}