// Seeds a PocketBase instance with the projects of the portfolio.
// Usage: node scripts/seed-pocketbase.mjs
// Target/credentials come from the environment (defaults = local Docker instance):
//   POCKETBASE_URL, PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD
// The script is idempotent: it wipes the content collections before re-inserting.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PocketBase from "pocketbase";
import { PROJECTS, REVIEWS, TECH_COLORS, TECH_GROUPS } from "./seed-data.mjs";

const PB_URL = process.env.POCKETBASE_URL ?? "http://127.0.0.1:8090";
const EMAIL = process.env.PB_SUPERUSER_EMAIL ?? "thomas@gysemans.dev";
const PASSWORD = process.env.PB_SUPERUSER_PASSWORD ?? "thomasgysemans";
const PUBLIC_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../public");

// Same order as TECH_GROUPS; matches the `group` select of the `technologies` collection.
const GROUP_IDS = ["frontend-frameworks", "languages", "styling-markup", "backend-databases", "mobile-3d-games"];
const LOCALES = ["fr", "en"];

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

await pb.collection("_superusers").authWithPassword(EMAIL, PASSWORD);
console.log(`Authenticated on ${PB_URL}`);

// Children first, even though the cascade would handle most of it.
for (const collection of ["project_techs", "project_translations", "projects", "technologies", "reviews"]) {
    const items = await pb.collection(collection).getFullList({ fields: "id" });
    for (const item of items) {
        await pb.collection(collection).delete(item.id);
    }
    console.log(`wiped ${collection} (${items.length} records)`);
}

// --- technologies
const techIds = {};
for (const [name, color] of Object.entries(TECH_COLORS)) {
    const groupIndex = TECH_GROUPS.findIndex(g => g.items.includes(name));
    const record = await pb.collection("technologies").create({
        name,
        // The collection's pattern only accepts lowercase hex colors.
        color: color.toLowerCase(),
        group: GROUP_IDS[groupIndex] ?? "",
    });
    techIds[name] = record.id;
}
console.log(`created ${Object.keys(techIds).length} technologies`);

// --- projects, translations and tech junctions
for (const project of PROJECTS) {
    const thumbPath = path.join(PUBLIC_DIR, project.thumb);
    const file = new File([fs.readFileSync(thumbPath)], path.basename(thumbPath));

    const record = await pb.collection("projects").create({
        slug: project.slug,
        featured: project.featured,
        // The homepage carousel shows the pictures of a single project;
        // default to the first featured one (re-pickable in the back-office).
        carousel: project.slug === PROJECTS.find(p => p.featured)?.slug,
        category: project.category,
        type: project.type,
        context: project.context,
        year: project.year,
        date: project.date,
        team_size: project.teamSize,
        languages: project.languages,
        github: project.github ?? "",
        link: project.link ?? "",
        thumb: file,
        pictures: [file],
    });

    for (const locale of LOCALES) {
        await pb.collection("project_translations").create({
            project: record.id,
            locale,
            name: project.name[locale],
            sub: project.sub[locale],
            description: project.description[locale],
            about: project.about[locale],
            tagline: project.tagline[locale],
            caption: project.caption[locale],
        });
    }

    // Starts at 1: the field is "required" and PocketBase treats 0 as blank.
    let position = 1;
    for (const tech of project.techs) {
        await pb.collection("project_techs").create({
            project: record.id,
            technology: techIds[tech.name],
            role: tech.role,
            position: position++,
        });
    }

    console.log(`created project ${project.slug}`);
}

// --- reviews
for (const review of REVIEWS) {
    await pb.collection("reviews").create({
        quote_fr: review.quote.fr,
        quote_en: review.quote.en,
        role_fr: review.role.fr,
        role_en: review.role.en,
        company_fr: review.company.fr,
        company_en: review.company.en,
        year: review.year,
        rating: review.rating,
    });
}
console.log(`created ${REVIEWS.length} reviews`);

console.log("Done.");
