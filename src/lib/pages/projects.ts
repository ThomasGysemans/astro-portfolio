declare const projects: Project[];

type Filter = {
    name?: string;
    date?: string;
    type?: string;
};

const filterType = document.querySelector("#filter-type") as HTMLSelectElement;
const filterDate = document.querySelector("#filter-date") as HTMLSelectElement
const searchBar = document.querySelector("input[type='search']") as HTMLInputElement;
const filter: Filter = {};

searchBar.addEventListener('input', () => {
    const search = searchBar.value.trim().toLowerCase();
    if (search.length === 0) {
        filter.name = undefined;
    } else {
        filter.name = search;
    }
    filterElements();
});

filterType.addEventListener('change', () => {
    const value = filterType.value;
    if (value === "all") {
        filter.type = undefined;
    } else {
        filter.type = value;
    }
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
    return Array.from(document.querySelectorAll("[data-slug]")) as HTMLDivElement[];
}

function getMatchingProjects(): string[] {
    return projects.filter(p => {
        const filterName = filter.name === undefined ? true : p.name.toLowerCase().includes(filter.name);
        const filterType = filter.type === undefined ? true : p.type === filter.type;
        const filterDate = true;
        return filterName && filterType && filterDate;
    }).map(p => p.slug);
}

function filterElements() {
    const matchingProjects = getMatchingProjects();
    const elements = getProjectsElements();
    for (const project of elements) {
        if (doesProjectMatch(matchingProjects, project)) {
            showElement(project);
        } else {
            hideElement(project);
        }
    }
}