// Small helpers shared by the POST handlers of the back-office pages.
import { ClientResponseError } from "pocketbase";

export function text(data: FormData, name: string): string {
    const value = data.get(name);
    return typeof value === "string" ? value.trim() : "";
}

// A file input left empty still submits an entry: only keep real uploads.
export function file(data: FormData, name: string): File | undefined {
    const value = data.get(name);
    return value instanceof File && value.size > 0 && value.name ? value : undefined;
}

export function files(data: FormData, name: string): File[] {
    return data.getAll(name).filter((v): v is File => v instanceof File && v.size > 0 && !!v.name);
}

// Problems keyed by the `name` of the form control they belong to, so the
// client can mark that very control and focus it.
export type FieldErrors = Record<string, string>;

// A PocketBase error raised while writing a record whose columns are not named
// like the form controls (the English translation row stores `name`, the form
// submits it as `name_en`). `rename` maps a column back to its control, and
// `context` prefixes the message so the admin knows which record failed.
export class ScopedError extends Error {
    constructor(readonly original: unknown, readonly rename: (column: string) => string, readonly context?: string) {
        super(original instanceof Error ? original.message : String(original));
    }
}

// A failure already phrased for the form: its own message and field problems
// (e.g. which row of the techs list failed), passed through `failure()` as is.
export class FormError extends Error {
    constructor(message: string, readonly fields: FieldErrors = {}) {
        super(message);
    }
}

// French wording of the PocketBase validation codes the back-office can hit;
// anything else keeps PocketBase's own (English) message.
const VALIDATION_MESSAGES: Record<string, string> = {
    validation_required: "Ce champ est obligatoire.",
    validation_not_unique: "Cette valeur est déjà utilisée par un autre enregistrement.",
    validation_invalid_format: "Format invalide.",
    validation_invalid_url: "Adresse invalide (elle doit commencer par https://).",
    validation_length_out_of_range: "Longueur invalide.",
    validation_length_too_long: "Texte trop long.",
    validation_file_size_limit: "Fichier trop lourd.",
    validation_invalid_mime_type: "Type de fichier non accepté.",
};

type PbFieldError = { code?: string, message?: string };

function fieldMessage(e: PbFieldError | undefined): string {
    return (e?.code && VALIDATION_MESSAGES[e.code]) || e?.message || "Valeur invalide.";
}

function unwrap(err: unknown): { error: unknown, rename: (column: string) => string, context?: string } {
    if (err instanceof ScopedError) return { error: err.original, rename: err.rename, context: err.context };
    return { error: err, rename: column => column };
}

// A readable French message out of a PocketBase error, including
// the per-field validation details when there are any.
export function pbErrorMessage(err: unknown): string {
    const { error, context } = unwrap(err);
    const prefix = context ? `${context} : ` : "";
    if (error instanceof ClientResponseError) {
        const fields = error.response?.data as Record<string, PbFieldError> | undefined;
        const details = Object.entries(fields ?? {})
            .map(([field, e]) => `${field} : ${fieldMessage(e)}`)
            .join(" ; ");
        const message = error.response?.message ?? error.message;
        return prefix + (details ? `${message} (${details})` : message);
    }
    return prefix + (error instanceof Error ? error.message : "Erreur inconnue.");
}

// The per-field validation details of a PocketBase error, keyed by the name
// of the form control (through the `ScopedError` renaming, when there is one).
export function pbFieldErrors(err: unknown): FieldErrors {
    if (err instanceof FormError) return { ...err.fields };
    const { error, rename } = unwrap(err);
    if (!(error instanceof ClientResponseError)) return {};
    const fields = error.response?.data as Record<string, PbFieldError> | undefined;
    const result: FieldErrors = {};
    for (const [column, e] of Object.entries(fields ?? {})) {
        result[rename(column)] = fieldMessage(e);
    }
    return result;
}

// The outcome of a back-office POST handler.
export type FormResult<V = unknown> =
    | { redirect: string }
    | { error: string, fields?: FieldErrors, values?: V };

// Forms enhanced by the back-office runtime (`src/lib/admin/runtime.ts`) are
// sent with `fetch` and flagged by this header: they get a JSON answer instead
// of a re-rendered page, so the browser never replaces the form — files picked
// in file inputs and the islands' unsaved state survive a failed save.
export const ASYNC_HEADER = "x-admin-async";

export function isAsyncRequest(request: Request): boolean {
    return request.headers.get(ASYNC_HEADER) === "1";
}

export function formResponse(result: FormResult): Response {
    const body = "redirect" in result
        ? { ok: true, redirect: result.redirect }
        : { ok: false, error: result.error, fields: result.fields ?? {} };
    return Response.json(body, {
        // 422 keeps failed saves visible in the network panel, while the
        // client still reads the JSON body whatever the status.
        status: "redirect" in result ? 200 : 422,
        headers: { "cache-control": "no-store" },
    });
}

// The `FormResult` of a failed write: the message plus its per-field details.
export function failure<V>(err: unknown, values?: V): FormResult<V> {
    return { error: pbErrorMessage(err), fields: pbFieldErrors(err), values };
}
