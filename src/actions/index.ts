import { defineAction, z } from "astro:actions";
import { DAOUser } from "@db/models/DAOUser.ts";
import { DAOProject } from "@db/models/DAOProject.ts";
import { Language } from "@lib/Language.ts";
import { ActionResponse } from "@lib/ActionResponse.ts";
import { Storage } from "@db/storage.ts";
import { isValidFile } from "@lib/files.ts";
import generateSlug from "@lib/generateSlug.ts";

export const server = {
    getPicture: defineAction({
        input: z.object({
            path: z.string(),
        }),
        handler: async ({ path }) => {
            return await Storage.getImageUrl(path);
        },
    }),
    deleteProject: defineAction({
        accept: "form",
        input: z.object({
            slug: z.string(),
        }),
        handler: async ({ slug }, context) => {
            if (!(await DAOUser.isAdmin(context.cookies))) return forbidden();
            if (await DAOProject.remove(slug)) {
                return ok();
            } else {
                return crash("Rien n'a pu être supprimé.")
            }
        },
    }),
    submitProject: defineAction({
        accept: "form",
        input: z.object({
            presentationPicture: z.number(),
            name: z.string(),
            summary: z.string(),
            teamMembers: z.number(),
            nature: z.string(),
            date: z.string(),
            description: z.string(),
            showcase: z.boolean(),
            showcaseDescription: z.string().optional(),
            skills: z.string(),
            github: z.string(),
            link: z.string(),
            existingPictures: z.string().optional(),
            pictures: z.array(z.custom<File>()),
            projectType: z.string(),
            ...Language
                .getAllLanguages()
                .map(l => ({ [l.short]: z.string() }))
                .reduce((acc, obj) => {
                    const key = Object.keys(obj)[0];
                    acc[key] = obj[key];
                    return acc;
                })
        }),
        handler: async (obj, context) => {
            console.log("handling project's submission");
            console.log(obj);
            if (!obj.pictures.every(isValidFile)) return invalid("L'un des fichiers n'est pas valide.");
            if (obj.presentationPicture < 0 || obj.presentationPicture >= obj.pictures.length) return invalid("L'image de présentation n'est pas valide.");
            const slug = generateSlug(obj.name);
            if (await DAOProject.exists(slug)) {
                return invalid(`Le projet de slug "${slug}" existe déjà.`);
            }
            const allLanguages = Language.getAllLanguages().map(l => l.short);
            const result = await DAOProject.create({
                ...obj,
                type: obj.projectType,
                skills: obj.skills.split(','),
                languages: Object.keys(obj).filter(k => allLanguages.includes(k)),
            }, slug);
            if (result) {
                return ok();
            } else {
                return crash("Le projet n'a pas pu être sauvegardé !");
            }
        },
    }),
};

function ok(): ActionResponse {
    return new ActionResponse()
}

function invalid(msg: string): ActionResponse {
    return new ActionResponse(400, msg);
}

function forbidden(): ActionResponse {
    return new ActionResponse(401, "Non autorisé !");
}

function crash(msg: string): ActionResponse {
    return new ActionResponse(500, msg);
}