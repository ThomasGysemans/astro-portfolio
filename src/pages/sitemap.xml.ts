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

// PocketBase timestamps ("2024-01-15 10:30:45.123Z") to a W3C datetime, or
// undefined when absent/unparseable (the <lastmod> is then simply omitted).
function isoDate(value: string | undefined): string | undefined {
    if (!value) return undefined;
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
}

// One <url> per locale variant of a page, each carrying the full hreflang
// alternate set (Google's recommended way to expose translations in a sitemap).
function urlEntries(path: string, lastmod?: string): string {
    const alternates = alternateLinks(path, DOMAIN);
    const links = alternates
        .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}"/>`)
        .join("\n");
    const mod = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";

    return LOCALES.map((locale) => {
        const loc = escapeXml(`${DOMAIN}${pathInLocale(locale, path)}`);
        return `  <url>\n    <loc>${loc}</loc>${mod}\n${links}\n  </url>`;
    }).join("\n");
}

export const GET: APIRoute = async () => {
    const projects = await getAllProjects();

    // The listing pages surface the projects, so their freshness tracks the
    // most recently edited project.
    const projectMods = projects.map((p) => isoDate(p.updated)).filter((v): v is string => !!v);
    const latestMod = projectMods.length > 0 ? projectMods.reduce((a, b) => (a > b ? a : b)) : undefined;

    // Locale-less canonical paths of every public, indexable page, each with
    // the <lastmod> to advertise: the project's own for detail pages, the
    // latest project edit for the listing pages.
    const staticPaths = ["/", "/projects", "/freelance", "/showcase"];
    const entries = [
        ...staticPaths.map((path) => ({ path, lastmod: latestMod })),
        ...projects.map((p) => ({ path: `/projects/${p.slug}`, lastmod: isoDate(p.updated) })),
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map((e) => urlEntries(e.path, e.lastmod)).join("\n")}
</urlset>
`;

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
};
