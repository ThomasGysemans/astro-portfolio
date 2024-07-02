import type { Technology } from "@db/models/DAOSkills.ts";
import { ProjectNature } from "@lib/ProjectNature.ts";
import { ProjectType } from "@lib/ProjectType.ts";
import { Language } from "@lib/Language.ts";

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

function mockSkill(): Technology {
    return {
        name: getRandomName(15, false),
        logo: "/logos/ThreeJS.svg",
        loved: Math.random() < 0.1,
    };
}

export function mockSkills(length?: number): Technology[] {
    length ??= Math.ceil(Math.random() * 5 + 1);
    return createMock(length, mockSkill);
}

function getRandomProjectType(): string {
    const types = ProjectType.getAllTypes();
    return types[Math.floor(Math.random() * types.length)].frenchName;
}

function getRandomProjectNature(): string {
    const natures = ProjectNature.getAllNatures();
    return natures[Math.floor(Math.random() * natures.length)].frenchName;
}

export function mockProject(skillsPool?: Technology[]): Project {
    const name = getRandomName(25);
    const technologies = skillsPool?.filter(() => Math.random() < 0.2);
    if (technologies?.length === 0) {
        technologies.push(mockSkill());
    }
    const languages = [Language.FR.short];
    if (Math.random() < 0.5) {
        languages.push(Language.EN.short);
    }
    return {
        name: name,
        slug: name.replace(/ /g, "-"),
        description: "Un jeu 3D dans lequel le joueur vole dans le Système Solaire avec sur son passage les planètes, dont la Terre, et le Soleil.",
        summary: "Un jeu 3D dans lequel le joueur vole dans le Système Solaire avec sur son passage les planètes, dont la Terre, et le Soleil.",
        presentationPicture: 0,
        pictures: ["/exemple-space-visitor.png"],
        technologies: technologies ?? mockSkills(),
        teamMembers: Math.ceil(Math.random() * 20 + 1),
        nature: getRandomProjectNature(),
        type: getRandomProjectType(),
        date: "202" + Math.ceil(Math.random() * 4 + 1),
        github: "ThomasGysemans/SpaceVisitor",
        link: "https://spacevisitor.sciencesky.fr/",
        showcase: Math.random() < 0.3,
        updatedAt: new Date(),
        languages,
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
    const skillsPool = mockSkills();
    return createMock(length, () => mockProject(skillsPool));
}