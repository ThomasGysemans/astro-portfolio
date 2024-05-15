declare const projects: ProjectType[];

console.log(projects[0]);

const filterType = document.querySelector("#filter-type") as HTMLSelectElement;
const filterDate = document.querySelector("#filter-date") as HTMLSelectElement
const searchBar = document.querySelector("input[type='search']") as HTMLInputElement;
const projectsElements = Array.from(document.querySelectorAll("[data-slug]")) as HTMLDivElement[];

searchBar.addEventListener('input', (e) => {
    const search = searchBar.value.trim().toLowerCase();
    const matchingProjects = projects.filter(p => p.name.toLowerCase().includes(search)).map(p => p.slug);
    for (const projectElement of projectsElements) {
        if (matchingProjects.includes(projectElement.getAttribute("data-slug")!)) {
            projectElement.removeAttribute("data-hidden");
        } else {
            projectElement.setAttribute("data-hidden", "true");
        }
    }
});