import { createElement } from "@lib/createElement.ts";

declare const projects: Project[];

type Filter = {
    name?: string;
    date?: string;
    type?: string;
    skills?: string[];
};

const noProjectContainer = document.querySelector("#no-project-container") as HTMLDivElement;
const projectsContainer = document.querySelector("#projects-container") as HTMLDivElement;
const filteredSkillsContainer = document.querySelector("#technologies-filter-container") as HTMLDivElement;
const filteredSkillsList = filteredSkillsContainer.querySelector("& > div") as HTMLDivElement;
const filterType = document.querySelector("#filter-type") as HTMLSelectElement;
const filterDate = document.querySelector("#filter-date") as HTMLSelectElement
const filterTechno = document.querySelector("#filter-techno") as HTMLSelectElement
const searchBar = document.querySelector("input[type='search']") as HTMLInputElement;
const filter: Filter = {};

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
    filter.date = value === "none" ? undefined : value;
    filterElements(true);
});

filterTechno.addEventListener('change', () => {
    const value = filterTechno.value;
    if (value === "all") {
        filter.skills = undefined;
    } else {
        if (filter.skills?.includes(value)) {
            filter.skills!.splice(filter.skills!.indexOf(value), 1);
        } else {
            if (filter.skills) {
                filter.skills.push(value);
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
        filter.skills!.splice(index, 1);
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

function getProjectTimestamp(project: Project): number {
    return project.date.includes("-")
        ? new Date(project.date.substring(project.date.indexOf("-") + 1)).getTime()
        : new Date(project.date).getTime();
}

function getFilteredProjects(): string[] {
    return projects.filter(p => {
        const filterName  = filter.name === undefined ? true : p.name.toLowerCase().includes(filter.name);
        const filterType  = filter.type === undefined ? true : p.type === filter.type;
        const filterSkill = filter.skills?.some(s => p.technologies.map(t => t.name).includes(s)) ?? true;
        return filterName && filterType && filterSkill;
    }).map(p => p.slug);
}

function sortElements() {
    const projectsElements = getProjectsElements();
    while (projectsContainer.firstChild) {
        projectsContainer.removeChild(projectsContainer.firstChild);
    }
    if (filter.date) {
        projectsElements.sort((a, b) => {
            const pa = projects.find(p => p.slug === a.getAttribute("data-slug"))!;
            const pb = projects.find(p => p.slug === b.getAttribute("data-slug"))!;
            if (filter.date === "recent") {
                return getProjectTimestamp(pb) - getProjectTimestamp(pa);
            } else {
                return getProjectTimestamp(pa) - getProjectTimestamp(pb);
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

function filterElements(needSorting: boolean) {
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