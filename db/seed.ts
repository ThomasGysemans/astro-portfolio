import { db, ProjectTable, TechnologyTable } from 'astro:db';

// async function seedTechnologies(): Promise<void> {
//     await db.insert(TechnologyTable).values([
//         { name: "ThreeJS", logo: "http://localhost:4321/logos/ThreeJS.svg", loved: true },
//         { name: "HelloJS", logo: "http://localhost:4321/logos/ThreeJS.svg", loved: false },
//         { name: "YoyoJS", logo: "http://localhost:4321/logos/ThreeJS.svg", loved: false },
//         { name: "WeshJS", logo: "http://localhost:4321/logos/ThreeJS.svg", loved: false },
//     ]);
// }
//
// async function seedProjects(): Promise<void> {
//     await db.insert(ProjectTable).values([
//         {
//             name: "ScienceSky",
//             slug: ""
//         }
//     ]);
// }

// https://astro.build/db/seed
export default async function seed() {
	// await seedTechnologies();
}