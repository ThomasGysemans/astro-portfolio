import type { FullProject } from "../../../db/models";
import { getProjectTimestamp } from "../getProjectTimestamp.ts";
import { createElement } from "../DOMHelper.ts";

declare const projects: FullProject[];

type FilterDate = "recent" | "oldest";

type Filter = {
    name?: string;
    date?: FilterDate;
    type?: string;
    skills?: string[];
};

const containerProjectsGrid = document.querySelector("#container-projects-grid") as HTMLDivElement;
const noProjectContainer = document.querySelector("#no-project-container") as HTMLDivElement;
const projectsContainer = document.querySelector("#projects-container") as HTMLDivElement;
const filteredSkillsContainer = document.querySelector("#technologies-filter-container") as HTMLDivElement;
const filteredSkillsList = filteredSkillsContainer.querySelector("& > div") as HTMLDivElement;
const filterType = document.querySelector("#filter-type") as HTMLSelectElement;
const filterDate = document.querySelector("#filter-date") as HTMLSelectElement
const filterTechno = document.querySelector("#filter-techno") as HTMLSelectElement
const searchBar = document.querySelector("input[type='search']") as HTMLInputElement;

const filterHandler = {
    set(obj: Filter, prop: keyof Filter, value: any) {
        obj[prop] = value;
        const pathname = window.location.pathname;
        const query = `${Object.entries(filter).map(([key, value]) => value ? `${key}=${Array.isArray(value) ? value.join(',') : value}` : "").filter(s => !!s).join("&")}`;
        window.history.pushState({}, "", encodeURI(`${pathname}${query ? `?${query}` : ''}`));
        return true;
    }
};

let filter: Filter;

window.addEventListener("DOMContentLoaded", () => {
    const search = decodeURI(window.location.search);
    if (search) {
        const query = search.substring(1); // removes the "?" prefix
        const properties = query.split("&");
        const validKeys = ["name", "date", "type", "skills"] as (keyof Filter)[];
        const initialFilter = {} as Filter;
        for (const property of properties) {
            const parts = property.split("=");
            const key = parts[0] as keyof Filter;
            const value = parts[1];
            if (validKeys.includes(key)) {
                if (key === "skills") {
                    initialFilter[key] = value.split(",");
                } else if (key === "date") {
                    if (value === "oldest") {
                        initialFilter[key] = value;
                    }
                } else {
                    initialFilter[key] = value as any;
                }
            }
        }
        filter = new Proxy(initialFilter, filterHandler);
        filterElements(true);
        containerProjectsGrid.style.display = "block";
    } else {
        filter = new Proxy({} as Filter, filterHandler);
    }
});

searchBar.addEventListener('input', () => {
    const search = searchBar.value.trim().toLowerCase();
    if (search.length === 0) {
        filter.name = undefined;
    } else {
        filter.name = search;
    }
    filterElements(false);
});

filterType.addEventListener('change', () => {
    const value = filterType.value;
    filter.type = value === "all" ? undefined : value;
    filterElements(false);
});

filterDate.addEventListener('change', () => {
    const value = filterDate.value;
    if (["recent", "oldest"].includes(value)) {
        filter.date = value === "recent" ? undefined : value as FilterDate;
        filterElements(true);
    }
});

filterTechno.addEventListener('change', () => {
    const value = filterTechno.value;
    if (value === "all") {
        filter.skills = undefined;
    } else {
        if (filter.skills?.includes(value)) {
            filter.skills = filter.skills.filter(s => s !== value);
        } else {
            if (filter.skills) {
                filter.skills = [...filter.skills, value];
            } else {
                filter.skills = [value];
            }
        }
    }
    filterElements(false);
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
    return Array.from(projectsContainer.querySelectorAll("[data-slug]")) as HTMLDivElement[];
}

function removeSkill(name: string): void {
    const index = filter.skills!.indexOf(name);
    if (index >= 0) {
        filter.skills = filter.skills!.filter((_, i) => i !== index);
        if (filter.skills!.length === 0) {
            filter.skills = undefined;
            filterTechno.value = "all";
        }
    }
    filterElements(false);
}

function createFilteredSkill(name: string): void {
    const div = createElement<HTMLDivElement>("div", [["class", "filtered-skill"], ["data-skill", name]]);
    const span = createElement<HTMLSpanElement>("span", undefined, name);
    const btn = createElement<HTMLButtonElement>("button", [["type", "button"]]);
    const icon = createElement<HTMLImageElement>("img", [["src", "/logos/x.svg"], ["aria-label", "Retirer le filtre"], ["title", "Retirer le filtre"]]);
    btn.addEventListener("click", () => removeSkill(name));
    btn.appendChild(icon);
    div.appendChild(span);
    div.appendChild(btn);
    filteredSkillsList.appendChild(div);
}

function displayFilteredSkills(): void {
    while (filteredSkillsList.firstChild) {
        filteredSkillsList.removeChild(filteredSkillsList.firstChild);
    }
    if (filter.skills) {
        for (const skill of filter.skills) {
            createFilteredSkill(skill);
        }
        filteredSkillsContainer.style.display = "block";
    } else {
        filteredSkillsContainer.style.display = "none";
    }
}

function getFilteredProjects(): string[] {
    return projects.filter(p => {
        const filterName  = filter.name === undefined ? true : p.name.toLowerCase().includes(filter.name);
        const filterType  = filter.type === undefined ? true : p.type === filter.type;
        const filterSkill = filter.skills?.some(s => p.technologies.map(t => t.name).includes(s)) ?? true;
        return filterName && filterType && filterSkill;
    }).map(p => p.slug);
}

function sortElements(): void {
    const projectsElements = getProjectsElements();
    while (projectsContainer.firstChild) {
        projectsContainer.removeChild(projectsContainer.firstChild);
    }
    if (filter.date) {
        projectsElements.sort((a, b) => {
            const pa = projects.find(p => p.slug === a.getAttribute("data-slug"))!;
            const pb = projects.find(p => p.slug === b.getAttribute("data-slug"))!;
            if (filter.date === "oldest") {
                return getProjectTimestamp(pa) - getProjectTimestamp(pb);
            } else {
                return getProjectTimestamp(pb) - getProjectTimestamp(pa);
            }
        });
        for (const element of projectsElements) {
            projectsContainer.appendChild(element);
        }
    } else {
        const originallyOrderedProjects: HTMLDivElement[] = [];
        for (const project of projects) {
            originallyOrderedProjects.push(
                projectsElements.find(e => e.getAttribute("data-slug") === project.slug)!
            );
        }
        for (const element of originallyOrderedProjects) {
            projectsContainer.appendChild(element);
        }
    }
}

function filterElements(needSorting: boolean): void {
    if (needSorting) {
        sortElements();
    }
    const matchingProjects = getFilteredProjects();
    const elements = getProjectsElements();
    for (const project of elements) {
        if (doesProjectMatch(matchingProjects, project)) {
            showElement(project);
        } else {
            hideElement(project);
        }
    }
    displayFilteredSkills();
    if (matchingProjects.length > 0) {
        noProjectContainer.style.display = "none";
    } else {
        noProjectContainer.style.display = null as any;
    }
}
