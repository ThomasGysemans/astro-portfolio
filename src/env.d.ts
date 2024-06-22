/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { IUser } from "@db/models/DAOUser.ts";

declare global {
    type Technology = {
        name: string;
        logo: string;
        loved: boolean;
    };

    type Project = {
        name: string;
        slug: string;
        description: string;
        summary: string;
        presentation_picture?: number;
        pictures: string[];
        technologies: Technology[];
        team_members: number; // 1 for solo
        nature: string; // the `frenchName` property in the `ProjectNature` class
        type: string; // the `frenchName` property in the `ProjectType` class
        date: string; // "2023-2024" or "2023" etc.
        languages: string[]; // the `short` property in the `Language` class
        github?: string;
        link?: string;
        updatedAt: Date;
        showcase: boolean;
    };

    type FormResult = {
        error?: FormError;
        user: IUser;
    };

    type FormError = true | string;

    type Picture = {
        file: File
        url: string
    }
}