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

export function getProjectIcon(type: ProjectType): string {
    switch (type) {
        case ProjectType.WEB: return "globe";
        case ProjectType.APPLICATION: return "smartphone";
        case ProjectType.SOFTWARE: return "laptop";
        case ProjectType.LANGUAGE: return "languages";
        case ProjectType.GAME: return "gamepad-2";
        case ProjectType.CHALLENGE: return "swords";
        default:
            return "folder-dot";
    }
}

export function getProjectFrenchName(type: ProjectType): string {
    switch (type) {
        case ProjectType.WEB: return "Web";
        case ProjectType.APPLICATION: return "Application";
        case ProjectType.SOFTWARE: return "Logiciel";
        case ProjectType.LANGUAGE: return "Langage";
        case ProjectType.GAME: return "Jeu vidéo";
        case ProjectType.CHALLENGE: return "Challenge";
        default:
            return "Autre";
    }
}