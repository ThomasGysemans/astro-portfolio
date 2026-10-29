import { describe, expect, it } from "vitest";
import type PocketBase from "pocketbase";
import { saveTechs } from "@data/admin/projects";
import { FormError, failure } from "@data/admin/forms";

type Junction = { id: string, project: string, technology: string, role: string, position: number };

// In-memory stand-in for the `project_techs` collection: just what
// `saveTechs` calls. `failOn` makes one write throw, once.
function stubPb(initial: Junction[], failOn?: { op: "create" | "update" | "delete", technology: string }) {
    const rows = initial.map(r => ({ ...r }));
    let next = 100;
    let armed = !!failOn;
    const trip = (op: string, technology: string) => {
        if (armed && failOn?.op === op && failOn.technology === technology) {
            armed = false;
            throw new Error(`${op} refusé`);
        }
    };
    const collection = {
        getFullList: async () => rows.map(r => ({ id: r.id, technology: r.technology })),
        delete: async (id: string) => {
            const i = rows.findIndex(r => r.id === id);
            if (i < 0) throw new Error("404");
            trip("delete", rows[i].technology);
            rows.splice(i, 1);
        },
        update: async (id: string, fields: Partial<Junction>) => {
            const row = rows.find(r => r.id === id);
            if (!row) throw new Error("404");
            trip("update", row.technology);
            Object.assign(row, fields);
        },
        create: async (fields: Omit<Junction, "id">) => {
            trip("create", fields.technology);
            if (rows.some(r => r.technology === fields.technology)) throw new Error("unique");
            rows.push({ id: `j${next++}`, ...fields });
        },
    };
    const pb = { filter: () => "", collection: () => collection } as unknown as PocketBase;
    return { pb, rows };
}

function form(techs: [string, string][]): FormData {
    const data = new FormData();
    data.append("techs_present", "1");
    for (const [id, role] of techs) {
        data.append("tech_id", id);
        data.append("tech_role", role);
    }
    return data;
}

const ordered = (rows: Junction[]) => rows.slice().sort((a, b) => a.position - b.position).map(r => `${r.technology}:${r.role}`);

describe("saveTechs", () => {
    const initial: Junction[] = [
        { id: "j1", project: "p", technology: "svelte", role: "frontend", position: 1 },
        { id: "j2", project: "p", technology: "scss", role: "styles", position: 2 },
    ];

    it("reconciles the stored junctions with the submitted rows (order, roles, additions, removals)", async () => {
        const { pb, rows } = stubPb(initial);
        await saveTechs(pb, "p", form([["rust", "backend"], ["svelte", "framework"]]));
        expect(ordered(rows)).toEqual(["rust:backend", "svelte:framework"]);
        expect(rows.find(r => r.technology === "svelte")?.id).toBe("j1");
    });

    it("converges when a save that failed halfway is replayed", async () => {
        // First try: scss is removed, rust created, then the svelte update fails.
        const { pb, rows } = stubPb(initial, { op: "update", technology: "svelte" });
        const wanted = form([["rust", "backend"], ["svelte", "framework"]]);
        await expect(saveTechs(pb, "p", wanted)).rejects.toBeInstanceOf(FormError);
        // The very same request again (the async form was not re-rendered).
        await saveTechs(pb, "p", wanted);
        expect(ordered(rows)).toEqual(["rust:backend", "svelte:framework"]);
        expect(rows.filter(r => r.technology === "rust")).toHaveLength(1);
    });

    it("leaves the junctions alone when the editor did not run (no JS)", async () => {
        const { pb, rows } = stubPb(initial);
        await saveTechs(pb, "p", new FormData());
        expect(ordered(rows)).toEqual(["svelte:frontend", "scss:styles"]);
    });

    it("names the failing row in the techs field problem", async () => {
        const { pb } = stubPb(initial, { op: "create", technology: "rust" });
        const result = await saveTechs(pb, "p", form([["svelte", "frontend"], ["rust", "backend"]])).catch(err => failure(err));
        expect(result).toMatchObject({ fields: { techs: expect.stringContaining("ligne 2") } });
    });
});
