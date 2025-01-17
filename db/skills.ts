import type { PBTechnology } from "@db/models";
import { pb } from "@db/pb.ts";

export async function listSkills(): Promise<PBTechnology[]> {
    return await pb.collection<PBTechnology>("technologies").getFullList({
        sort: "-created",
    });
}