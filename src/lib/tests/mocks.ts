import { ProjectNature } from "@lib/ProjectNature.ts";
import { ProjectType } from "@lib/ProjectType.ts";

function getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function getRandomLetter(): string {
    const min = 'a'.charCodeAt(0);
    const max = 'z'.charCodeAt(0);
    return String.fromCharCode(getRandomNumber(min, max + 1));
}

function getRandomName(maxlength: number, containsWhitespace = true): string {
    const length = Math.random() * maxlength + 1;
    let expectWord = false;
    let name = "";
    for (let i = 0; i < length; i++) {
        if (containsWhitespace && !expectWord && Math.random() < 0.2) {
            name += " ";
            expectWord = true;
        } else {
            name += getRandomLetter();
            expectWord = false;
        }
    }
    return name.trim();
}

export function mockSkills(length?: number): Technology[] {
    length ??= Math.ceil(Math.random() * 5 + 1);
    return createMock(length, () => {
        return {
            name: getRandomName(15, false),
            logo: "/logos/ThreeJS.svg",
            loved: Math.random() < 0.1,
        };
    });
}

function getRandomProjectType(): string {
    const types = ProjectType.getAllTypes();
    return types[Math.floor(Math.random() * types.length)].frenchName;
}

function getRandomProjectNature(): string {
    const natures = ProjectNature.getAllNatures();
    return natures[Math.floor(Math.random() * natures.length)].frenchName;
}

export function mockProject(): Project {
    const name = getRandomName(25);
    return {
        name: name,
        slug: name.replace(/ /g, "-"),
        description: "Un jeu 3D dans lequel le joueur vole dans le Système Solaire avec sur son passage les planètes, dont la Terre, et le Soleil.",
        summary: "Un jeu 3D dans lequel le joueur vole dans le Système Solaire avec sur son passage les planètes, dont la Terre, et le Soleil.",
        presentation_picture: 0,
        pictures: ["/exemple-space-visitor.png"],
        technologies: mockSkills(),
        team_members: Math.ceil(Math.random() * 20 + 1),
        nature: getRandomProjectNature(),
        type: getRandomProjectType(),
        date: "202" + Math.ceil(Math.random() * 4 + 1),
    };
}

function createMock<T>(length: number, mock: () => T): T[] {
    const projects: T[] = [];
    for (let i = 0; i < length; i++) {
        projects.push(mock());
    }
    return projects;
}

export function mockProjects(length?: number): Project[] {
    length ??= Math.ceil(Math.random() * 5 + 1);
    return createMock(length, mockProject);
    // const projects: Project[] = [];
    // for (let i = 0; i < length; i++) {
    //     projects.push(mockProject());
    // }
    // return projects;
}