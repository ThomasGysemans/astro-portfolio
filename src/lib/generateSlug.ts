/**
 * Creates a correct slug for the URL of a project.
 * @param title The title of a project ready to be published.
 * @returns A correct URL slug.
 */
export default function(title: string): string {
    return title
        .trim()
        .toLowerCase()
        .replace(/[\s']+/g, "-")
        .replace(/[éêèë]/g, "e")
        .replace(/[àâä]/g, "a")
        .replace(/[ïî]/g, "i")
        .replace(/[ôö]/g, "o")
        .replace(/[ùûü]/g, "u")
        .replace(/[ÿ]/g, "y")
        .replace(/[ç]/g, "c")
        .replace(/[^\w-]+/g, "")
        .replace(/-+$/g, "") // removes possible "-" at the end of the title name
        .replace(/^-+/g, ""); // and at the beginning too
}