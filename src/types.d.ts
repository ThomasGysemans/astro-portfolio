import type { IUser } from "@db/models/DAOUser.ts";
import type { Technology } from "@db/models/DAOSkills.ts";

declare global {
    type Project = {
        name: string;
        slug: string;
        description: string;
        summary: string;
        presentationPicture?: number | null;
        pictures: string[];
        technologies: Technology[];
        teamMembers: number; // 1 for solo
        nature: string; // the `frenchName` property in the `ProjectNature` class
        type: string; // the `frenchName` property in the `ProjectType` class
        date: string; // "2023-2024" or "2023" etc.
        languages: string[]; // the `short` property in the `Language` class
        github?: string | null;
        link?: string | null;
        updatedAt: Date;
        showcase: boolean;
        showcaseDescription?: string | null;
    };

    type FormResult = {
        error?: FormError;
        user: IUser;
    };

    type FormError = true | string;
}