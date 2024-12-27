export type Technology = {
    name: string,
    logo: string,
    loved: boolean,
}

export type FullProject = {
    name: string,
    slug: string,
    description: string,
    summary: string,
    presentationPicture: string,
    pictures: string[],
    technologies: Technology[],
    teamMembers: number, // 1 for solo
    nature: string, // the `frenchName` property in the `ProjectNature` class
    type: string, // the `frenchName` property in the `ProjectType` class
    date: string, // "2023-2024" or "2023" etc.
    languages: string[], // the `short` property in the `Language` class
    github?: string,
    link?: string,
    showcase: boolean,
    showcaseDescription?: string | null,
}

export type PBCollection<T> = {
    id: string,
    collectionId: string,
    updated: string,
    created: string,
} & T;

export type ShowcaseProject = Pick<
    FullProject,
    "slug" |
    "name" |
    "showcaseDescription" |
    "description"
>

export type PBShowcaseProject = PBCollection<{
    slug: string,
    name: string,
    expand: {
        french?: ProjectText,
        english?: ProjectText,
    },
}>;

export type PBProject = PBCollection<{
    name: string,
    slug: string,
    presentationPicture: string,
    pictures: string[],
    teamMembers: number,
    nature: string,
    type: string,
    date: string,
    languages: string[],
    github?: string,
    link?: string,
    showcase: boolean,
    technologies: string[],
    french: string,
    english: string,
    expand: {
        technologies?: PBCollection<Technology>[],
        french?: ProjectText,
        english?: ProjectText,
    },
}>;

export type ProjectText = {
    description: string,
    summary: string,
    showcaseDescription?: string,
};

export type PBTechnology = PBCollection<Technology>;
