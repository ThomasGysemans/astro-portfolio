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
    categories: string[],
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

export type AdminPicture = {
    name: string,
    url: string,
    captionFr: string,
    captionEn: string,
};

export type ProjectFormState = {
    values: ProjectFormValues,
    thumbUrl?: string,
    pictures: AdminPicture[],
    techs: AdminTechRow[],
    availableTechs: { id: string, name: string }[],
};

export type AdminProjectRow = {
    id: string,
    slug: string,
    name: string,
    year: number,
    categories: string[],
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
        categories: [],
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
        categories: data.getAll("categories").map(String),
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
        categories: v.categories,
        context: v.context,
        year: Number(v.year),
        date: v.date,
        team_size: Number(v.teamSize),
        languages: v.languages,
        github: v.github,
        link: v.link,
    };
}

type PictureCaptions = Record<string, { fr?: string, en?: string }>;

function pictureCaptions(record: RecordModel): PictureCaptions {
    return (record.picture_captions ?? {}) as PictureCaptions;
}

// The media list of the form submits one `picture_order` token per kept
// media (`existing:<filename>` or `new:<index into the uploaded files>`),
// aligned with the `picture_alt_fr`/`picture_alt_en` caption inputs.
type PictureOrder = {
    tokens: string[],
    captionsFr: string[],
    captionsEn: string[],
};

function parsePictureOrder(data: FormData): PictureOrder | undefined {
    // Absent marker = the media editor did not run (no JS): leave the
    // pictures untouched instead of wiping them.
    if (!data.has("picture_order_present")) return undefined;
    return {
        tokens: data.getAll("picture_order").map(String),
        captionsFr: data.getAll("picture_alt_fr").map(String),
        captionsEn: data.getAll("picture_alt_en").map(String),
    };
}

// Applies the submitted order and captions to the record's pictures.
// The files uploaded in this save were appended at the end of the field,
// in submission order: resolve the `new:<i>` tokens against that tail,
// then rewrite the full filename list (PocketBase reorders the kept files
// and deletes the omitted ones) along with the captions map.
async function applyPictureOrder(pb: PocketBase, recordId: string, stored: string[], uploadedCount: number, order: PictureOrder): Promise<void> {
    const appended = uploadedCount > 0 ? stored.slice(stored.length - uploadedCount) : [];
    const desired: string[] = [];
    const captions: PictureCaptions = {};
    order.tokens.forEach((token, i) => {
        const name = token.startsWith("new:")
            ? appended[Number(token.slice("new:".length))]
            : token.slice("existing:".length);
        if (!name || !stored.includes(name) || desired.includes(name)) return;
        desired.push(name);
        const fr = order.captionsFr[i]?.trim() ?? "";
        const en = order.captionsEn[i]?.trim() ?? "";
        if (fr || en) captions[name] = { fr, en };
    });
    // `pictures` is required: never wipe it entirely from here (the POST
    // handler rejects a fully emptied list before writing anything).
    if (desired.length === 0) desired.push(...stored);
    await pb.collection("projects").update(recordId, { pictures: desired, picture_captions: captions });
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

// Writes the row of a locale, or removes it when `fields` is undefined.
async function writeTranslation(pb: PocketBase, projectId: string, locale: "fr" | "en", fields?: Record<string, string>): Promise<void> {
    const rows = await pb.collection("project_translations").getFullList({
        filter: pb.filter("project = {:id} && locale = {:locale}", { id: projectId, locale }),
    });
    if (!fields) {
        for (const row of rows) {
            await pb.collection("project_translations").delete(row.id);
        }
    } else if (rows.length > 0) {
        await pb.collection("project_translations").update(rows[0].id, fields);
    } else {
        await pb.collection("project_translations").create({ project: projectId, locale, ...fields });
    }
}

// The English translation is optional (`localize()` falls back to the French
// text field by field on the public site), but `project_translations` requires
// `name`, `sub` and `description`: a blank English row is rejected by
// PocketBase, so an untranslated project must simply have no English row.
function hasEnglish(v: ProjectFormValues): boolean {
    return !!(v.nameEn || v.subEn || v.descriptionEn || v.aboutEn || v.taglineEn || v.captionEn);
}

async function upsertTranslations(pb: PocketBase, projectId: string, v: ProjectFormValues): Promise<void> {
    await writeTranslation(pb, projectId, "fr", {
        name: v.name,
        sub: v.sub,
        description: v.description,
        about: v.about,
        tagline: v.tagline,
        caption: v.caption,
    });
    await writeTranslation(pb, projectId, "en", hasEnglish(v) ? {
        name: v.nameEn,
        sub: v.subEn,
        description: v.descriptionEn,
        about: v.aboutEn,
        tagline: v.taglineEn,
        caption: v.captionEn,
    } : undefined);
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
            categories: record.categories ?? [],
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
            captionFr: pictureCaptions(record)[name]?.fr ?? "",
            captionEn: pictureCaptions(record)[name]?.en ?? "",
        })),
        techs,
        availableTechs: allTechs.filter(t => !usedTechIds.has(t.id)),
    };
}

export async function handleProjectPost(pb: PocketBase, request: Request, id?: string): Promise<PostResult> {
    // Read inside the handler, not in the page: parsing the multipart body
    // throws on a truncated or oversized upload (the serverless platform caps
    // the request size), and an uncaught throw there answers a bare 500.
    let data: FormData;
    try {
        data = await request.formData();
    } catch {
        return {
            error: "Impossible de lire le formulaire : l'envoi a été interrompu, probablement parce que les fichiers sont trop lourds. Allège les médias et réessaie.",
            values: emptyValues(),
        };
    }

    const action = String(data.get("action") ?? "save");
    const values = parseForm(data);

    try {
        if (action === "save") {
            if (values.categories.length === 0) {
                return { error: "Sélectionne au moins une catégorie.", values };
            }
            if (values.languages.length === 0) {
                return { error: "Sélectionne au moins une langue du projet.", values };
            }
            // All-empty English is fine (the site falls back to French), but a
            // partial one cannot be stored: those three columns are required.
            if (hasEnglish(values) && !(values.nameEn && values.subEn && values.descriptionEn)) {
                return {
                    error: "Traduction anglaise incomplète : dès qu'un champ anglais est rempli, Nom, Sous-titre et Description (EN) le sont aussi. Laisse tous les champs anglais vides pour afficher le français.",
                    values,
                };
            }

            const payload = projectPayload(values);
            const thumb = file(data, "thumb");
            const newPictures = files(data, "pictures");
            const order = parsePictureOrder(data);

            if (!id) {
                if (!thumb) {
                    return { error: "La vignette (thumb) est requise pour créer un projet.", values };
                }
                payload.thumb = thumb;
                // `pictures` is required by the collection: default to the thumb.
                payload.pictures = newPictures.length > 0 ? newPictures : [thumb];
                const record = await pb.collection("projects").create(payload);
                try {
                    if (order && order.tokens.length > 0) {
                        await applyPictureOrder(pb, record.id, record.pictures as string[], newPictures.length, order);
                    }
                    await upsertTranslations(pb, record.id, values);
                    if (values.carousel) await claimCarousel(pb, record.id);
                } catch (err) {
                    // A project stored without its translations has no name at
                    // all on the public site, and its slug then blocks any
                    // retry (unique index): undo the creation entirely. The
                    // translation rows cascade with it.
                    await pb.collection("projects").delete(record.id).catch(() => {});
                    throw err;
                }
                invalidateCache();
                return { redirect: `/admin/projects/${record.id}?created=1` };
            }

            // An emptied media list would leave the project without any
            // picture, which the collection forbids: reject before writing.
            if (order && order.tokens.length === 0 && newPictures.length === 0) {
                return { error: "Le projet doit garder au moins une image ou vidéo.", values };
            }

            if (thumb) payload.thumb = thumb;
            if (newPictures.length > 0) payload["pictures+"] = newPictures;

            const record = await pb.collection("projects").update(id, payload);
            if (order) {
                await applyPictureOrder(pb, id, record.pictures as string[], newPictures.length, order);
            }
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
        categories: record.categories ?? [],
        context: record.context,
        featured: !!record.featured,
        carousel: !!record.carousel,
        thumbUrl: pb.files.getURL(record, record.thumb, { thumb: "800x0" }),
    }));
}
