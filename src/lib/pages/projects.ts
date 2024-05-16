import { getProjectType } from "@lib/ProjectType.ts";

declare const projects: Project[];

const filterType = document.querySelector("#filter-type") as HTMLSelectElement;
const filterDate = document.querySelector("#filter-date") as HTMLSelectElement
const searchBar = document.querySelector("input[type='search']") as HTMLInputElement;

searchBar.addEventListener('input', (e) => {
    const search = searchBar.value.trim().toLowerCase();
    const matchingProjects = projects.filter(p => p.name.toLowerCase().includes(search)).map(p => p.slug);
    filterElements(matchingProjects);
});

filterType.addEventListener('change', () => {
    const value = filterType.value;
    if (value === "all") {
        const projects = getProjectsElements();
        for (const projectElement of projects) {
            showElement(projectElement);
        }
    } else {
        const projectType = getProjectType(value);
        const matchingProjects = projects.filter(p => p.type === projectType).map(p => p.slug);
        filterElements(matchingProjects);
    }
});

function doesProjectMatch(matchingProjects: string[], project: HTMLDivElement): boolean {
    return matchingProjects.includes(project.getAttribute("data-slug")!);
}

function hideElement(project: HTMLDivElement): void {
    project.setAttribute("data-hidden", "true");
}

function showElement(project: HTMLDivElement): void {
    project.removeAttribute("data-hidden");
}

function getProjectsElements(): HTMLDivElement[] {
    return Array.from(document.querySelectorAll("[data-slug]")) as HTMLDivElement[];
}

function filterElements(matchingProjects: string[]) {
    const projects = getProjectsElements();
    for (const project of projects) {
        if (doesProjectMatch(matchingProjects, project)) {
            showElement(project);
        } else {
            hideElement(project);
        }
    }
}