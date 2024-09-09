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
    presentationPicture?: number | null,
    pictures: string[],
    technologies: Technology[],
    teamMembers: number, // 1 for solo
    nature: string, // the `frenchName` property in the `ProjectNature` class
    type: string, // the `frenchName` property in the `ProjectType` class
    date: string, // "2023-2024" or "2023" etc.
    languages: string[], // the `short` property in the `Language` class
    github?: string | null,
    link?: string | null,
    updatedAt: Date,
    showcase: boolean,
    showcaseDescription?: string | null,
}

export type ShowcaseProject = Pick<
    FullProject,
    "slug" |
    "name" |
    "showcaseDescription"
>
