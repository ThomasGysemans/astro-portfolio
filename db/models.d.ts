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

export type ShowcaseProject = Pick<
    FullProject,
    "slug" |
    "name" |
    "showcaseDescription"
>

export type PBCollection<T> = {
    id: string,
    collectionId: string,
    updated: string,
    created: string,
    expand?: Partial<T>,
} & T

export type PBFullProject = PBCollection<FullProject>;
export type PBTechnology = PBCollection<Technology>;
