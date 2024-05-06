export const enum ProjectNature {
    PERSONAL,
    SCHOOL,
    WORK,
}

export function getProjectNature(nature: ProjectNature): string {
    switch (nature) {
        case ProjectNature.SCHOOL: return "École";
        case ProjectNature.WORK: return "Professionnel";
        default: return "Personnel";
    }
}

export function getProjectNatureIcon(nature: ProjectNature): string {
    switch (nature) {
        case ProjectNature.SCHOOL: return "graduation-cap";
        case ProjectNature.WORK: return "briefcase";
        default: return "heart";
    }
}
