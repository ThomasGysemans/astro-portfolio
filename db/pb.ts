import PocketBase from 'pocketbase';

if (!import.meta.env.POCKETBASE_URL) {
    throw new Error("Missing environment variable 'POCKETBASE_URL'");
}

export const pb = new PocketBase(import.meta.env.POCKETBASE_URL);