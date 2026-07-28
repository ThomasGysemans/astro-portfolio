import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CATEGORIES, CONTEXTS, TECH_ROLES } from "@data/categories";
import { GROUP_TITLES } from "@data/technologies";
import { LOCALES } from "@i18n/config";

// The PocketBase selects and the typed dictionaries of `src/data/` are two
// parallel lists that must stay in sync: a value added in the dashboard (which
// writes a migration here) without its labels would render as a raw identifier
// on the public pages. The accessors of `categories.ts` keep that from being a
// 500, but the mismatch itself must never reach production — so this test
// replays the migrations and compares the resulting schema to the code.

const MIGRATIONS_DIR = join(process.cwd(), "db/pb_migrations");

type Field = Record<string, unknown> & { id: string, name: string };
type Collection = Record<string, unknown> & { id: string, name: string, fields: Field[] };

// Minimal stand-in for the PocketBase migration runtime. It only implements
// what the migrations of this repo actually call — enough to rebuild the final
// schema without a database.
function replayMigrations(): Map<string, Collection> {
    const collections = new Map<string, Collection>();

    // PocketBase's `fields` is a typed collection, not a plain array: it
    // exposes addAt/removeById, and addAt replaces in place when a field with
    // the same id already exists (that is how "update field" works).
    const asFieldList = (fields: Field[]) =>
        Object.assign(fields, {
            addAt(index: number, field: Field) {
                const existing = fields.findIndex(f => f.id === field.id);
                if (existing === -1) fields.splice(index, 0, field);
                else fields[existing] = field;
            },
            removeById(id: string) {
                const index = fields.findIndex(f => f.id === id);
                if (index !== -1) fields.splice(index, 1);
            },
        });

    const app = {
        findCollectionByNameOrId(key: string): Collection {
            const collection = collections.get(key);
            if (!collection) throw new Error(`unknown collection ${key}`);
            return collection;
        },
        save(target: Collection | unknown) {
            // Records are saved too (data migrations); only collections matter.
            const collection = target as Collection;
            if (!collection?.fields) return;
            collections.set(collection.id, collection);
            collections.set(collection.name, collection);
        },
        delete(collection: Collection) {
            collections.delete(collection.id);
            collections.delete(collection.name);
        },
        // Data migrations iterate over real records; there are none here.
        findRecordsByFilter: () => [],
    };

    const Collection = function (this: unknown, data: Collection) {
        return Object.assign(Object.create(null), data, { fields: asFieldList(data.fields ?? []) });
    } as unknown as new (data: Collection) => Collection;
    const Field = function (this: unknown, data: Field) {
        return data;
    } as unknown as new (data: Field) => Field;
    const unmarshal = (data: object, collection: Collection) => Object.assign(collection, data);

    const files = readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith(".js")).sort();
    for (const file of files) {
        const source = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
        // Only the "up" callback is replayed, in chronological order.
        const run = new Function("migrate", "Collection", "Field", "unmarshal", source);
        run((up: (app: unknown) => void) => up(app), Collection, Field, unmarshal);
    }

    return collections;
}

const schema = replayMigrations();

function selectValues(collection: string, field: string): string[] {
    const found = schema.get(collection)?.fields.find(f => f.name === field);
    if (!found) throw new Error(`no field ${collection}.${field} in the replayed schema`);
    expect(found.type, `${collection}.${field} is no longer a select`).toBe("select");
    return found.values as string[];
}

// Both directions matter: an unknown identifier would show up raw on the site,
// and a dictionary entry with no matching select value is dead code.
function expectSameKeys(values: string[], dictionary: object, label: string) {
    expect([...values].sort(), `${label} is out of sync with its PocketBase select`)
        .toEqual(Object.keys(dictionary).sort());
}

describe("PocketBase selects match the typed dictionaries", () => {
    it("replays every migration", () => {
        expect(schema.size).toBeGreaterThan(0);
        for (const name of ["projects", "technologies", "project_techs"]) {
            expect(schema.has(name), `collection ${name} is missing`).toBe(true);
        }
    });

    it("keeps CATEGORIES aligned with projects.categories", () => {
        expectSameKeys(selectValues("projects", "categories"), CATEGORIES, "CATEGORIES");
    });

    it("keeps CONTEXTS aligned with projects.context", () => {
        expectSameKeys(selectValues("projects", "context"), CONTEXTS, "CONTEXTS");
    });

    it("keeps TECH_ROLES aligned with project_techs.role", () => {
        expectSameKeys(selectValues("project_techs", "role"), TECH_ROLES, "TECH_ROLES");
    });

    it("keeps GROUP_TITLES aligned with technologies.group", () => {
        expectSameKeys(selectValues("technologies", "group"), GROUP_TITLES, "GROUP_TITLES");
    });

    it("keeps projects.languages aligned with the configured locales", () => {
        expect(selectValues("projects", "languages").sort()).toEqual([...LOCALES].sort());
    });
});

describe("selects the pages read without a fallback", () => {
    // A blank value is not part of a select's `values`, so it would slip past
    // the checks above and reach the pages as an empty identifier.
    it("requires the selects whose label the public pages display", () => {
        const required = (collection: string, field: string) =>
            schema.get(collection)?.fields.find(f => f.name === field)?.required;
        expect(required("projects", "categories"), "projects.categories must be required").toBe(true);
        expect(required("projects", "context"), "projects.context must be required").toBe(true);
        expect(required("project_techs", "role"), "project_techs.role must be required").toBe(true);
        expect(required("technologies", "group"), "technologies.group must be required").toBe(true);
    });
});
