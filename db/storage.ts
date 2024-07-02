import { isStorageError, type StorageError } from '@supabase/storage-js'
import { createClient } from "@supabase/supabase-js";

export abstract class Storage {
    private static getClient() {
        if (import.meta.env.SUPABASE_STORAGE_URL == undefined) {
            throw new Error("Cannot access to database from client side.");
        }
        return createClient(import.meta.env.SUPABASE_STORAGE_URL, import.meta.env.SUPABASE_KEY);
    }

    public static toPath(slug: string, filename: string): string {
        return `projects/${slug}/${filename}`;
    }

    public static async storeImage(file: File, slug: string): Promise<string | StorageError> {
        const supabase = this.getClient();
        const { data, error } = await supabase
            .storage
            .from(import.meta.env.SUPABASE_STORAGE_BUCKET)
            .upload(this.toPath(slug, file.name), file, {
                upsert: true
            })
        if (error) {
            return error;
        }
        return data.path;
    }

    public static async storeImages(files: File[], slug: string): Promise<boolean> {
        const uploads: Promise<string|StorageError>[] = [];
        for (const file of files) {
            uploads.push(
                Storage.storeImage(file, slug)
            );
        }
        return !(await Promise.all(uploads)).some(isStorageError)
    }

    public static async getImageUrl(path: string): Promise<string> {
        return this.getClient()
            .storage
            .from(import.meta.env.SUPABASE_STORAGE_BUCKET)
            .getPublicUrl(path)
            .data.publicUrl;
    }
}