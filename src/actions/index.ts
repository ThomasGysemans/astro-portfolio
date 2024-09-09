import { defineAction, z } from "astro:actions";
import { ActionResponse } from "@lib/ActionResponse.ts";

export const server = {
    getPicture: defineAction({
        input: z.object({
            path: z.string(),
        }),
        handler: async ({ path }) => {
            return "https//sciencesky.fr/logo.png";
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
