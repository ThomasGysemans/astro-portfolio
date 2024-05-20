import {
    db,
    ProjectTable,
    TechnologyTable,
    ProjectTechnologiesTable,
    UserTable,
    LanguagesTable,
    PicturesTable
} from 'astro:db';

async function seedUser(): Promise<void> {
    await db
        .insert(UserTable)
        .values([
            { email: "gysemansthomas@gmail.com", username: "ThomasG", password: "azerty" }
        ]);
}

async function seedTechnologies(): Promise<void> {
    await db
        .insert(TechnologyTable)
        .values([
            { name: "ThreeJS", logo: "http://localhost:4321/logos/ThreeJS.svg", loved: false },
            { name: "Svelte", logo: "http://localhost:4321/logos/svelte-icon.png", loved: true },
        ])
}

async function seedProjects(): Promise<void> {
    await db
        .insert(ProjectTable)
        .values([
            {
                name: "Space Visitor",
                slug: "space-visitor",
                description: "Un jeu 3D dans lequel le joueur vole dans le Système Solaire avec sur son passage les planètes, dont la Terre, et le Soleil.",
                summary: "Un jeu 3D dans lequel le joueur vole dans le Système Solaire avec sur son passage les planètes, dont la Terre, et le Soleil.",
                presentation_picture: 0,
                team_members: 1,
                nature: "Personnel",
                type: "Jeu vidéo",
                date: "2024",
                github: "ThomasGysemans/SpaceVisitor",
                link: "https://spacevisitor.sciencesky.fr",
                updatedAt: new Date(),
                showcase: true,
            }
        ]);
    await db
        .insert(ProjectTechnologiesTable)
        .values([
            { id: 1, project: "space-visitor", technology: "Svelte" },
            { id: 2, project: "space-visitor", technology: "ThreeJS" }
        ]);
    await db
        .insert(LanguagesTable)
        .values([
            { id: 1, project: "space-visitor", language: "EN" },
        ]);
    await db
        .insert(PicturesTable)
        .values([
            { id: 1, project: "space-visitor", picture: "http://localhost:4321/exemple-space-visitor.png" },
            { id: 2, project: "space-visitor", picture: "http://localhost:4321/sciencesky-image.jpeg" },
            { id: 3, project: "space-visitor", picture: "http://localhost:4321/stars.jpg" },
        ]);
}

export default async function seed() {
    await seedUser();
    await seedTechnologies();
    await seedProjects();
}