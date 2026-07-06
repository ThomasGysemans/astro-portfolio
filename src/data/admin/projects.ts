// Server-side logic of the back-office project pages: form state, POST
// handling (project + French/English translations + tech junctions) and the list.
import type PocketBase from "pocketbase";
import type { RecordModel } from "pocketbase";
import { invalidateCache } from "@data/pb";
import { file, files, pbErrorMessage, text } from "./forms";

// Everything is kept as strings (except the checkboxes) so the values can
// round-trip between the form inputs and the POST handler as-is.
export type ProjectFormValues = {
    slug: string,
    featured: boolean,
    carousel: boolean,
    badge: string,
    category: string,
    type: string,
    context: string,
    year: string,
    date: string,
    teamSize: string,
    languages: string[],
    github: string,
    link: string,
    // French columns of `project_translations`.
    name: string,
    sub: string,
    description: string,
    about: string,
    tagline: string,
    caption: string,
    // English columns of `project_translations`.
    nameEn: string,
    subEn: string,
    descriptionEn: string,
    aboutEn: string,
    taglineEn: string,
    captionEn: string,
};

export type AdminTechRow = {
    id: string, // id of the `project_techs` junction row
    technologyId: string,
    name: string,
    role: string,
};

export type ProjectFormState = {
    values: ProjectFormValues,
    thumbUrl?: string,
    pictures: { name: string, url: string }[],
    techs: AdminTechRow[],
    availableTechs: { id: string, name: string }[],
};

export type AdminProjectRow = {
    id: string,
    slug: string,
    name: string,
    year: number,
    category: string,
    context: string,
    featured: boolean,
    carousel: boolean,
    thumbUrl: string,
};

type PostResult = { redirect: string } | { error: string, values: ProjectFormValues };

function emptyValues(): ProjectFormValues {
    return {
        slug: "",
        featured: false,
        carousel: false,
        badge: "",
        category: "web",
        type: "website",
        context: "personal",
        year: String(new Date().getFullYear()),
        date: String(new Date().getFullYear()),
        teamSize: "1",
        languages: ["fr"],
        github: "",
        link: "",
        name: "",
        sub: "",
        description: "",
        about: "",
        tagline: "",
        caption: "",
        nameEn: "",
        subEn: "",
        descriptionEn: "",
        aboutEn: "",
        taglineEn: "",
        captionEn: "",
    };
}

function parseForm(data: FormData): ProjectFormValues {
    return {
        slug: text(data, "slug"),
        featured: data.has("featured"),
        carousel: data.has("carousel"),
        badge: text(data, "badge"),
        category: text(data, "category"),
        type: text(data, "type"),
        context: text(data, "context"),
        year: text(data, "year"),
        date: text(data, "date"),
        teamSize: text(data, "teamSize"),
        languages: data.getAll("languages").map(String),
        github: text(data, "github"),
        link: text(data, "link"),
        name: text(data, "name"),
        sub: text(data, "sub"),
        description: text(data, "description"),
        about: text(data, "about"),
        tagline: text(data, "tagline"),
        caption: text(data, "caption"),
        nameEn: text(data, "name_en"),
        subEn: text(data, "sub_en"),
        descriptionEn: text(data, "description_en"),
        aboutEn: text(data, "about_en"),
        taglineEn: text(data, "tagline_en"),
        captionEn: text(data, "caption_en"),
    };
}

// Columns of the `projects` record built from the form values.
function projectPayload(v: ProjectFormValues): Record<string, unknown> {
    return {
        slug: v.slug,
        featured: v.featured,
        carousel: v.carousel,
        badge: v.badge,
        category: v.category,
        type: v.type,
        context: v.context,
        year: Number(v.year),
        date: v.date,
        team_size: Number(v.teamSize),
        languages: v.languages,
        github: v.github,
        link: v.link,
    };
}

// Only one project may fill the homepage carousel: flagging one unflags the others.
async function claimCarousel(pb: PocketBase, projectId: string): Promise<void> {
    const others = await pb.collection("projects").getFullList({
        filter: pb.filter("carousel = true && id != {:id}", { id: projectId }),
        fields: "id",
    });
    for (const other of others) {
        await pb.collection("projects").update(other.id, { carousel: false });
    }
}

async function upsertTranslation(pb: PocketBase, projectId: string, locale: "fr" | "en", fields: Record<string, string>): Promise<void> {
    const rows = await pb.collection("project_translations").getFullList({
        filter: pb.filter("project = {:id} && locale = {:locale}", { id: projectId, locale }),
    });
    if (rows.length > 0) {
        await pb.collection("project_translations").update(rows[0].id, fields);
    } else {
        await pb.collection("project_translations").create({ project: projectId, locale, ...fields });
    }
}

async function upsertTranslations(pb: PocketBase, projectId: string, v: ProjectFormValues): Promise<void> {
    await upsertTranslation(pb, projectId, "fr", {
        name: v.name,
        sub: v.sub,
        description: v.description,
        about: v.about,
        tagline: v.tagline,
        caption: v.caption,
    });
    await upsertTranslation(pb, projectId, "en", {
        name: v.nameEn,
        sub: v.subEn,
        description: v.descriptionEn,
        about: v.aboutEn,
        tagline: v.taglineEn,
        caption: v.captionEn,
    });
}

async function loadTechOptions(pb: PocketBase): Promise<{ id: string, name: string }[]> {
    const records = await pb.collection("technologies").getFullList({ sort: "name", fields: "id,name" });
    return records.map(r => ({ id: r.id, name: r.name }));
}

// The state of the form page; `undefined` when the project does not exist.
export async function projectFormState(pb: PocketBase, id?: string): Promise<ProjectFormState | undefined> {
    const allTechs = await loadTechOptions(pb);
    if (!id) {
        return { values: emptyValues(), pictures: [], techs: [], availableTechs: allTechs };
    }

    let record: RecordModel;
    try {
        record = await pb.collection("projects").getOne(id, {
            expand: "project_translations_via_project,project_techs_via_project.technology",
        });
    } catch {
        return undefined;
    }

    const translations = record.expand?.project_translations_via_project as RecordModel[] | undefined;
    const fr = translations?.find(r => r.locale === "fr");
    const en = translations?.find(r => r.locale === "en");
    const junctions = ((record.expand?.project_techs_via_project as RecordModel[] | undefined) ?? [])
        .slice()
        .sort((a, b) => a.position - b.position);

    const techs: AdminTechRow[] = junctions.map(j => ({
        id: j.id,
        technologyId: j.technology,
        name: j.expand?.technology?.name ?? "?",
        role: j.role,
    }));
    const usedTechIds = new Set(junctions.map(j => j.technology));

    return {
        values: {
            slug: record.slug,
            featured: !!record.featured,
            carousel: !!record.carousel,
            badge: record.badge ?? "",
            category: record.category,
            type: record.type,
            context: record.context,
            year: String(record.year ?? ""),
            date: record.date ?? "",
            teamSize: String(record.team_size ?? ""),
            languages: record.languages ?? [],
            github: record.github ?? "",
            link: record.link ?? "",
            name: fr?.name ?? "",
            sub: fr?.sub ?? "",
            description: fr?.description ?? "",
            about: fr?.about ?? "",
            tagline: fr?.tagline ?? "",
            caption: fr?.caption ?? "",
            nameEn: en?.name ?? "",
            subEn: en?.sub ?? "",
            descriptionEn: en?.description ?? "",
            aboutEn: en?.about ?? "",
            taglineEn: en?.tagline ?? "",
            captionEn: en?.caption ?? "",
        },
        thumbUrl: pb.files.getURL(record, record.thumb, { thumb: "800x0" }),
        pictures: ((record.pictures as string[] | undefined) ?? []).map(name => ({
            name,
            url: pb.files.getURL(record, name),
        })),
        techs,
        availableTechs: allTechs.filter(t => !usedTechIds.has(t.id)),
    };
}

export async function handleProjectPost(pb: PocketBase, data: FormData, id?: string): Promise<PostResult> {
    const action = String(data.get("action") ?? "save");
    const values = parseForm(data);

    try {
        if (action === "save") {
            if (values.languages.length === 0) {
                return { error: "Sélectionnez au moins une langue du projet.", values };
            }

            const payload = projectPayload(values);
            const thumb = file(data, "thumb");
            const newPictures = files(data, "pictures");

            if (!id) {
                if (!thumb) {
                    return { error: "La vignette (thumb) est requise pour créer un projet.", values };
                }
                payload.thumb = thumb;
                // `pictures` is required by the collection: default to the thumb.
                payload.pictures = newPictures.length > 0 ? newPictures : [thumb];
                const record = await pb.collection("projects").create(payload);
                await upsertTranslations(pb, record.id, values);
                if (values.carousel) await claimCarousel(pb, record.id);
                invalidateCache();
                return { redirect: `/admin/projects/${record.id}?created=1` };
            }

            if (thumb) payload.thumb = thumb;
            if (newPictures.length > 0) payload["pictures+"] = newPictures;
            const removedPictures = data.getAll("remove_pictures").map(String);
            if (removedPictures.length > 0) payload["pictures-"] = removedPictures;

            await pb.collection("projects").update(id, payload);
            await upsertTranslations(pb, id, values);
            if (values.carousel) await claimCarousel(pb, id);
            invalidateCache();
            return { redirect: `/admin/projects/${id}?saved=1` };
        }

        // The whole techs list is saved at once: the order of the rows in
        // the submitted form gives the 1-based `position` of each junction
        // (PocketBase treats 0 as blank on required numbers).
        if (action !== "save-techs" || !id) {
            return { error: "Action invalide.", values };
        }

        for (const removedId of data.getAll("tech_removed").map(String)) {
            await pb.collection("project_techs").delete(removedId);
        }

        const refs = data.getAll("tech_ref").map(String);
        const roles = data.getAll("tech_role").map(String);
        for (let i = 0; i < refs.length; i++) {
            const fields = { role: roles[i] ?? "", position: i + 1 };
            if (refs[i].startsWith("new:")) {
                await pb.collection("project_techs").create({
                    project: id,
                    technology: refs[i].slice("new:".length),
                    ...fields,
                });
            } else {
                await pb.collection("project_techs").update(refs[i], fields);
            }
        }

        invalidateCache();
        return { redirect: `/admin/projects/${id}?saved=1` };
    } catch (err) {
        return { error: pbErrorMessage(err), values };
    }
}

export async function listAdminProjects(pb: PocketBase): Promise<AdminProjectRow[]> {
    const records = await pb.collection("projects").getFullList({
        sort: "-year,created",
        expand: "project_translations_via_project",
    });
    return records.map(record => ({
        id: record.id,
        slug: record.slug,
        name: (record.expand?.project_translations_via_project as RecordModel[] | undefined)
            ?.find(r => r.locale === "fr")?.name ?? record.slug,
        year: record.year,
        category: record.category,
        context: record.context,
        featured: !!record.featured,
        carousel: !!record.carousel,
        thumbUrl: pb.files.getURL(record, record.thumb, { thumb: "800x0" }),
    }));
}
