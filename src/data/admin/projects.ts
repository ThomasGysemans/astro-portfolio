// Server-side logic of the back-office project pages: form state, POST
// handling (project + French/English translations + tech junctions) and the list.
import type PocketBase from "pocketbase";
import type { RecordModel } from "pocketbase";
import { invalidateCache } from "@data/pb";
import { type MediaEmbed, mergeMedia, parseEmbeds, youtubeId } from "@data/media";
import { type FormResult, FormError, ScopedError, failure, file, files, pbErrorMessage, text } from "./forms";

// Everything is kept as strings (except the checkboxes) so the values can
// round-trip between the form inputs and the POST handler as-is.
export type ProjectFormValues = {
    slug: string,
    featured: boolean,
    carousel: boolean,
    hidden: boolean, // hidden projects are filtered out of every public query
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
    color: string,
    role: string,
};

// One row of the media editor. `name` is the key the row is addressed by, on
// both sides: the stored filename for an upload, the link itself for a
// YouTube embed (which is also how its caption is keyed).
export type AdminPicture = {
    name: string,
    url: string,
    youtube: boolean,
    captionFr: string,
    captionEn: string,
};

export type ProjectFormState = {
    values: ProjectFormValues,
    thumbUrl?: string,
    thumbVideoUrl?: string,
    pictures: AdminPicture[],
    techs: AdminTechRow[],
    availableTechs: TechOption[],
};

export type TechOption = { id: string, name: string, color: string };

export type AdminProjectRow = {
    id: string,
    slug: string,
    name: string,
    year: number,
    categories: string[],
    context: string,
    featured: boolean,
    carousel: boolean,
    hidden: boolean,
    thumbUrl: string,
};

type PostResult = FormResult<ProjectFormValues>;

// The `projects` columns whose form control has another name.
const PROJECT_CONTROLS: Record<string, string> = { team_size: "teamSize" };

// Errors of a `projects` write, renamed after the form controls.
function projectError(err: unknown): unknown {
    return err instanceof ScopedError ? err : new ScopedError(err, column => PROJECT_CONTROLS[column] ?? column);
}

function emptyValues(): ProjectFormValues {
    return {
        slug: "",
        featured: false,
        carousel: false,
        hidden: false,
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
        hidden: data.has("hidden"),
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
        hidden: v.hidden,
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
// media (`existing:<filename>`, `new:<index into the uploaded files>` or
// `youtube:<link>`), aligned with the `picture_alt_fr`/`picture_alt_en`
// caption inputs.
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

// True when the submitted order keeps at least one uploaded file. A YouTube
// link cannot stand in for one: `pictures` is a required file field, so a
// project whose media list holds nothing but embeds cannot be stored.
function keepsAFile(order: PictureOrder): boolean {
    return order.tokens.some(token => !token.startsWith("youtube:"));
}

// Applies the submitted order and captions to the record's media.
// The files uploaded in this save were appended at the end of the field,
// in submission order: resolve the `new:<i>` tokens against that tail,
// then rewrite the full filename list (PocketBase reorders the kept files
// and deletes the omitted ones) along with the captions map.
//
// The YouTube links go to their own column, since a file field cannot hold a
// URL — but they share the one display order the admin sees: an embed records
// the index it occupies in the merged list, which is simply how many media
// were kept before it. Both columns are written in the same update, so they
// can never drift apart.
async function applyPictureOrder(pb: PocketBase, recordId: string, stored: string[], uploadedCount: number, order: PictureOrder): Promise<void> {
    const appended = uploadedCount > 0 ? stored.slice(stored.length - uploadedCount) : [];
    const desired: string[] = [];
    const embeds: MediaEmbed[] = [];
    const captions: PictureCaptions = {};
    order.tokens.forEach((token, i) => {
        // The key a caption is stored under: the filename, or the link.
        let key: string;
        if (token.startsWith("youtube:")) {
            const url = token.slice("youtube:".length).trim();
            if (!youtubeId(url) || embeds.some(embed => embed.url === url)) return;
            embeds.push({ url, position: desired.length + embeds.length });
            key = url;
        } else {
            const name = token.startsWith("new:")
                ? appended[Number(token.slice("new:".length))]
                : token.slice("existing:".length);
            if (!name || !stored.includes(name) || desired.includes(name)) return;
            desired.push(name);
            key = name;
        }
        const fr = order.captionsFr[i]?.trim() ?? "";
        const en = order.captionsEn[i]?.trim() ?? "";
        if (fr || en) captions[key] = { fr, en };
    });
    // `pictures` is required: never wipe it entirely from here (the POST
    // handler rejects a fully emptied list before writing anything). The
    // embeds keep their positions, so the kept files land after them.
    if (desired.length === 0) desired.push(...stored);
    await pb.collection("projects").update(recordId, {
        pictures: desired,
        picture_embeds: embeds,
        picture_captions: captions,
    });
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
    try {
        await writeTranslationRow(pb, projectId, locale, fields);
    } catch (err) {
        // The row's columns are the form's French controls, or `<column>_en`.
        throw new ScopedError(
            err,
            column => locale === "en" ? `${column}_en` : column,
            locale === "en" ? "Traduction anglaise" : "Textes français",
        );
    }
}

async function writeTranslationRow(pb: PocketBase, projectId: string, locale: "fr" | "en", fields?: Record<string, string>): Promise<void> {
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

// The whole techs list is saved with the project. The form submits the wanted
// state — one `tech_id` (technology) and `tech_role` per row, in display order —
// and it is reconciled against the junctions actually stored, keyed by
// technology: the order gives the 1-based `position` (PocketBase treats 0 as
// blank on required numbers). Since the async form is not re-rendered after a
// failure, a retry replays the same request: reconciling makes that converge
// instead of failing on an already-deleted junction or duplicating a new one.
// Absent marker = the techs editor did not run (no JS): leave them untouched.
// Exported for the unit tests only.
export async function saveTechs(pb: PocketBase, projectId: string, data: FormData): Promise<void> {
    if (!data.has("techs_present")) return;
    const ids = data.getAll("tech_id").map(String);
    const roles = data.getAll("tech_role").map(String);

    const stored = await pb.collection("project_techs").getFullList({
        filter: pb.filter("project = {:id}", { id: projectId }),
        fields: "id,technology",
    });
    const byTech = new Map(stored.map(j => [j.technology as string, j.id]));
    const wanted = new Set(ids);

    // Each write is wrapped so the problem names the row it belongs to.
    const step = async (where: string, write: () => Promise<unknown>) => {
        try {
            await write();
        } catch (err) {
            throw new FormError(`Technologies (${where}) : ${pbErrorMessage(err)}`, { techs: `${where} : ${pbErrorMessage(err)}` });
        }
    };

    for (const [technology, junctionId] of byTech) {
        if (!wanted.has(technology)) {
            await step("retrait d'une technologie", () => pb.collection("project_techs").delete(junctionId));
        }
    }
    const seen = new Set<string>();
    for (let i = 0; i < ids.length; i++) {
        if (seen.has(ids[i])) continue;
        seen.add(ids[i]);
        const fields = { role: roles[i] ?? "", position: seen.size };
        const junctionId = byTech.get(ids[i]);
        await step(`ligne ${seen.size}`, () => junctionId
            ? pb.collection("project_techs").update(junctionId, fields)
            : pb.collection("project_techs").create({ project: projectId, technology: ids[i], ...fields }));
    }
}

async function loadTechOptions(pb: PocketBase): Promise<TechOption[]> {
    const records = await pb.collection("technologies").getFullList({ sort: "name", fields: "id,name,color" });
    return records.map(r => ({ id: r.id, name: r.name, color: r.color ?? "" }));
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
        color: j.expand?.technology?.color ?? "",
        role: j.role,
    }));
    const usedTechIds = new Set(junctions.map(j => j.technology));

    return {
        values: {
            slug: record.slug,
            featured: !!record.featured,
            carousel: !!record.carousel,
            hidden: !!record.hidden,
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
        thumbVideoUrl: record.thumb_video ? pb.files.getURL(record, record.thumb_video) : undefined,
        // Same merge as the public site, so the editor shows the real order.
        pictures: mergeMedia((record.pictures as string[] | undefined) ?? [], parseEmbeds(record.picture_embeds))
            .map(slot => ({
                name: slot.name,
                url: slot.youtube ? slot.name : pb.files.getURL(record, slot.name),
                youtube: slot.youtube,
                captionFr: pictureCaptions(record)[slot.name]?.fr ?? "",
                captionEn: pictureCaptions(record)[slot.name]?.en ?? "",
            })),
        techs,
        availableTechs: allTechs.filter(t => !usedTechIds.has(t.id)),
    };
}

export async function handleProjectPost(pb: PocketBase, request: Request, id?: string): Promise<PostResult> {
    // Read inside the handler, not in the page: parsing the multipart body
    // throws on a truncated or oversized upload (the serverless platform caps
    // the request size), and an uncaught throw there answers a bare 500.
    // No `values` then: the page keeps the record (or the blank form) rather
    // than overwriting it with empty strings.
    let data: FormData;
    try {
        data = await request.formData();
    } catch {
        return {
            error: "Impossible de lire le formulaire : l'envoi a été interrompu, probablement parce que les fichiers sont trop lourds. Allège les médias et réessaie.",
        };
    }

    const action = String(data.get("action") ?? "save");
    const values = parseForm(data);
    if (action !== "save") {
        return { error: "Action invalide.", values };
    }

    if (values.categories.length === 0) {
        return { error: "Sélectionne au moins une catégorie.", fields: { categories: "Coche au moins une catégorie." }, values };
    }
    if (values.languages.length === 0) {
        return { error: "Sélectionne au moins une langue du projet.", fields: { languages: "Coche au moins une langue." }, values };
    }
    // All-empty English is fine (the site falls back to French), but a
    // partial one cannot be stored: those three columns are required.
    if (hasEnglish(values) && !(values.nameEn && values.subEn && values.descriptionEn)) {
        const missing = "Obligatoire dès qu'un champ anglais est rempli (ou vide tous les champs anglais pour afficher le français).";
        const fields: Record<string, string> = {};
        if (!values.nameEn) fields.name_en = missing;
        if (!values.subEn) fields.sub_en = missing;
        if (!values.descriptionEn) fields.description_en = missing;
        return {
            error: "Traduction anglaise incomplète : dès qu'un champ anglais est rempli, Nom, Sous-titre et Description (EN) le sont aussi. Laisse tous les champs anglais vides pour afficher le français.",
            fields,
            values,
        };
    }

    const payload = projectPayload(values);
    const thumb = file(data, "thumb");
    const thumbVideo = file(data, "thumb_video");
    const newPictures = files(data, "pictures");
    const order = parsePictureOrder(data);

    try {
        if (!id) {
            if (!thumb) {
                return { error: "La vignette (thumb) est requise pour créer un projet.", fields: { thumb: "Choisis une image de vignette." }, values };
            }
            payload.thumb = thumb;
            if (thumbVideo) payload.thumb_video = thumbVideo;
            // `pictures` is required by the collection: default to the thumb.
            payload.pictures = newPictures.length > 0 ? newPictures : [thumb];
            const record = await pb.collection("projects").create(payload).catch(err => {
                throw projectError(err);
            });
            try {
                if (order && order.tokens.length > 0) {
                    await applyPictureOrder(pb, record.id, record.pictures as string[], newPictures.length, order);
                }
                await upsertTranslations(pb, record.id, values);
                await saveTechs(pb, record.id, data);
                if (values.carousel) await claimCarousel(pb, record.id);
            } catch (err) {
                // A project stored without its translations has no name at
                // all on the public site, and its slug then blocks any
                // retry (unique index): undo the creation entirely. The
                // translation rows and tech junctions cascade with it.
                await pb.collection("projects").delete(record.id).catch(() => {});
                throw err;
            }
            invalidateCache();
            return { redirect: `/admin/projects/${record.id}?created=1` };
        }

        // An emptied media list would leave the project without any
        // picture, which the collection forbids: reject before writing.
        // YouTube links do not count — they live in another column.
        if (order && !keepsAFile(order) && newPictures.length === 0) {
            return {
                error: "Le projet doit garder au moins une image ou vidéo importée : un lien YouTube ne peut pas être son seul média.",
                fields: { pictures: "Garde ou ajoute au moins une image ou vidéo importée." },
                values,
            };
        }

        if (thumb) payload.thumb = thumb;
        // An upload replaces the video; the checkbox alone clears it (the
        // PocketBase SDK sends `null` as an empty value, which deletes the
        // stored file and puts the project back on its still thumbnail).
        if (thumbVideo) payload.thumb_video = thumbVideo;
        else if (data.has("thumb_video_remove")) payload.thumb_video = null;
        if (newPictures.length > 0) payload["pictures+"] = newPictures;

        const record = await pb.collection("projects").update(id, payload).catch(err => {
            throw projectError(err);
        });
        if (order) {
            await applyPictureOrder(pb, id, record.pictures as string[], newPictures.length, order);
        }
        await upsertTranslations(pb, id, values);
        await saveTechs(pb, id, data);
        if (values.carousel) await claimCarousel(pb, id);
        invalidateCache();
        return { redirect: `/admin/projects/${id}?saved=1` };
    } catch (err) {
        // Some writes may have gone through before the failing one (project,
        // pictures, translations…): the public cache must not keep serving
        // the previous version of what is now stored.
        invalidateCache();
        return failure(err, values);
    }
}

// Memoised per client, i.e. per request (each admin request builds its own):
// the projects list page and the layout's explorer share one query. Every
// caller lists after the request's own writes, so the memo is never stale.
const projectLists = new WeakMap<PocketBase, Promise<AdminProjectRow[]>>();

export function listAdminProjects(pb: PocketBase): Promise<AdminProjectRow[]> {
    let list = projectLists.get(pb);
    if (!list) {
        list = fetchAdminProjects(pb);
        projectLists.set(pb, list);
    }
    return list;
}

async function fetchAdminProjects(pb: PocketBase): Promise<AdminProjectRow[]> {
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
        hidden: !!record.hidden,
        thumbUrl: pb.files.getURL(record, record.thumb, { thumb: "800x0" }),
    }));
}
