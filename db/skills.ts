import type { Technology } from "@db/models";

export async function listSkills(): Promise<Technology[]> {
    return [{
        logo: "https://sciencesky.fr/",
        name: "svelte",
        loved: true,
    }];
}