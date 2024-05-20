import type { ProjectListItem } from "@db/models/DAOProject.ts";

declare const projects: ProjectListItem[];

const searchInput = document.querySelector("#search") as HTMLInputElement;
const table = document.querySelector("#table") as HTMLTableElement;

searchInput.addEventListener("input", () => {
    const search = searchInput.value.trim().toLowerCase();
    const rows = getRows();
    if (search.length === 0) {
        for (const row of rows) {
            showElement(row);
        }
    } else {
        for (const row of rows) {
            const slug = row.getAttribute("data-slug")!;
            const project = projects.find(p => p.slug === slug)!;
            if (matches(search, project.name.toLowerCase())) {
                showElement(row);
            } else {
                hideElement(row);
            }
        }
    }
});

function matches(a: string, b: string): boolean {
    return Array.from(a).every(char => b.includes(char));
}

function showElement(element: HTMLElement): void {
    element.removeAttribute("aria-hidden");
}

function hideElement(element: HTMLElement): void {
    element.setAttribute("aria-hidden", "true");
}

function getRows(): HTMLTableRowElement[] {
    return Array.from(table.querySelectorAll("tr[data-slug]"));
}