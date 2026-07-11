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

// A readable French message out of a PocketBase error, including
// the per-field validation details when there are any.
export function pbErrorMessage(err: unknown): string {
    if (err instanceof ClientResponseError) {
        const fields = err.response?.data as Record<string, { message?: string }> | undefined;
        const details = Object.entries(fields ?? {})
            .map(([field, e]) => `${field} : ${e?.message ?? "valeur invalide"}`)
            .join(" ; ");
        return details ? `${err.response?.message ?? err.message} (${details})` : (err.response?.message ?? err.message);
    }
    return err instanceof Error ? err.message : "Erreur inconnue.";
}
