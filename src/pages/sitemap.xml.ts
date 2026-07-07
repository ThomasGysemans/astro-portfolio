import type { APIRoute } from "astro";
import { LOCALES } from "@i18n/config";
import { alternateLinks, pathInLocale } from "@i18n/paths";
import { getAllProjects } from "@data/projects";

const DOMAIN = "https://thomasgysemans.dev";

// SSR route (rendered on request), so the sitemap always reflects the current
// set of projects in PocketBase without a rebuild.
export const prerender = false;

function escapeXml(value: string): string {
    return value.replace(/[<>&'"]/g, (c) =>
        ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!),
    );
}

// One <url> per locale variant of a page, each carrying the full hreflang
// alternate set (Google's recommended way to expose translations in a sitemap).
function urlEntries(path: string): string {
    const alternates = alternateLinks(path, DOMAIN);
    const links = alternates
        .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}"/>`)
        .join("\n");

    return LOCALES.map((locale) => {
        const loc = escapeXml(`${DOMAIN}${pathInLocale(locale, path)}`);
        return `  <url>\n    <loc>${loc}</loc>\n${links}\n  </url>`;
    }).join("\n");
}

export const GET: APIRoute = async () => {
    const projects = await getAllProjects();

    // Locale-less canonical paths of every public, indexable page.
    const staticPaths = ["/", "/projects", "/freelance", "/showcase"];
    const projectPaths = projects.map((p) => `/projects/${p.slug}`);
    const paths = [...staticPaths, ...projectPaths];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map(urlEntries).join("\n")}
</urlset>
`;

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
};
