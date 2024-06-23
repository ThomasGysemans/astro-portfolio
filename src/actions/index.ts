import { defineAction, z } from "astro:actions";
import { DAOUser } from "@db/models/DAOUser.ts";
import { DAOProject } from "@db/models/DAOProject.ts";

export const server = {
    deleteProject: defineAction({
        accept: "form",
        input: z.object({
            slug: z.string(),
        }),
        handler: async ({ slug }, context) => {
            if (!(await DAOUser.isAdmin(context.cookies))) {
                return {
                    error: "Non autorisé !",
                    status: 500,
                }
            }
            const success = await DAOProject.remove(slug);
            if (success) {
                return {
                    status: 200,
                };
            } else {
                return {
                    error: "Requête invalide !",
                    status: 400,
                };
            }
        },
    }),
};