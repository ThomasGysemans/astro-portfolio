import type { FullProject } from "@db/models";

export function getProjectTimestamp(project: Pick<FullProject, "date">): number {
    return project.date.includes("-")
        ? new Date(project.date.substring(project.date.indexOf("-") + 1)).getTime()
        : new Date(project.date).getTime();
}