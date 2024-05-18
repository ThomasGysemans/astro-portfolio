declare const projects: Project[];

type Filter = {
    name?: string;
    date?: string;
    type?: string;
};

const projectsContainer = document.querySelector("#projects-container") as HTMLDivElement;
const filterType = document.querySelector("#filter-type") as HTMLSelectElement;
const filterDate = document.querySelector("#filter-date") as HTMLSelectElement
const searchBar = document.querySelector("input[type='search']") as HTMLInputElement;
const filter: Filter = {};

let needSorting = false;

searchBar.addEventListener('input', () => {
    const search = searchBar.value.trim().toLowerCase();
    if (search.length === 0) {
        filter.name = undefined;
    } else {
        filter.name = search;
    }
    needSorting = false;
    filterElements();
});

filterType.addEventListener('change', () => {
    const value = filterType.value;
    filter.type = value === "all" ? undefined : value;
    needSorting = false;
    filterElements();
});

filterDate.addEventListener('change', () => {
    const value = filterDate.value;
    filter.date = value === "none" ? undefined : value;
    needSorting = true;
    filterElements();
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

function getProjectTimestamp(project: Project): number {
    return project.date.includes("-")
        ? new Date(project.date.substring(project.date.indexOf("-") + 1)).getTime()
        : new Date(project.date).getTime();
}

function getFilteredProjects(): string[] {
    return projects.filter(p => {
        const filterName = filter.name === undefined ? true : p.name.toLowerCase().includes(filter.name);
        const filterType = filter.type === undefined ? true : p.type === filter.type;
        return filterName && filterType;
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

function filterElements() {
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
}