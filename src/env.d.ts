/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { ProjectNature } from "@lib/ProjectNature.ts";

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
        nature: ProjectNature;
        type: string; // the `frenchName` property in the `ProjectType` class
        date: string; // "2023-2024" or "2023" etc.
    };
}