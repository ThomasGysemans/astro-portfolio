import type { FullProject } from "@db/models";

export function getProjectTimestamp(project: FullProject): number {
    return project.date.includes("-")
        ? new Date(project.date.substring(project.date.indexOf("-") + 1)).getTime()
        : new Date(project.date).getTime();
}